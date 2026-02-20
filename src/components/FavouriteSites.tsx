"use client";

import { useState } from 'react';
import { Modal } from './Modal';
import { api } from "@/trpc/react";

interface FavItem {
  id: string;
  title: string;
  url: string;
}

export function FavouriteSites({ userId }: { userId: string }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', url: '' });

  const utils = api.useUtils();
  const { data: favList = [], isLoading } = api.bookmark.getAll.useQuery({ userId });

  const createMutation = api.bookmark.create.useMutation({
    onSuccess: () => { void utils.bookmark.getAll.invalidate({ userId }); },
  });
  const deleteMutation = api.bookmark.delete.useMutation({
    onSuccess: () => { void utils.bookmark.getAll.invalidate({ userId }); },
  });
  const updateMutation = api.bookmark.update.useMutation({
    onSuccess: () => { void utils.bookmark.getAll.invalidate({ userId }); },
  });

  // Helper to ensure URLs always have http:// or https:// so links don't break
  const formatUrl = (url: string) => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleAdd = () => {
    if (newItem.title.trim() && newItem.url.trim()) {
      createMutation.mutate({
        userId,
        title: newItem.title.trim(), 
        url: formatUrl(newItem.url) 
      });
      setNewItem({ title: '', url: '' });
      setIsModalOpen(false);
    } else {
      alert("Please fill both fields");
    }
  };

  // Bug Fix: Delete by item reference, not by index, to support safe filtering
  const handleDelete = (itemToDelete: FavItem) => {
    if (confirm(`Delete ${itemToDelete.title}?`)) {
      deleteMutation.mutate({ id: itemToDelete.id });
    }
  };

  // Bug Fix: Edit by item reference, not by index
  const handleEdit = (itemToEdit: FavItem) => {
    const newTitle = prompt("Enter New Title", itemToEdit.title);
    const newUrl = prompt("Enter New URL", itemToEdit.url);
    
    if (newTitle && newUrl) {
      updateMutation.mutate({
        id: itemToEdit.id,
        title: newTitle.trim(),
        url: formatUrl(newUrl)
      });
    }
  };

  const filteredList = favList.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    // Skeleton loader to prevent hydration errors
    return (
      <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg h-full animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <section className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg h-full transition-colors" aria-labelledby="fav-sites-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="fav-sites-title" className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
          Favourite Sites
          <i 
            className="bi bi-bookmark-plus text-blue-500 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setIsModalOpen(true)}
            aria-label="Add new site"
          />
        </h2>
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
            placeholder="Search favorites..." 
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
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">URL</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No sites found. Add some!
                </td>
              </tr>
            ) : (
              filteredList.map((item, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 text-gray-600 dark:text-gray-400">{i + 1}</td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{item.title}</td>
                  <td className="p-3">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline truncate block max-w-[150px] md:max-w-xs"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="p-3 flex gap-4">
                    <i className="bi bi-pencil-square text-green-500 cursor-pointer hover:text-green-600 transition-colors" onClick={() => handleEdit(item)} />
                    <i className="bi bi-trash text-red-500 cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleDelete(item)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Integration */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Site"
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
              Add Item
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Title</label>
            <input 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
              placeholder="e.g. GitHub" 
              value={newItem.title} 
              onChange={e => setNewItem({...newItem, title: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <input 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
              placeholder="e.g. github.com" 
              type="url"
              value={newItem.url} 
              onChange={e => setNewItem({...newItem, url: e.target.value})} 
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}