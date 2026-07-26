import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/config";


// ── Icons (same as before) ─────────────────────────────────────────────
function PlusIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 14V20M21 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LeaveIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l4-4-4-4M12 13H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AddMemberIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <path d="M18 14v7M21.5 17.5h-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function MembersIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <circle cx="18" cy="8" r="2" />
            <path d="M18 12v3M16.5 13.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

// ── Team Card ─────────────────────────────────────────────────────────
function TeamCard({ team, onAdd, onLeave, onViewMembers, currentUserEmail }) {
    const [hovered, setHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const isAdmin = team.role === 'ADMIN' || team.admin_id === currentUserEmail;

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl p-4 relative transition-all duration-150 hover:border-gray-300 hover:shadow-md hover:-translate-y-px"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        >
            <div className={`absolute top-3 right-3 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}>
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                        </svg>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                            <button
                                onClick={() => { onViewMembers(team); setMenuOpen(false); }}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <MembersIcon /> View Members
                            </button>
                            
                            {isAdmin && (
                                <button
                                    onClick={() => { onAdd(team); setMenuOpen(false); }}
                                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <AddMemberIcon /> Add Member
                                </button>
                            )}
                            
                            <button
                                onClick={() => { onLeave(team); setMenuOpen(false); }}
                                className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LeaveIcon /> Leave Team
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{team.name}</h3>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <UsersIcon />
                <span>{team.role}</span>
            </div>
        </div>
    );
}

// ── Create Team Modal ─────────────────────────────────────────────────
function CreateTeamModal({ isOpen, onClose, onCreate }) {
    const [teamName, setTeamName] = useState("");
    const [creating, setCreating] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        setCreating(true);
        await onCreate(teamName.trim());
        setCreating(false);
        setTeamName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <PlusIcon />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Create Team</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Collaborate with your crew</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Name</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            placeholder="e.g., Design Wizards"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            disabled={creating}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} disabled={creating} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={creating || !teamName} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {creating ? "Creating..." : "Create Team"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Leave Team Modal ──────────────────────────────────────────────────
function LeaveTeamModal({ team, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <LeaveIcon />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Leave Team</h2>
                        <p className="text-xs text-gray-400 mt-0.5">You can always rejoin later</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-5">
                    Are you sure you want to leave{" "}
                    <span className="font-medium text-gray-900">{team?.name}</span>?
                </p>
                <div className="flex gap-2 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Stay
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Add Member Modal ──────────────────────────────────────────────────
function AddMemberModal({ isOpen, onClose, onConfirm, teamName, isLoading }) {
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onConfirm(email.trim());
    };

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <UsersIcon />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Add Member</h2>
                        <p className="text-xs text-gray-400 mt-0.5">to {teamName}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">User Email</label>
                        <input
                            type="email"
                            required
                            autoFocus
                            placeholder="e.g., teammate@example.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading || !email.trim()} className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                            {isLoading ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── View Members Modal ──────────────────────────────────────────────────
function ViewMembersModal({ isOpen, onClose, teamName, members, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <UsersIcon />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Team Members</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{teamName}</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No members found
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto mb-4">
                        {members.map((member, index) => (
                            <div
                                key={member.id || index}
                                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-medium">
                                    {member.name ? member.name.charAt(0).toUpperCase() : member.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {member.name || member.email}
                                    </p>
                                    <p className="text-xs text-gray-400">{member.email}</p>
                                </div>
                                <div className="text-xs">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        member.role === 'ADMIN' 
                                            ? 'bg-purple-50 text-purple-600' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {member.role || 'MEMBER'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [filteredTeams, setFilteredTeams] = useState([]);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teamToLeave, setTeamToLeave] = useState(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [toast, setToast] = useState(null);
    
    // View Members Modal
    const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
    const [selectedTeamForMembers, setSelectedTeamForMembers] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Load teams
    const loadTeams = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/api/teams/get`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to load teams: ${res.status} - ${errorText}`);
            }

            const data = await res.json();
            setTeams(data);
            setFilteredTeams(data);

        } catch (e) {
            console.error("Load teams error:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);


    useEffect(() => {
        if (!search.trim()) {
            setFilteredTeams(teams);
            return;
        }

        setSearching(true);
        const filtered = teams.filter(team =>
            team.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredTeams(filtered);
        setSearching(false);

    }, [search, teams]);

    const handleCreateTeam = async (name) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/teams/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (!res.ok) throw new Error("Failed to create team");

            showToast(`"${name}" created`);
            await loadTeams();

        } catch (e) {
            setError(e.message);
        }
    };

    // Leave team
    const handleLeaveTeam = async () => {
        if (!teamToLeave) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/teams/${teamToLeave.id}/leave`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to leave team");

            setTeams(prev => prev.filter(t => t.id !== teamToLeave.id));
            showToast(`Left "${teamToLeave.name}"`);
            setTeamToLeave(null);
        } catch (e) {
            setError(e.message);
        }
    };

    // Add member to team
    const handleAddMember = (team) => {
        setSelectedTeam(team);
        setIsAddMemberModalOpen(true);
    };

    const handleConfirmAddMember = async (email) => {
        if (!selectedTeam || !email) return;

        setIsAddingMember(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/teams/${selectedTeam.id}/addMember`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to add member");
            }

            showToast(`Added ${email} to "${selectedTeam.name}"`);
            setIsAddMemberModalOpen(false);
            setSelectedTeam(null);

            await loadTeams();

        } catch (e) {
            setError(e.message);
            showToast(e.message, "error");
        } finally {
            setIsAddingMember(false);
        }
    };

    const handleCancelAddMember = () => {
        setIsAddMemberModalOpen(false);
        setSelectedTeam(null);
    };

    // View team members
    const handleViewMembers = async (team) => {
        setSelectedTeamForMembers(team);
        setIsViewMembersModalOpen(true);
        setLoadingMembers(true);
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/teams/${team.id}/members`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error("Failed to load team members");
            }

            const members = await res.json();
            setTeamMembers(members);
        } catch (e) {
            console.error("Load members error:", e);
            showToast(e.message, "error");
            setTeamMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleCloseViewMembersModal = () => {
        setIsViewMembersModalOpen(false);
        setSelectedTeamForMembers(null);
        setTeamMembers([]);
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };


    return (
        <div className="max-w-5xl mx-auto px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <div className="flex items-center justify-between mb-9">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">My Teams</h1>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {loading ? "—" : `${filteredTeams.length} team${filteredTeams.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    <PlusIcon />
                    Create Team
                </button>
            </div>

            <div className="relative mb-6">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 15 15" fill="none">
                    <path d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM13 13l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    placeholder="Search teams…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors w-64"
                />
                {searching && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
                    </div>
                )}
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

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Active Teams</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-20 gap-3 text-gray-400 text-sm">
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                        Loading teams…
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300 gap-2">
                        {search ? (
                            <p className="text-sm text-gray-400">
                                No teams match "<span className="font-mono">{search}</span>"
                            </p>
                        ) : (
                            <>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-sm text-gray-400">No teams yet — create your first team</p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredTeams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onAdd={handleAddMember}
                            onLeave={(t) => setTeamToLeave(t)}
                            onViewMembers={handleViewMembers}
                        />
                    ))
                )}
            </div>

            {/* Create Team Modal */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateTeam}
            />

            {/* Leave Team Modal */}
            {teamToLeave && (
                <LeaveTeamModal
                    team={teamToLeave}
                    onConfirm={handleLeaveTeam}
                    onCancel={() => setTeamToLeave(null)}
                />
            )}

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={handleCancelAddMember}
                onConfirm={handleConfirmAddMember}
                teamName={selectedTeam?.name || ""}
                isLoading={isAddingMember}
            />

            {/* View Members Modal */}
            <ViewMembersModal
                isOpen={isViewMembersModalOpen}
                onClose={handleCloseViewMembersModal}
                teamName={selectedTeamForMembers?.name || ""}
                members={teamMembers}
                isLoading={loadingMembers}
            />

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50 ${toast.type === "error" ? "bg-red-600" : "bg-gray-900"
                    }`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}