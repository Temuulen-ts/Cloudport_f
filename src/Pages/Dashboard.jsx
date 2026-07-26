import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MyDrive from "../components/MyDrive";
import SharedWithMe from "../components/SharedWithMe";
import { formatBytes, decodeJWT } from "../utils/ProtectedRoutes";
import Team from "../components/Team";
import TeamShares from "../components/MyTeamShares";

export default function Dashboard() {

    const decoded = decodeJWT(localStorage.getItem("token"));
    const username = decoded["username"];
    const total_storage = formatBytes(decoded["storage"]);
    const used_storage = formatBytes(decoded["used"]);



    const dash =
        "sticky ml-4 mt-4 mb-4 flex-[1] px-10 py-10 flex flex-col justify-between max-md:ml-2 max-md:mr-2 max-md:px-4 max-md:py-6 max-md:sticky max-md:top-0 max-md:z-10 max-md:bg-black max-md:rounded-lg";
    const board = "bg-white ml-4 m-10 flex-[4] rounded-2xl max-md:ml-2 max-md:mr-2 max-md:mt-0 max-md:mb-4 max-md:rounded-xl";
    const navigate = useNavigate();

    const [selected, setSelected] = useState("drive");

    const activeClass = "text-blue-500 font-semibold";
    const inactiveClass = "text-white hover:text-gray-300 max-md:text-sm";

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    const views = {
        drive: <MyDrive />,
        sharedWithMe: <SharedWithMe />,
        team: <Team />,
        teamShares: <TeamShares/>
    };



    return (
        <div className="flex bg-black h-screen w-full max-md:flex-col max-md:h-auto max-md:min-h-screen">
            <div className={dash}>
                <div>

                    <div className="mb-10 max-md:mb-5">
                        <h2 className="text-lg font-semibold text-white max-md:text-base">{username}</h2>
                        <p className="text-gray-400 text-sm max-md:text-xs">{decoded['sub']}</p>
                    </div>


                    <nav className="space-y-4 max-md:space-y-3 max-md:flex max-md:flex-row max-md:space-y-0 max-md:space-x-4 max-md:overflow-x-auto max-md:pb-2">
                        <p
                            onClick={() => setSelected("drive")}
                            className={`cursor-pointer whitespace-nowrap ${selected === "drive" ? activeClass : inactiveClass
                                }`}
                        >
                            My Drive
                        </p>

                        <p
                            onClick={() => setSelected("sharedWithMe")}
                            className={`cursor-pointer whitespace-nowrap ${selected === "sharedWithMe"
                                ? activeClass
                                : inactiveClass
                                }`}
                        >
                            Shared With Me
                        </p>
                        <p
                            onClick={() => setSelected("team")}
                            className={`cursor-pointer whitespace-nowrap ${selected === "team"
                                ? activeClass
                                : inactiveClass
                                }`}
                        >
                            My Teams
                        </p>

                        <p
                            onClick={() => setSelected("teamShares")}
                            className={`cursor-pointer whitespace-nowrap ${selected === "teamShares"
                                ? activeClass
                                : inactiveClass
                                }`}
                        >
                            Team Shares
                        </p>
                    </nav>
                </div>

                <div className="max-md:mt-4">
                    <div className="mb-6 max-md:mb-4">
                        <div className="w-full bg-gray-300 h-2 rounded">
                            <div
                                className="bg-blue-500 h-2 rounded"
                                style={{ width: `${(decoded["used"] / decoded["storage"]) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-2 text-gray-300 max-md:text-xs">
                            {used_storage} of {total_storage} Used
                        </p>
                    </div>

                    <button
                        className="text-white flex items-center gap-3 hover:text-gray-300 max-md:text-sm max-md:gap-2"
                        onClick={handleLogout}
                    >
                        <span>Log out</span>
                        <div className="bg-white text-black rounded-full p-2 max-md:p-1.5">
                            <FiLogOut size={16} />
                        </div>
                    </button>
                </div>
            </div>

            <div className={board}>
                <div className="p-6 max-md:p-4">{views[selected]}</div>
            </div>
        </div>
    );
}