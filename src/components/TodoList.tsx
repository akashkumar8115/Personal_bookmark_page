"use client";

import { useState } from 'react';
import { Modal } from './Modal';
import { api } from "@/trpc/react";

export function TodoList({ userId }: { userId: string }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', url: '' });

    // TRPC Hooks
    const utils = api.useUtils();
    const { data: todoList = [], isLoading } = api.todo.getAll.useQuery({ userId });
    
    const createMutation = api.todo.create.useMutation({
        onSuccess: () => { void utils.todo.getAll.invalidate({ userId }); },
    });

    const deleteMutation = api.todo.delete.useMutation({
        onSuccess: () => { void utils.todo.getAll.invalidate({ userId }); },
    });

    const toggleMutation = api.todo.toggle.useMutation({
        onSuccess: (data) => {
            void utils.todo.getAll.invalidate({ userId });
            if (data.completedAt && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(`Task Completed: "${data.title}"`);
            }
        },
    });

    const formatUrl = (url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return '';
        return !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed;
    };

    const handleAdd = () => {
        if (newItem.title.trim() && newItem.url.trim()) {
            createMutation.mutate({
                userId,
                title: newItem.title.trim(),
                url: formatUrl(newItem.url),
            });
            setNewItem({ title: '', url: '' });
            setIsModalOpen(false);
        } else {
            alert("Please fill both fields");
        }
    };

    // Bug Fix: Target by ID instead of array index
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this Todo?")) {
            deleteMutation.mutate({ id });
        }
    };

    // Bug Fix: Target by ID and safely request Notification permission
    const handleToggleDone = (id: string, currentStatus: Date | null) => {
        const newStatus = currentStatus ? null : new Date();
        toggleMutation.mutate({
            id,
            completedAt: newStatus
        });
    };

    const filteredList = todoList.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        // Skeleton Loader
        return (
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg h-full animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-6"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg h-full transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                    Todo List
                    <i
                        className="bi bi-clipboard2-plus text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add new todo"
                    />
                </h1>
            </div>

            {/* Search Input */}
            <div className="flex mb-4 gap-2">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                        <i className="bi bi-search" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="Search todos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 transition-colors">
                    <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3 font-semibold">#</th>
                            <th className="p-3 font-semibold">Todo</th>
                            <th className="p-3 font-semibold">URL</th>
                            <th className="p-3 font-semibold">Actions</th>
                            <th className="p-3 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No tasks found. You&apos;re all caught up!
                                </td>
                            </tr>
                        ) : (
                            filteredList.map((item, i) => (
                                <tr
                                    key={item.id}
                                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${item.completedAt ? 'opacity-50' : ''}`}
                                >
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{i + 1}</td>
                                    <td className={`p-3 font-medium text-gray-900 dark:text-white ${item.completedAt ? 'line-through' : ''}`}>
                                        {item.title}
                                    </td>
                                    <td className="p-3">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline truncate block max-w-[100px] md:max-w-xs"
                                        >
                                            {item.url}
                                        </a>
                                    </td>
                                    <td className="p-3 flex gap-4">
                                        <i
                                            className={`bi bi-check-circle cursor-pointer text-lg transition-colors ${item.completedAt ? 'text-gray-400 hover:text-gray-500' : 'text-blue-500 hover:text-blue-600'}`}
                                            onClick={() => handleToggleDone(item.id, item.completedAt)}
                                            title={item.completedAt ? "Mark as undone" : "Mark as done"}
                                        />
                                        <i
                                            className="bi bi-trash text-red-500 cursor-pointer text-lg hover:text-red-600 transition-colors"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete task"
                                        />
                                    </td>
                                    <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Todo"
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Add Task
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                        <input
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="e.g. Review PR"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Related URL (Optional)</label>
                        <input
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="e.g. github.com"
                            type="url"
                            value={newItem.url}
                            onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}