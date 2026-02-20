"use client";

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {

    // UX Improvement: Close on 'Escape' key & prevent background scrolling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevents scrolling behind the modal
        }

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        // Backdrop wrapper: Clicking the backdrop triggers onClose
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            {/* Modal Card: e.stopPropagation() prevents clicks inside the modal from closing it */}
            <div
                className="bg-slate-900 rounded-2xl shadow-2xl shadow-emerald-900/20 w-full max-w-md mx-4 overflow-hidden border border-emerald-500/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-slate-900/50">
                    <h5 className="text-lg font-bold text-slate-100">{title}</h5>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                        aria-label="Close modal"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-slate-300">
                    {children}
                </div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="p-4 border-t border-emerald-500/20 flex justify-end gap-2 bg-slate-900/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}