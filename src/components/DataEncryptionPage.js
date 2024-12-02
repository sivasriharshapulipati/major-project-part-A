import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData, retrieveData } from '../services/api';

const DataEncryptionPage = () => {
    const [inputData, setInputData] = useState('');
    const [recordId, setRecordId] = useState('');
    const [encryptedResult, setEncryptedResult] = useState(null);
    const [retrievedData, setRetrievedData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleEncrypt = async () => {
        try {
            const token = localStorage.getItem('token');
            const result = await encryptData(inputData, token);
            setEncryptedResult(result);
            setError('');
        } catch (err) {
            setError(err.error || 'Encryption failed');
        }
    };

    const handleRetrieve = async () => {
        try {
            const token = localStorage.getItem('token');
            const result = await retrieveData(recordId, token);
            setRetrievedData(result);
            setError('');
        } catch (err) {
            setError(err.error || 'Retrieval failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                                    Quantum Secure Data Management
                                </h2>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Enter Data to Encrypt
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="4"
                                        value={inputData}
                                        onChange={(e) => setInputData(e.target.value)}
                                        placeholder="Enter your sensitive data here..."
                                    />
                                    <button
                                        onClick={handleEncrypt}
                                        className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                                    >
                                        Encrypt Data
                                    </button>
                                </div>

                                {encryptedResult && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                        <strong>Encryption Successful!</strong>
                                        <p>Record ID: {encryptedResult.record_id}</p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Retrieve Encrypted Data
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={recordId}
                                        onChange={(e) => setRecordId(e.target.value)}
                                        placeholder="Enter Record ID"
                                    />
                                    <button
                                        onClick={handleRetrieve}
                                        className="mt-2 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                                    >
                                        Retrieve Data
                                    </button>
                                </div>

                                {retrievedData && (
                                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
                                        <strong>Retrieved Data:</strong>
                                        <p>{retrievedData.original_data}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 flex items-center space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataEncryptionPage;