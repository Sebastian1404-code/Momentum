import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [duration, setDuration] = useState("");
    const userId=localStorage.getItem("userId");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !startDate || !duration) {
            alert("Please fill all fields");
            return;
        }

        // Prepare task object to send
        const taskData = {
            name,
            startDate,
            duration: Number(duration),
            userId
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to create task");
            }

            alert("Task created successfully!");
            navigate("/dashboard"); // Or wherever you want to go after creation
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8 text-gray-900">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Task Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Start Date & Time</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Duration (hours)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                        required
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-900"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );

}
