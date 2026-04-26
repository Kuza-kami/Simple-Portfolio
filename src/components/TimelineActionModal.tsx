import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Image as ImageIcon, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimelineEvent } from '../types';
import { compressImage } from '../utils/imageUtils';

interface TimelineActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: TimelineEvent | null;
  onSubmit: (event: TimelineEvent) => void;
}

const TimelineActionModal: React.FC<TimelineActionModalProps> = ({ 
  isOpen, 
  onClose, 
  eventToEdit, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    completionDate: '',
    desc: '',
    extendedDesc: '',
    origin: '',
    isVerified: false,
    showCertificate: false,
    certTitle: '',
    certInfo: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          year: eventToEdit.year,
          completionDate: eventToEdit.completionDate,
          desc: eventToEdit.desc,
          extendedDesc: eventToEdit.extendedDesc,
          origin: eventToEdit.origin || '',
          isVerified: eventToEdit.isVerified || false,
          showCertificate: eventToEdit.showCertificate || false,
          certTitle: eventToEdit.certTitle || '',
          certInfo: eventToEdit.certInfo || '',
        });
        setImagePreview(eventToEdit.image);
      } else {
        setFormData({
          title: '',
          year: new Date().getFullYear().toString(),
          completionDate: '',
          desc: '',
          extendedDesc: '',
          origin: '',
          isVerified: false,
          showCertificate: false,
          certTitle: '',
          certInfo: '',
        });
        setImagePreview('');
      }
      setErrors({});
    }
  }, [isOpen, eventToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setImagePreview(compressed);
        if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.desc.trim()) newErrors.desc = 'Description is required';
    if (!formData.extendedDesc.trim()) newErrors.extendedDesc = 'Extended description is required';
    if (!imagePreview) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newEvent: TimelineEvent = {
        id: eventToEdit?.id || Date.now(),
        title: formData.title,
        year: formData.year,
        completionDate: formData.completionDate,
        desc: formData.desc,
        extendedDesc: formData.extendedDesc,
        image: imagePreview,
        origin: formData.origin,
        isVerified: formData.isVerified,
        showCertificate: formData.showCertificate,
        certTitle: formData.certTitle,
        certInfo: formData.certInfo,
      };
      onSubmit(newEvent);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-2 border-white p-6 sm:p-8 rounded-2xl shadow-2xl z-10 custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <X size={24} />
        </button>

        <div className="mb-8 pr-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">
            {eventToEdit ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.title ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Entry title (e.g., Solo Exhibition)"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Year *
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.year ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="e.g. 2024"
              />
            </div>
            
            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Completion Date
              </label>
              <input
                type="text"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border-2 border-white/20 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none"
                placeholder="e.g. 15 Nov 2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Brief Description *
              </label>
              <input
                type="text"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.desc ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Short description for timeline item"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Extended Description *
              </label>
              <textarea
                name="extendedDesc"
                value={formData.extendedDesc}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none resize-none ${errors.extendedDesc ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Full details of the timeline event"
              />
            </div>

            <div className="md:col-span-2 border border-white/10 p-6 rounded-xl bg-white/5 space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Archive Metadata</h3>
              
              <div className="flex items-center gap-4 mb-4">
                 <input 
                   type="checkbox" 
                   id="isVerified" 
                   name="isVerified" 
                   checked={formData.isVerified}
                   onChange={handleInputChange}
                   className="w-5 h-5 accent-design-green cursor-pointer"
                 />
                 <label htmlFor="isVerified" className="text-white text-sm cursor-pointer select-none">
                   Mark as Verified Achievement
                 </label>
              </div>

              <div className="flex items-center gap-4 mb-4">
                 <input 
                   type="checkbox" 
                   id="showCertificate" 
                   name="showCertificate" 
                   checked={formData.showCertificate}
                   onChange={handleInputChange}
                   className="w-5 h-5 accent-design-green cursor-pointer"
                 />
                 <label htmlFor="showCertificate" className="text-white text-sm cursor-pointer select-none">
                   Enable Certificate Block (Display on Image)
                 </label>
              </div>

              {formData.showCertificate && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-[10px] font-mono font-bold mb-1 uppercase tracking-wide">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        name="certTitle"
                        value={formData.certTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-transparent border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-xs"
                        placeholder="e.g. Certificate of Excellence"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[10px] font-mono font-bold mb-1 uppercase tracking-wide">
                        Short Information
                      </label>
                      <input
                        type="text"
                        name="certInfo"
                        value={formData.certInfo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-transparent border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-xs"
                        placeholder="e.g. This document certifies..."
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-white/10 bg-black/40 rounded-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-design-green text-black text-[8px] font-bold uppercase tracking-wider">Preview</div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-design-green rounded-full flex items-center justify-center text-black shrink-0 shadow-[0_0_15px_rgba(137,161,120,0.3)]">
                        <Award size={20} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="inline-block px-2 py-0.5 border border-white/20 rounded-full">
                          <span className="text-white/60 text-[8px] font-mono font-bold uppercase tracking-[0.2em]">Verified Achievement</span>
                        </div>
                        <h4 className="text-white text-lg font-display font-bold uppercase leading-none tracking-tight">
                          {formData.certTitle || 'Certificate of Excellence'}
                        </h4>
                        <p className="text-white/40 text-[9px] leading-relaxed max-w-[240px]">
                          {formData.certInfo || 'This document certifies the successful completion and recognition of the aforementioned milestone in the Simpson Archives.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-white/70 text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                  Origin (Location / Scope)
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border-2 border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors rounded-none"
                  placeholder="e.g. New York, NY / Global"
                />
              </div>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Image *
              </label>
              <div className={`border-2 border-dashed transition-colors p-4 rounded-xl flex items-center justify-center bg-white/5 relative h-64 ${errors.image ? 'border-red-500' : 'border-white/20 hover:border-white/60'}`}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain pointer-events-none" />
                ) : (
                    <div className="text-center pointer-events-none">
                        <ImageIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <span className="text-white/60 text-sm font-bold uppercase">Upload Image</span>
                    </div>
                )}
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.image}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-transparent text-white font-mono text-sm uppercase tracking-wide hover:bg-white/5 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-design-green transition-colors rounded-lg"
            >
              {eventToEdit ? 'Save Changes' : 'Create Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default TimelineActionModal;
