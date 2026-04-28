import React, { useState, useEffect } from 'react';
import { X, Trash2, ShieldCheck, Mail, Loader2, UserPlus } from 'lucide-react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminUser {
  email: string;
  addedBy: string;
}

const AdminManagerModal: React.FC<AdminManagerModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    
    // Attempt to read admins
    const unsubscribe = onSnapshot(collection(db, 'admins'), (snapshot) => {
      const arr: AdminUser[] = [];
      snapshot.forEach((d) => arr.push(d.data() as AdminUser));
      setAdmins(arr);
      setError(null);
    }, (err) => {
      console.warn("Could not fetch admins. User may not be an admin.", err);
      setError("You do not have permission to view or manage admins.");
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !user) return;
    const emailToAdd = newEmail.trim().toLowerCase();
    
    try {
      setLoading(true);
      setError(null);
      await setDoc(doc(db, 'admins', emailToAdd), {
        email: emailToAdd,
        addedBy: user.email,
        createdAt: serverTimestamp()
      });
      setNewEmail('');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, `admins/${emailToAdd}`);
      setError(err?.message || "Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (emailToRemove: string) => {
    if (!user || user.email === emailToRemove) return;
    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, 'admins', emailToRemove));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `admins/${emailToRemove}`);
      setError(err?.message || "Failed to remove admin.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-design-black dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 bg-design-blue/10 dark:bg-design-blue/20 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="text-design-blue w-6 h-6" />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-design-black dark:text-white mb-2 uppercase tracking-tight">Manage Admins</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
          Authorized users can add and edit portfolio projects.
        </p>

        {error ? (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        ) : (
          <>
            <form onSubmit={handleAddAdmin} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="flex-1 bg-neutral-100 dark:bg-[#202020] border-none rounded-xl px-4 py-3 text-sm text-design-black dark:text-white focus:ring-2 focus:ring-design-blue"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !newEmail.trim()}
                  className="flex items-center justify-center gap-2 bg-design-black dark:bg-white text-white dark:text-design-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500">Current Admins</h4>
              <div className="space-y-3">
                {/* Keep original owner visual */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-design-black dark:text-white">kuzashikami@gmail.com</p>
                      <p className="text-xs text-gray-500">Owner</p>
                    </div>
                  </div>
                  <ShieldCheck size={16} className="text-design-blue" />
                </div>

                {admins.map((admin) => (
                  <div key={admin.email} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-gray-400" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-design-black dark:text-white truncate">{admin.email}</p>
                        <p className="text-xs text-gray-500">Added by {admin.addedBy}</p>
                      </div>
                    </div>
                    {user?.email !== admin.email && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.email)}
                        disabled={loading}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminManagerModal;
