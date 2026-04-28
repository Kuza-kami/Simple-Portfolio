import React from 'react';
import { motion } from 'framer-motion';
import { X, Key, Plus, Edit2, Shield, MousePointer2 } from 'lucide-react';

interface AdminGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminGuide: React.FC<AdminGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Key className="text-design-blue" size={20} />,
      title: "1. Access Admin Mode",
      desc: "Go to the Portfolio section and type 'IWANTTOBEADMIN' in the search bar. This will prompt you to login with your Google account."
    },
    {
      icon: <Plus className="text-design-green" size={20} />,
      title: "2. Adding Content",
      desc: "Once logged in as an authorized admin, you will see 'Add Project' and 'Add Event' buttons across the site. Simply click them to upload new work."
    },
    {
      icon: <Edit2 className="text-blue-400" size={20} />,
      title: "3. Modification Codes",
      desc: "Type 'IWANTTOREMOVEPROJECT' in the search bar to toggle Edit Mode. This reveals edit and delete buttons on every card."
    },
    {
      icon: <Shield className="text-purple-400" size={20} />,
      title: "4. User Management",
      desc: "As the lead admin, you can add other users via the 'Manage Admins' button in the About/Contact section once you are logged in."
    },
    {
      icon: <MousePointer2 className="text-orange-400" size={20} />,
      title: "5. Production Setup",
      desc: "If logging in fails on Vercel with 'unauthorized-domain', add your Vercel URL to the 'Authorized Domains' in your Firebase Console Settings."
    }
  ];

  const codes = [
    { code: "IWANTTOBEADMIN", effect: "Triggers Login" },
    { code: "IWANTTOLEAVEADMIN", effect: "Triggers Logout" },
    { code: "IWANTTOADDPROJECT", effect: "Quick Add Project" },
    { code: "IWANTTOADDTIMELINE", effect: "Quick Add Event" },
    { code: "IWANTTOREMOVEPROJECT", effect: "Toggle Edit Tools" },
    { code: "IWANTTOSEEGUIDE", effect: "Opens this Help" }
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl"
      >
        <div className="p-8 sm:p-12 overflow-y-auto max-h-[85vh]">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
               <Shield className="text-design-blue" size={24} />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Administration Terminal</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tight">
              Admin <span className="italic font-serif font-light text-design-green">Control Guide</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:bg-white/10 transition-all duration-500">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{step.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-design-green/5 border border-design-green/10 p-8 rounded-[2rem] mb-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-design-green mb-6 flex items-center gap-2">
              <MousePointer2 size={12} /> Command Dictionary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {codes.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <code className="text-white font-mono text-[11px] font-bold tracking-tighter bg-white/10 px-2 py-0.5 rounded">
                    {item.code}
                  </code>
                  <span className="text-white/30 text-[10px] uppercase font-mono tracking-widest">
                    {item.effect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white/20 text-[10px] font-mono uppercase tracking-widest mt-8">
            Terminal Access Restricted to Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminGuide;
