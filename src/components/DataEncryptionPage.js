import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData, retrieveData } from '../services/api';

// Left Component for Data Encryption
const EncryptionPanel = ({ onEncrypt }) => {
    const [inputData, setInputData] = useState('');
    const [encryptedResult, setEncryptedResult] = useState(null);

    const handleEncrypt = async () => {
        try {
            const token = localStorage.getItem('token');
            const result = await encryptData(inputData, token);
            setEncryptedResult(result);
            onEncrypt(result.record_id);
        } catch (error) {
            console.error('Encryption failed', error);
        }
    };

    return (
        <div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Encryption Panel</h2>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter Data to Encrypt
                </label>
                <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                    rows="6"
                    placeholder="Enter your sensitive message here..."
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                />
                <button
                    onClick={handleEncrypt}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                    Encrypt Message
                </button>
            </div>

            {encryptedResult && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-700">
                        <strong>Encryption Successful!</strong>
                        <br />
                        Record ID: {encryptedResult.record_id}
                    </p>
                </div>
            )}
        </div>
    );
};

// Right Component for Data Retrieval
const RetrievalPanel = ({ recordId }) => {
    const [retrievedData, setRetrievedData] = useState(null);
    const [error, setError] = useState('');

    const handleRetrieve = async () => {
        if (!recordId) {
            setError('No record ID available. Encrypt a message first.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const result = await retrieveData(recordId, token);
            setRetrievedData(result);
            setError('');
        } catch (err) {
            setError(err.error || 'Retrieval failed');
            setRetrievedData(null);
        }
    };

    return (
        <div className="w-1/2 p-6 bg-white rounded-lg shadow-md ml-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Retrieval Panel</h2>

            <div className="mb-4">
                <button
                    onClick={handleRetrieve}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                >
                    Retrieve Bob's Message
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {retrievedData && (
                <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">Decrypted Message:</h3>
                    <p className="text-blue-700">{retrievedData.original_data}</p>
                </div>
            )}
        </div>
    );
};

// Main Page Component
const DataEncryptionPage = () => {
    const [recordId, setRecordId] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
            <div className="container mx-auto">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex">
                        <EncryptionPanel onEncrypt={setRecordId} />
                        <RetrievalPanel recordId={recordId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataEncryptionPage;