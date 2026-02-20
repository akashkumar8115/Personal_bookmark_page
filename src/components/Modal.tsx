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
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 transition-colors">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h5>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-gray-700 dark:text-gray-300">
                    {children}
                </div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 bg-gray-50 dark:bg-gray-800/50 transition-colors">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}