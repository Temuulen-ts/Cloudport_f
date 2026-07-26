import { useState, useEffect, useCallback } from "react";
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

function DownloadIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v9M4 7.5l3.5 4 3.5-4M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Avatar({ name }) {
    const initials = name
        ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";
    const hue = name
        ? [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
        : 200;
    return (
        <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-semibold flex-shrink-0"
            style={{ background: `hsl(${hue}, 55%, 48%)`, fontSize: "9px" }}
        >
            {initials}
        </span>
    );
}

// ── File card ─────────────────────────────────────────────────────────
function SharedFileCard({ file, onDownload, isDownloading }) {
    const [hovered, setHovered] = useState(false);
    const isThisFileDownloading = isDownloading === file.file_name;

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer relative transition-all duration-150 hover:border-gray-300 hover:shadow-md hover:-translate-y-px"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Download button */}
            <div className={`absolute top-2 right-2 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                    disabled={isThisFileDownloading}
                    className={`w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-colors duration-100 ${
                        isThisFileDownloading 
                            ? "opacity-50 cursor-not-allowed" 
                            : "text-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-500"
                    }`}
                    title="Download"
                >
                    {isThisFileDownloading ? (
                        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <DownloadIcon />
                    )}
                </button>
            </div>

            <div className="mb-3">
                <FileIcon filename={file.file_name} />
            </div>

            <p className="text-sm font-medium text-gray-800 truncate leading-tight">{file.file_name}</p>
            <p className="text-xs text-gray-400 uppercase font-mono mt-0.5 mb-2">{getExt(file.file_name)}</p>

            {/* Shared by */}
            <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
                <Avatar name={file.team_name} />
                <span className="text-xs text-gray-400 truncate">{file.team_name || "Unknown"}</span>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <p className="text-sm text-gray-400">No team files shared yet</p>
        </div>
    );
}


export default function TeamShares() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [downloadingFile, setDownloadingFile] = useState(null); 

    const loadFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/teams/teamFiles`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();

            const mappedFiles = data.map(file => ({
                file_name: file.file_name,
                uploader: file.uploader_email,
                team_name: file.team_name
            }));

            setFiles(mappedFiles);
        } catch (e) {
            setError("Could not load team shared files: " + e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadFiles(); }, [loadFiles]);

    const handleDownload = async (file) => {
        if (downloadingFile === file.file_name) {
            console.log("Download already in progress for this file");
            return;
        }

        setDownloadingFile(file.file_name);
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/download/sharedurl?key=${encodeURIComponent(file.file_name)}&sharedEmail=${file.uploader}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
            
            const { downloadUrl } = await res.json();
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = getDisplayName(file.file_name);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            showToast(`Downloading ${file.file_name}...`);
        } catch (e) {
            setError("Download failed: " + e.message);
            showToast(`Failed to download ${file.file_name}`);
        } finally {
            setTimeout(() => {
                setDownloadingFile(null);
            }, 500);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <div className="flex items-center justify-between mb-9">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Team Shares</h1>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {loading ? "—" : `${files.length} file${files.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Team Files</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-20 gap-3 text-gray-400 text-sm">
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                        Loading team files...
                    </div>
                ) : files.length === 0 ? (
                    <EmptyState />
                ) : (
                    files.map((file, index) => (
                        <SharedFileCard
                            key={`${file.file_name}-${index}`}
                            file={file}
                            onDownload={handleDownload} 
                            isDownloading={downloadingFile}
                        />
                    ))
                )}
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50">
                    {toast}
                </div>
            )}
        </div>
    );
}