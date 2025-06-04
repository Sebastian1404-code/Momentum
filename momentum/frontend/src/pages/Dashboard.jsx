import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import DotTrail from "../components/DotTrail.jsx"; // ✅ Import the dots animation

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const payload = token ? parseJwt(token) : null;
    const username = payload?.sub || "User";

    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        const fetchTodayTasks = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            try {
                const response = await fetch(`http://localhost:8080/api/tasks/user/today?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch tasks");

                const data = await response.json();

                const tasksWithDateObjects = data.map(task => ({
                    ...task,
                    startDateObj: new Date(
                        task.startDate[0],
                        task.startDate[1] - 1,
                        task.startDate[2],
                        task.startDate[3],
                        task.startDate[4]
                    )
                }));

                tasksWithDateObjects.sort((a, b) => a.startDateObj - b.startDateObj);

                setTasks(tasksWithDateObjects);

            } catch (err) {
                console.error(err);
            } finally {
                setLoadingTasks(false);
            }
        };

        fetchTodayTasks();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const backgroundImage = "/download.jpeg"; // ✅ Must be placed in public/

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative">
            <DotTrail />

            {/* Navbar */}
            <nav className="bg-blue-800 bg-opacity-60 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate("/my-receipts")}
                            className="hover:bg-blue-700 px-4 py-2 rounded transition"
                        >
                            My Receipts
                        </button>
                        <button
                            onClick={() => navigate("/upload")}
                            className="hover:bg-blue-700 px-4 py-2 rounded transition"
                        >
                            Upload Receipt
                        </button>
                        <button
                            onClick={() => navigate("/receipt")}
                            className="hover:bg-blue-700 px-4 py-2 rounded transition"
                        >
                            Receipts
                        </button>
                        <button
                            onClick={() => navigate("/task")}
                            className="hover:bg-blue-700 px-4 py-2 rounded transition"
                        >
                            Create Task
                        </button>
                        
                    </div>
                    <div className="flex space-x-4 items-center">
                        <span className="font-medium text-lg">Hi, {username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome back, {username}!</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Use the navigation bar to upload a new receipt or view your saved ones.
                </p>
                <blockquote className="italic text-blue-300 text-xl mb-8">
                    “The best way to predict the future is to invent it.” — Alan Kay
                </blockquote>

                {/* ✅ Image below quote */}
                <div className="flex justify-center">
                    <img
                        src={backgroundImage}
                        alt="Futuristic background"
                        className="w-full max-w-3xl rounded-lg shadow-lg border border-gray-700"
                    />
                </div>

                {/* 🗓️ Today's Tasks */}
                <div className="mt-10 text-left max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Today's Tasks</h2>

                    {loadingTasks ? (
                        <p className="text-gray-400">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-gray-400">No tasks scheduled for today.</p>
                    ) : (
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="mb-3 border-b border-gray-700 pb-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-lg">{task.name}</span>
                                            <span className="text-sm text-gray-400">
                      {task.startDateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })}
                    </span>
                                        </div>
                                        <p className="text-gray-400">
                                            Duration: {task.duration} hour{task.duration !== 1 ? "s" : ""}
                                        </p>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

            </main>
        </div>
    );
}
