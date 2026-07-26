import { useState, useEffect, useCallback } from "react";
import { uploadFile } from "../services/Upload.js";
import { API_BASE_URL } from "../utils/config";
const EXT_COLORS = {
  pdf: "#e74c3c", jpg: "#f39c12", jpeg: "#f39c12", png: "#3498db",
  gif: "#9b59b6", mp4: "#e67e22", mp3: "#1abc9c", zip: "#95a5a6",
  txt: "#7f8c8d", js: "#f1c40f", ts: "#3498db", java: "#e74c3c",
  py: "#3498db", json: "#f39c12", html: "#e67e22", css: "#3498db",
  doc: "#2980b9", docx: "#2980b9", xls: "#27ae60", xlsx: "#27ae60",
};

function getExt(filename) {
  return (filename || "").split(".").pop().toLowerCase();
}
function getColor(filename) {
  return EXT_COLORS[getExt(filename)] || "#94a3b8";
}
function getDisplayName(key) {
  if (!key) return "";
  return key.includes("/") ? key.split("/").pop() : key;
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1v9M4 5l3.5-4L11 5M2 11h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1v9M4 7.5l3.5 4 3.5-4M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 14V20M21 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 1h4M2 4h11M12.5 4l-.5 8.5a1 1 0 01-1 1H4a1 1 0 01-1-1L2.5 4M6 6.5v4M9 6.5v4"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon({ filename }) {
  const color = getColor(filename);
  const ext = getExt(filename).toUpperCase().slice(0, 4);
  return (
    <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-12">
      <rect width="40" height="48" rx="6" fill="#f7f7f5" />
      <path d="M6 0h20l14 14v34a6 6 0 01-6 6H6a6 6 0 01-6-6V6a6 6 0 016-6z" fill="#f7f7f5" />
      <path d="M26 0l14 14H32a6 6 0 01-6-6V0z" fill={color} opacity="0.35" />
      <rect x="4" y="28" width="32" height="14" rx="3" fill={color} />
      <text x="20" y="38" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="500" fill="white">
        {ext}
      </text>
      <rect x="6" y="18" width="18" height="2" rx="1" fill="#d1d5db" />
      <rect x="6" y="23" width="22" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

function ProgressItem({ fileName, pct, message }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium font-mono text-gray-800 truncate max-w-xs">{fileName}</span>
        <span className="text-xs font-mono text-blue-600 font-medium ml-2">{pct}%</span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{message}</p>
      <div className="h-0.5 bg-blue-100 rounded-full overflow-hidden">
        <div className="h-0.5 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DeleteModal({ file, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
            <TrashIcon />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Delete file</h2>
            <p className="text-xs text-gray-400 mt-0.5">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900 font-mono">{file.file_name}</span>?
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ isOpen, onClose, onShare, fileKey, email, setEmail, sharing }) {
  if (!isOpen) return null;
  const fileName = getDisplayName(fileKey);

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Share File</h2>
        <p className="text-sm text-gray-500 mb-5">
          Sharing: <span className="font-mono text-gray-800 font-medium">{fileName}</span>
        </p>
        <form onSubmit={onShare}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email or Team Name
            </label>
            <input
              id="email"
              required
              placeholder="@example.com or My Team ..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sharing}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={sharing} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={sharing || !email} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {sharing ? "Sending..." : "Share File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileCard({ file, onDownload, onShareClick, onDelete, isDeleting }) {
  const [hovered, setHovered] = useState(false);
  const name = file.file_name;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 cursor-pointer relative transition-all duration-150
        hover:border-gray-300 hover:shadow-md hover:-translate-y-px
        ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Spinner while deleting */}
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin" />
        </div>
      )}

      {/* 3 action buttons — share, download, delete */}
      <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={(e) => { e.stopPropagation(); onShareClick(file); }}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-100"
          title="Share"
        >
          <ShareIcon />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(file); }}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-100"
          title="Download"
        >
          <DownloadIcon />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(file); }}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-100"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="mb-3">
        <FileIcon filename={name} />
      </div>
      <p className="text-sm font-medium text-gray-800 truncate leading-tight">{name}</p>
      <p className="text-xs text-gray-400 uppercase font-mono mt-0.5">{getExt(name)}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
      <p className="text-sm text-gray-400">No files yet — upload your first file</p>
    </div>
  );
}

export default function MyDrive() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [search, setSearch] = useState("");

  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredFiles(files); 
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/search?query=${encodeURIComponent(search)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const results = await res.json();
        setFilteredFiles(results);
      } catch (e) {
        setError("Search failed: " + e.message);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);  
  }, [search, files]);
  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/upload/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setFiles(data);
    } catch (e) {
      setError("Could not load files: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || uploading) return;

    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [file.name]: { pct: 0, message: "preparing…" } }));

    try {
      await uploadFile(file, (pct, message) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: { pct, message } }));
      });
      showToast(`${file.name} uploaded`);
      setTimeout(() => {
        setUploadProgress(prev => { const n = { ...prev }; delete n[file.name]; return n; });
        loadFiles();
      }, 1500);
    } catch (e) {
      setUploadProgress(prev => { const n = { ...prev }; delete n[file.name]; return n; });
      setError(e.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const key = `${file.file_name}`;
      const res = await fetch(
        `${API_BASE_URL}/api/download/url?file_name=${encodeURIComponent(key)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { downloadUrl } = await res.json();
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.file_name;
      a.click();
    } catch (e) {
      setError("Download failed: " + e.message);
    }
  };

  const handleDeleteClick = (file) => {
    setConfirmDelete(file);
  };

  const handleDeleteConfirm = async () => {
    const file = confirmDelete;
    setConfirmDelete(null);
    setDeleting(file.file_id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/upload/delete?fileId=${encodeURIComponent(file.file_id)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `${res.status}`);
      }
      setFiles(prev => prev.filter(f => f.file_id !== file.file_id));
      showToast(`${file.file_name} deleted`);
    } catch (e) {
      setError("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const openShareModal = (file) => {
    setFileToShare(file);
    setShareEmail("");
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setTimeout(() => { setFileToShare(null); setShareEmail(""); }, 200);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareEmail || !fileToShare) return;
    setIsSharing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            fileName: fileToShare.file_name,
            emailToShare: shareEmail
          })
        }
      );
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error);
        closeShareModal();
        throw new Error(data.error);
      }
      closeShareModal();
      showToast(`Shared ${fileToShare.file_name} with ${shareEmail}`);
    } catch (e) {
      setError("Share failed: " + e.message);
    } finally {
      setIsSharing(false);
    }
  };


  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
//------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-9">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">My Drive</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {loading ? "—" : `${files.length} file${files.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <label className={`flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <UploadIcon />
          Upload file
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
<div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 15 15" fill="none">
          <path d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM13 13l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search files…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors w-48"
        />
        {/* Spinner while searching */}
        {searching && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}
        {/* Clear button */}
        {search && !searching && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
              <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {Object.entries(uploadProgress).map(([name, { pct, message }]) => (
            <ProgressItem key={name} fileName={name} pct={pct} message={message} />
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Files</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20 gap-3 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading files…
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300 gap-2">
            <p className="text-sm text-gray-400">
              No files match "<span className="font-mono">{search}</span>"
            </p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <FileCard
              key={file.file_id}
              file={file}
              onDownload={handleDownload}
              onShareClick={openShareModal}
              onDelete={handleDeleteClick}
              isDeleting={deleting === file.file_id}
            />
          ))
        )}
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <DeleteModal
          file={confirmDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        onShare={handleShareSubmit}
        fileKey={fileToShare?.file_name}
        email={shareEmail}
        setEmail={setShareEmail}
        sharing={isSharing}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}