import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";


export default function ReceiptEntryPage() {
    const [product, setProduct] = useState({ name: '', quantity: '', unit_price: '' });
    const [products, setProducts] = useState([]);
    const [receiptInfo, setReceiptInfo] = useState({
        store: '',
        location: '',
        paymentMethod: 'CASH'  // default value
    });
    const navigate=useNavigate();

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const addProduct = () => {
        if (!product.name || !product.quantity || !product.unit_price) return;

        const quantity = parseFloat(product.quantity);
        const unit_price = parseFloat(product.unit_price);
        const total_price = parseFloat((unit_price * quantity).toFixed(2));

        setProducts([
            ...products,
            {
                name: product.name,
                quantity,
                unit_price,
                total_price
            }
        ]);

        setProduct({ name: '', quantity: '', unit_price: '' });
    };

    const deleteProduct = (index) => {
        const updated = [...products];
        updated.splice(index, 1);
        setProducts(updated);
    };

    const handleReceiptInfoChange = (e) => {
        const { name, value } = e.target;
        setReceiptInfo({ ...receiptInfo, [name]: value });
    };

    const submitReceipt = async () => {
        if (!receiptInfo.store || !receiptInfo.location || !receiptInfo.paymentMethod || products.length === 0) {
            alert('Please fill in all fields and add at least one product.');
            return;
        }

        const receiptData = {
            store: receiptInfo.store,
            location: receiptInfo.location,
            paymentMethod: receiptInfo.paymentMethod,
            items: products,
            userId: parseInt(localStorage.getItem('userId'), 10)
        };

        try {
            const response = await fetch('http://localhost:8080/api/receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(receiptData)
            });

            if (response.ok) {
                alert('Receipt saved successfully!');
                setProducts([]);
                setReceiptInfo({ store: '', location: '', paymentMethod: 'CASH' });
                navigate('/dashboard');
            } else {
                alert('Failed to save receipt');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting receipt');
        }
    };

    const totalSum = products.reduce((acc, item) => acc + parseFloat(item.total_price), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center py-10 px-6">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 bg-white bg-opacity-90 text-black p-6 rounded-xl shadow-2xl border border-gray-300">

                {/* LEFT: Product Entry */}
                <div className="w-full md:w-1/2 p-4">
                    <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                    <div className="space-y-4">
                        <input
                            name="name"
                            value={product.name}
                            onChange={handleProductChange}
                            placeholder="Product Name"
                            className="w-full p-2 border rounded bg-white text-black"
                        />
                        <input
                            name="quantity"
                            type="number"
                            value={product.quantity}
                            onChange={handleProductChange}
                            placeholder="Quantity"
                            className="w-full p-2 border rounded bg-white text-black"
                        />
                        <input
                            name="unit_price"
                            type="number"
                            value={product.unit_price}
                            onChange={handleProductChange}
                            placeholder="Unit Price"
                            className="w-full p-2 border rounded bg-white text-black"
                        />
                        <button
                            onClick={addProduct}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                {/* RIGHT: Product Table + Receipt Info */}
                <div className="w-full md:w-1/2 p-4">
                    <h2 className="text-xl font-semibold mb-4">Receipt</h2>

                    <table className="w-full mb-4 border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Unit Price</th>
                            <th className="border p-2">Total</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((p, i) => (
                            <tr key={i}>
                                <td className="border p-2">{p.name}</td>
                                <td className="border p-2">{p.quantity}</td>
                                <td className="border p-2">{p.unit_price}</td>
                                <td className="border p-2">{p.total_price}</td>
                                <td className="border p-2">
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => deleteProduct(i)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    No products added
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {products.length > 0 && (
                        <div className="text-right font-semibold mb-4">
                            Total Receipt: ${totalSum}
                        </div>
                    )}

                    <div className="space-y-2">
                        <input
                            name="store"
                            value={receiptInfo.store}
                            onChange={handleReceiptInfoChange}
                            placeholder="Store Name"
                            className="w-full p-2 border rounded bg-white text-black"
                        />
                        <input
                            name="location"
                            value={receiptInfo.location}
                            onChange={handleReceiptInfoChange}
                            placeholder="Location"
                            className="w-full p-2 border rounded bg-white text-black"
                        />
                        <select
                            name="paymentMethod"
                            value={receiptInfo.paymentMethod}
                            onChange={handleReceiptInfoChange}
                            className="w-full p-2 border rounded bg-white text-black"
                        >
                            <option value="CASH">Cash</option>
                            <option value="CARD">Card</option>
                        </select>
                        <button
                            onClick={submitReceipt}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                        >
                            Submit Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
