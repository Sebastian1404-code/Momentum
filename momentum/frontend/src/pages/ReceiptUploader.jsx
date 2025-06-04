import React, { useState } from 'react';

export default function ReceiptUploader() {
    const [file, setFile] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setReceiptData(null);
            setMessage('');
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please upload a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setMessage('');
        setReceiptData(null);

        try {
            const response = await fetch('https://70aa-34-125-117-41.ngrok-free.app/upload', {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log("Parsed response:", data);
            setReceiptData(data);
            setSaveMessage('');

        } catch (error) {
            console.error('Upload failed:', error);
            setMessage('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveReceipt = async () => {
        if (!receiptData) return;

        try {
            const response = await fetch('/api/receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: 1, // Replace this with the actual logged-in user ID
                    store: receiptData.store,
                    location: receiptData.location || "Unknown", // fallback
                    paymentMethod: receiptData.payment_method,
                    items: receiptData.items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total_price: item.total_price
                    }))
                })
            });

            const result = await response.text();
            setSaveMessage(result);
        } catch (error) {
            console.error("Failed to save receipt:", error);
            setSaveMessage("Failed to save receipt: " + error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 text-black p-6 font-sans flex flex-col md:flex-row gap-8">
            {/* Left: Upload Section */}
            <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />

                {file && (
                    <div className="mb-4">
                        <p className="font-semibold">Preview:</p>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full max-w-xs mt-2 border rounded shadow"
                        />
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    {isUploading ? 'Processing...' : 'Process Receipt'}
                </button>

                {message && (
                    <p className="text-red-600 mt-4">{message}</p>
                )}
            </div>

            {/* Right: Display Receipt */}
            <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6 overflow-auto">
                {receiptData ? (
                    <>
                        <h2 className="text-xl font-bold mb-2">Receipt from: {receiptData.store}</h2>
                        <p><strong>Total:</strong> {receiptData.total} RON</p>
                        <p><strong>Payment Method:</strong> {receiptData.payment_method}</p>

                        <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border border-gray-300">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2">Quantity</th>
                                    <th className="border px-4 py-2">Unit Price</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Total Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {receiptData.items?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-center">{item.quantity}</td>
                                        <td className="border px-4 py-2 text-center">{item.unit_price}</td>
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2 text-center">{item.total_price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={handleSaveReceipt}
                            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                        >
                            Save Receipt
                        </button>

                        {saveMessage && (
                            <p className="mt-2 text-blue-600 font-medium">{saveMessage}</p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 italic">No receipt data yet. Upload and process an image.</p>
                )}
            </div>
        </div>
    );

}
