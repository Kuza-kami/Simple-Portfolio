import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { compressImage } from '../utils/imageUtils';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (project: Project) => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ isOpen, onClose, project, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUsed: '',
    size: '',
    date: '',
    medium: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainImagePreview, setMainImagePreview] = useState<string>('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        mediaUsed: project.technologies?.join(', ') || '',
        size: project.size || '',
        date: project.year,
        medium: project.medium || '',
      });
      setMainImagePreview(project.image);
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setMainImagePreview(compressed);
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!mainImagePreview) newErrors.mainImage = 'Project image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && project) {
      const updatedProject: Project = {
        ...project,
        title: formData.title,
        description: formData.description,
        category: formData.medium.split(',')[0].trim() || project.category,
        year: formData.date.split('-')[0] || formData.date || project.year,
        image: mainImagePreview,
        size: formData.size || project.size,
        medium: formData.medium || project.medium,
        technologies: formData.mediaUsed.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      // Update process array with the new image if it changed and we want to keep it consistent
      // But preserving existing is ok.
      
      onSubmit(updatedProject);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-2 border-white p-6 sm:p-8 rounded-2xl shadow-2xl z-10 custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <X size={24} />
        </button>

        <div className="mb-8 pr-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">
            Edit Project
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.title ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Enter project title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none resize-none ${errors.description ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Brief description of the project"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Media / Technologies
              </label>
              <input
                type="text"
                name="mediaUsed"
                value={formData.mediaUsed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border-2 border-white/20 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none"
                placeholder="e.g. Figma, React (comma separated)"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border-2 border-white/20 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none"
                placeholder="e.g. 1920x1080 or Custom"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Date / Year
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border-2 border-white/20 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none"
                placeholder="e.g. 2024"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Medium / Category
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border-2 border-white/20 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none"
                placeholder="e.g. UI/UX, Web Design"
              />
            </div>
            
            <div className="md:col-span-2 mt-4">
               <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Main Image
              </label>
              <div className="border-2 border-dashed border-white/20 hover:border-white/60 transition-colors p-4 rounded-xl flex items-center justify-center bg-white/5 relative h-64">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {mainImagePreview ? (
                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain pointer-events-none" />
                ) : (
                    <div className="text-center pointer-events-none">
                        <ImageIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <span className="text-white/60 text-sm font-bold uppercase">Upload New Image</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-transparent text-white font-mono text-sm uppercase tracking-wide hover:bg-white/5 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-design-green transition-colors rounded-lg"
            >
              Update Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default ProjectEditModal;
