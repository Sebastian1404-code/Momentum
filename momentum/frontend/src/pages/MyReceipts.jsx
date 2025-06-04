import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


export default function MyReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {


        const fetchReceipts = async () => {
            const userId = localStorage.getItem('userId');
            console.log(userId);
            try {
                const response = await fetch(`http://localhost:8080/api/receipts/user?userId=${userId}`, {
                    method: 'GET',

                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const text = await response.text();  // not JSON if error
                    console.error("Backend error response:", text);
                    alert("Failed to fetch receipts: " + text);
                    return;
                }

                const data = await response.json();

                const formattedData = data.map(r => {
                    const [year, month, day, hour, minute] = r.receiptDate;
                    const dateObj = new Date(year, month - 1, day, hour, minute); // month is 0-based
                    return {
                        ...r,
                        formattedDate: dayjs(dateObj).format('DD MMM YYYY'),
                    };
                });

                setReceipts(formattedData);
                console.log(dayjs(data.receiptDate).format('DD MMM YYYY'));
                // const sorted = data.sort((a, b) => new Date(b.receiptDate) - new Date(a.receiptDate));
                // setReceipts(sorted);
            } catch (err) {
                console.error('Failed to fetch receipts', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    if (loading) return <div className="p-4">Loading receipts...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Receipts</h1>
            {receipts.length === 0 ? (
                <p className="text-gray-600">You have no receipts yet.</p>
            ) : (
                <div className="space-y-4">
                    {receipts.map((receipt) => (
                        <div
                            key={receipt.receiptId}
                            onClick={() => navigate(`/receipt/${receipt.receiptId}`)}
                            className="p-4 border rounded shadow-sm hover:bg-gray-100 cursor-pointer transition"
                        >
                            <h3 className="text-lg font-semibold">{receipt.store}</h3>
                            <p className="text-sm text-gray-500">
                                {receipt.formattedDate}
                            </p>
                            <p className="text-sm text-gray-600">{receipt.location}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );


}
