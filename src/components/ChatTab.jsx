import React, { useState, useEffect } from 'react';
import { exportToWord } from '../utils/helpers';

const ChatTab = ({ chatData, onUpdateChat }) => {
    const [questions, setQuestions] = useState(chatData || []);
    const [newQuestion, setNewQuestion] = useState('');
    const [responses, setResponses] = useState({});

    // Sync with parent state
    useEffect(() => {
        setQuestions(chatData || []);
    }, [chatData]);

    // Propagate changes to parent
    const updateParent = (updatedQuestions) => {
        onUpdateChat(updatedQuestions);
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        const questionItem = {
            id: Date.now(),
            text: newQuestion,
            createdAt: new Date().toISOString(),
            isComplete: false,
            responses: []
        };
        const updatedQuestions = [questionItem, ...questions];
        setQuestions(updatedQuestions);
        updateParent(updatedQuestions);
        setNewQuestion('');
    };

    const handleAddResponse = (questionId, responseText) => {
        if (!responseText.trim()) return;

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    responses: [...q.responses, {
                        text: responseText,
                        createdAt: new Date().toISOString()
                    }]
                };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        updateParent(updatedQuestions);
        setResponses({...responses, [questionId]: ''});
    };

    const toggleComplete = (questionId) => {
        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return { ...q, isComplete: !q.isComplete };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        updateParent(updatedQuestions);
    };

    const handleDelete = (questionId) => {
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        updateParent(updatedQuestions);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;
        const diffMinutes = Math.floor(diffMs / 60000);
        
        if (diffMinutes < 60) return `${diffMinutes} mins`;
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours} hours ${diffMinutes % 60} mins`;
    };

    const exportChat = () => {
        exportToWord(questions);
    };

    const handleExport = () => {
        let content = `<h1>Supervision Chat & ToDo</h1>`;
        questions.forEach(q => {
            content += `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: ${q.isComplete ? '#f7faf9' : '#ffffff'};">
                    <p style="font-size: 18px; font-weight: 600; ${q.isComplete ? 'text-decoration: line-through; color: #718096;' : 'color: #1a202c;'}">${q.text}</p>
                    <p style="font-size: 12px; color: #718096;">Asked: ${formatDate(q.createdAt)}</p>
                    <div style="margin-top: 12px; padding-left: 16px; border-left: 4px solid #edf2f7;">`;
            
            q.responses.forEach(resp => {
                content += `
                    <div style="background-color: #f7faf9; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
                        <p style="color: #2d3748;">${resp.text}</p>
                        <div style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
                            <span>${formatDate(resp.createdAt)}</span> | 
                            <span style="font-style: italic;">Took ${calculateDuration(q.createdAt, resp.createdAt)}</span>
                        </div>
                    </div>`;
            });

            content += `</div></div>`;
        });

        exportToWord(content, 'chat-export');
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Supervision Chat & ToDo</h2>
                <button
                    onClick={handleExport}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Export to Word
                </button>
            </div>
            
            <form onSubmit={handleAddQuestion} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Type a question or todo..."
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Ask/Add
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className={`border rounded-lg p-4 shadow-sm ${q.isComplete ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <p className={`text-lg font-medium ${q.isComplete ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {q.text}
                                </p>
                                <span className="text-xs text-gray-500">
                                    Asked: {formatDate(q.createdAt)}
                                </span>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => toggleComplete(q.id)}
                                    className={`px-3 py-1 rounded text-sm ${q.isComplete ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                    {q.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Responses Section */}
                        <div className="mt-4 pl-4 border-l-4 border-gray-100 space-y-3">
                            {q.responses.map((resp, idx) => (
                                <div key={idx} className="bg-gray-50 p-2 rounded relative">
                                    <p className="text-gray-800">{resp.text}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-400">
                                            {formatDate(resp.createdAt)}
                                        </span>
                                        <span className="text-xs text-blue-500 italic">
                                            Took {calculateDuration(q.createdAt, resp.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={responses[q.id] || ''}
                                    onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                                    placeholder="Add a response..."
                                    className="flex-1 p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleAddResponse(q.id, responses[q.id] || '');
                                    }}
                                />
                                <button
                                    onClick={() => handleAddResponse(q.id, responses[q.id] || '')}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {questions.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No questions or todos yet. Start by adding one above.
                    </div>
                )}
            </div>

        </div>
    );
};

export default ChatTab;