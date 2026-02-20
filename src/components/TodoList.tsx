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
            <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl shadow-xl shadow-emerald-900/10 h-full animate-pulse">
                <div className="h-8 bg-emerald-900/20 rounded w-32 mb-6"></div>
                <div className="h-10 bg-emerald-900/10 rounded w-full mb-4"></div>
                <div className="h-32 bg-emerald-900/10 rounded w-full"></div>
            </div>
        );
    }

    return (
        <section className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl shadow-xl shadow-emerald-900/10 h-full transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-500/40" aria-labelledby="todo-list-title">
            <div className="flex items-center justify-between mb-4">
                <h2 id="todo-list-title" className="text-2xl font-bold flex items-center gap-3 text-slate-100">
                    Todo List
                    <i
                        className="bi bi-clipboard2-plus text-emerald-500 cursor-pointer hover:scale-110 transition-transform hover:text-emerald-400"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add new todo"
                    />
                </h2>
            </div>

            {/* Search Input */}
            <div className="flex mb-4 gap-2">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-2.5 text-emerald-500/70">
                        <i className="bi bi-search" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-500/20 bg-slate-950/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors placeholder-slate-500"
                        placeholder="Search todos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 border border-emerald-500/20 rounded-xl hover:bg-emerald-900/20 text-slate-300 text-sm transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-emerald-500/20">
                <table className="w-full text-left border-collapse text-slate-300">
                    <thead className="bg-emerald-900/20 text-emerald-400">
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
                                <td colSpan={5} className="p-4 text-center text-slate-500">
                                    No tasks found. You&apos;re all caught up!
                                </td>
                            </tr>
                        ) : (
                            filteredList.map((item, i) => (
                                <tr
                                    key={item.id}
                                    className={`border-b border-emerald-500/10 hover:bg-emerald-900/10 transition-colors ${item.completedAt ? 'opacity-50' : ''}`}
                                >
                                    <td className="p-3 text-slate-500">{i + 1}</td>
                                    <td className={`p-3 font-medium text-slate-100 ${item.completedAt ? 'line-through text-slate-500' : ''}`}>
                                        {item.title}
                                    </td>
                                    <td className="p-3">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-400 hover:text-emerald-300 hover:underline truncate block max-w-[100px] md:max-w-xs"
                                        >
                                            {item.url}
                                        </a>
                                    </td>
                                    <td className="p-3 flex gap-4">
                                        <i
                                            className={`bi bi-check-circle cursor-pointer text-lg transition-colors ${item.completedAt ? 'text-slate-600 hover:text-slate-500' : 'text-emerald-500 hover:text-emerald-400'}`}
                                            onClick={() => handleToggleDone(item.id, item.completedAt)}
                                            title={item.completedAt ? "Mark as undone" : "Mark as done"}
                                        />
                                        <i
                                            className="bi bi-trash text-red-500 cursor-pointer text-lg hover:text-red-600 transition-colors"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete task"
                                        />
                                    </td>
                                    <td className="p-3 text-xs text-slate-500">
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
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            Add Task
                        </button>
                    </>
                }
            >
                <div className="space-y-4 text-slate-200">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-emerald-400">Task Title</label>
                        <input
                            className="w-full p-2 border border-emerald-500/30 rounded-xl bg-slate-950/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors"
                            placeholder="e.g. Review PR"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-emerald-400">Related URL (Optional)</label>
                        <input
                            className="w-full p-2 border border-emerald-500/30 rounded-xl bg-slate-950/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors"
                            placeholder="e.g. github.com"
                            type="url"
                            value={newItem.url}
                            onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                    </div>
                </div>
            </Modal>
        </section>
    );
}