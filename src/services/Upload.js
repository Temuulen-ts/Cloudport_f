const PART_SIZE           = 5  * 1024 * 1024;   // 5MB  — B2 minimum part size
const MULTIPART_THRESHOLD = 100 * 1024 * 1024;  // 100MB — below this use single PUT
import { API_BASE_URL } from "../utils/config";

// ------------------------------------------------------------------
// Main entry point — call this with a File object from an <input> or drop
// onProgress(pct, message) — optional callback for UI updates
// ------------------------------------------------------------------
export async function uploadFile(file, onProgress = () => {}) {
    if (file.size <= MULTIPART_THRESHOLD) {
        return uploadSmall(file, onProgress);
    } else {
        return uploadLarge(file, onProgress);
    }
}

// ------------------------------------------------------------------
// Small file — single presigned PUT, one HTTP request to B2
// ------------------------------------------------------------------
async function uploadSmall(file, onProgress) {
    onProgress(5, 'getting upload URL');

    // 1. Get presigned URL from backend
    const res = await apiFetch(
        `/api/upload/url?fileName=${enc(file.name)}&contentType=${enc(file.type)}&fileSize=${file.size}`
    );
    const { uploadUrl, key } = await res.json();

    onProgress(15, 'uploading');

    // 2. PUT directly to B2 — backend sees zero bytes
    const upload = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });

    if (!upload.ok) {
        throw new Error(`Upload failed: ${upload.statusText}`);
    }

    onProgress(95, 'registering');

    // 3. Notify backend — save to DB
    await notifyComplete(key, file);

    onProgress(100, 'done');
    return { key };
}

// ------------------------------------------------------------------
// Large file — multipart, each chunk PUTs directly to B2
// ------------------------------------------------------------------
async function uploadLarge(file, onProgress) {
    onProgress(2, 'starting multipart upload');

    // 1. Start multipart — backend creates upload in B2, returns uploadId + key
    const startRes = await apiFetch(
        `/api/upload/multipart/start?fileName=${enc(file.name)}&contentType=${enc(file.type)}`,
        { method: 'POST' }
    );
    const { uploadId, key } = await startRes.json();

    const totalParts = Math.ceil(file.size / PART_SIZE);
    const parts = [];

    try {
        // 2. Upload each chunk directly to B2
        for (let i = 0; i < totalParts; i++) {
            const partNumber = i + 1;
            const start      = i * PART_SIZE;
            const end        = Math.min(start + PART_SIZE, file.size);
            const chunk      = file.slice(start, end);

            // Get presigned URL for this specific part
            const partRes = await apiFetch(
                `/api/upload/multipart/part-url?key=${enc(key)}&uploadId=${uploadId}&partNumber=${partNumber}`
            );
            const { url } = await partRes.json();

            // PUT chunk straight to B2
            const partUpload = await fetch(url, { method: 'PUT', body: chunk });
            if (!partUpload.ok) {
                throw new Error(`Part ${partNumber} failed: ${partUpload.status}`);
            }

            // B2 returns ETag for each part — required for complete step
            const eTag = partUpload.headers.get('ETag');
            parts.push({ partNumber, eTag });

            const pct = Math.round((partNumber / totalParts) * 90);
            onProgress(pct, `part ${partNumber} of ${totalParts}`);
        }

        // 3. Tell B2 to assemble all parts into the final file
        onProgress(93, 'completing upload');
        await apiFetch('/api/upload/multipart/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, uploadId, parts })
        });

        // 4. Notify backend — save to DB
        onProgress(97, 'registering');
        await notifyComplete(key, file);

        onProgress(100, 'done');
        return { key };

    } catch (err) {
        // Abort on any failure — prevents orphaned uploads accumulating in B2
        await fetch(
            `/api/upload/multipart/abort?key=${enc(key)}&uploadId=${uploadId}`,
            { method: 'DELETE' }
        ).catch(() => {});  // best-effort, don't throw on abort failure

        throw err;
    }
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function notifyComplete(key, file) {
    return apiFetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, fileName: file.name, size: file.size ,type : file.type})
    });
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res;
}

function enc(str) {
    return encodeURIComponent(str);
}

// ------------------------------------------------------------------
// Download helpers
// ------------------------------------------------------------------

// Option A — stream through backend (private/auth-gated files)
export function downloadViaBackend(key) {
    const a = document.createElement('a');
    a.href = `/api/download/stream/${encodeURIComponent(key)}`;
    a.click();
}

// Option B — presigned URL, client downloads directly from B2
export async function downloadDirect(key) {
    const res  = await apiFetch(`/api/download/url/${encodeURIComponent(key)}`);
    const { downloadUrl } = await res.json();

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.click();
}