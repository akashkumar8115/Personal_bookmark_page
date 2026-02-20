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
      <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl shadow-xl shadow-emerald-900/10 h-full animate-pulse">
        <div className="h-8 bg-emerald-900/20 rounded w-48 mb-6"></div>
        <div className="h-10 bg-emerald-900/10 rounded w-full mb-4"></div>
        <div className="h-32 bg-emerald-900/10 rounded w-full"></div>
      </div>
    );
  }

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl shadow-xl shadow-emerald-900/10 h-full transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-500/40" aria-labelledby="fav-sites-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="fav-sites-title" className="text-2xl font-bold flex items-center gap-3 text-slate-100">
          Favourite Sites
          <i 
            className="bi bi-bookmark-plus text-emerald-500 cursor-pointer hover:scale-110 transition-transform hover:text-emerald-400" 
            onClick={() => setIsModalOpen(true)}
            aria-label="Add new site"
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
            placeholder="Search favorites..." 
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
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">URL</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No sites found. Add some!
                </td>
              </tr>
            ) : (
              filteredList.map((item, i) => (
                <tr key={i} className="border-b border-emerald-500/10 hover:bg-emerald-900/10 transition-colors">
                  <td className="p-3 text-slate-500">{i + 1}</td>
                  <td className="p-3 font-medium text-slate-100">{item.title}</td>
                  <td className="p-3">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 hover:text-emerald-300 hover:underline truncate block max-w-[150px] md:max-w-xs"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="p-3 flex gap-4">
                    <i className="bi bi-pencil-square text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" onClick={() => handleEdit(item)} />
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
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAdd} 
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
            >
              Add Item
            </button>
          </>
        }
      >
        <div className="space-y-4 text-slate-200">
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-400">Site Title</label>
            <input 
              className="w-full p-2 border border-emerald-500/30 rounded-xl bg-slate-950/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors" 
              placeholder="e.g. GitHub" 
              value={newItem.title} 
              onChange={e => setNewItem({...newItem, title: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-400">URL</label>
            <input 
              className="w-full p-2 border border-emerald-500/30 rounded-xl bg-slate-950/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors" 
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