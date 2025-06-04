import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReceiptDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);

    function formatReceiptDate(dateArray) {
        if (!Array.isArray(dateArray)) return "Invalid date";

        const [year, month, day, hour = 0, minute = 0] = dateArray;
        // JS month is 0-based, so subtract 1
        const dateObj = new Date(year, month - 1, day, hour, minute);
        return dateObj.toLocaleString();
    }

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/receipts/get/${id}`, {
                    method: 'GET',

                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Receipt not found');
                const data = await response.json();
                setReceipt(data);
            } catch (err) {
                console.error('Failed to load receipt', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, [id]);

    if (loading) return <div className="p-4">Loading receipt...</div>;
    if (!receipt) return <div className="p-4 text-red-500">Receipt not found.</div>;

    return (
        <div className="flex flex-col items-center p-6">
            <div className="w-[320px] bg-white text-black p-4 shadow-md border border-gray-300 rounded font-mono text-sm whitespace-pre">
                <div className="text-center mb-2">
                    <h2 className="font-bold text-lg">{receipt.store.toUpperCase()}</h2>
                    <p>{receipt.location}</p>
                    <p>{formatReceiptDate(receipt.receiptDate)}</p>
                </div>

                <div className="border-t border-dashed my-2"></div>

                {receipt.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.total_price.toFixed(2)} RON</span>
                    </div>
                ))}

                <div className="border-t border-dashed my-2"></div>

                <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>{receipt.total.toFixed(2)} RON</span>
                </div>

                <div className="border-t border-dashed my-2"></div>

                <div className="text-center mt-2">
                    <p>Payment: {receipt.paymentMethod}</p>
                    <p className="text-xs mt-2">Thank you for shopping!</p>
                </div>
            </div>

            <button
                onClick={() => navigate('/my-receipts')}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                ← Back to My Receipts
            </button>
        </div>
    );
}
