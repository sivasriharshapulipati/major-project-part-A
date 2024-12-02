import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    encryptData,
    retrieveData,
    messagesData
} from '../services/api';

const DataEncryptionPage = () => {
    const [inputData, setInputData] = useState('');
    const [recordId, setRecordId] = useState('');
    const [encryptedResult, setEncryptedResult] = useState(null);
    const [retrievedData, setRetrievedData] = useState(null);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch messages when component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const fetchedMessages = await messagesData(token);
                console.log(fetchedMessages);

                setMessages(fetchedMessages);
            } catch (err) {
                setError('Failed to fetch messages');
            }
        };

        fetchMessages();
    }, [encryptedResult]);

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
            setInputData(''); // Clear input after encryption
        } catch (err) {
            setError(err.error || 'Encryption failed');
        }
    };

    const handleMessageSelect = async (message) => {
        try {
            const token = localStorage.getItem('token');
            console.log(message._id.$oid);

            const result = await retrieveData(message._id.$oid, token);
            setSelectedMessage({
                ...message,
                decryptedData: result.original_data
            });
        } catch (err) {
            setError('Failed to decrypt message');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Messages Panel */}
            <div className="w-1/3 bg-white p-4 border-r">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="space-y-2">
                    {messages.map((message) => (
                        <div
                            key={message.record_id}
                            className={`
                p-3 rounded cursor-pointer 
                ${selectedMessage?.record_id === message.record_id
                                    ? 'bg-indigo-100 border-indigo-500'
                                    : 'bg-gray-100 hover:bg-gray-200'}
                border
              `}
                            onClick={() => handleMessageSelect(message)}
                        >
                            <p className="text-sm truncate">
                                {message.record_id}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Encryption and Decryption Panel */}
            <div className="w-2/3 p-8">
                {/* Encryption Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Encrypt New Message</h2>
                    <textarea
                        className="w-full p-2 border rounded mb-4"
                        rows="4"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="Enter message to encrypt..."
                    />
                    <button
                        onClick={handleEncrypt}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Encrypt
                    </button>

                    {encryptedResult && (
                        <div className="mt-4 bg-green-100 p-3 rounded">
                            <p>Encrypted Successfully</p>
                            <p>Record ID: {encryptedResult.record_id}</p>
                        </div>
                    )}
                </div>

                {/* Decryption Section */}
                {selectedMessage && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Decrypted Message</h2>
                        <div className="bg-blue-100 p-4 rounded">
                            <p className="font-semibold">Record ID:</p>
                            <p className="mb-2">{selectedMessage.record_id}</p>

                            <p className="font-semibold">Decrypted Data:</p>
                            <p>{selectedMessage.decryptedData}</p>
                        </div>
                    </div>
                )}

                {/* Error Handling */}
                {error && (
                    <div className="bg-red-100 p-3 rounded mt-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DataEncryptionPage;