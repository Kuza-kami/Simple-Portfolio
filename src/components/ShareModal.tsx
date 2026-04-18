import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Twitter, Linkedin, Facebook, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-black text-white hover:bg-neutral-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-[#0077b5] text-white hover:bg-[#006097]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877f2] text-white hover:bg-[#166fe5]'
    }
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-2xl relative border border-black/10 dark:border-white/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-black dark:text-white"
            >
              <X size={16} />
            </button>
            
            <h3 className="text-xl font-display font-bold text-black dark:text-white mb-6 uppercase tracking-tight">
              Share
            </h3>

            <div className="flex justify-center gap-4 mb-8">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-transform hover:-translate-y-1 ${link.color}`}
                  aria-label={`Share on ${link.name}`}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2 pr-12 overflow-hidden">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 font-mono truncate pl-2 select-all whitespace-nowrap">
                  {url}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-[#2a2a2a] text-black dark:text-white shadow-sm border border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-[#3a3a3a] transition-colors"
                aria-label="Copy link"
              >
                {copied ? <Check size={14} className="text-design-green" /> : <Link size={14} />}
              </button>
            </div>
            {copied ? (
              <p className="text-center text-xs font-mono text-design-green mt-3 uppercase tracking-widest h-4">
                Copied to clipboard
              </p>
            ) : (
              <p className="text-center text-xs font-mono text-transparent mt-3 uppercase tracking-widest h-4">
                {" "}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ShareModal;
