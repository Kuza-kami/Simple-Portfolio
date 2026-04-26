import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { compressImage } from '../utils/imageUtils';

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projects: Omit<Project, 'id'>[]) => void;
}

const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUsed: '', // this maps to technologies
    size: '',
    date: '', // maps to year
    medium: '', // maps to medium and category
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
  const [processImagePreviews, setProcessImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMainImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setMainImagePreviews(prev => [...prev, compressed]);
      } catch (err) {
        console.error("Failed to compress main image", err);
      }
    }
    if (errors.mainImage) setErrors(prev => ({ ...prev, mainImage: '' }));
  };

  const removeMainImage = (index: number) => {
    setMainImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setProcessImagePreviews(prev => [...prev, compressed]);
      } catch (err) {
        console.error("Failed to compress process image", err);
      }
    }
    if (errors.processImages) setErrors(prev => ({ ...prev, processImages: '' }));
  };

  const removeProcessImage = (index: number) => {
    setProcessImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.mediaUsed.trim()) newErrors.mediaUsed = 'Media used is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.medium.trim()) newErrors.medium = 'Medium is required';
    if (mainImagePreviews.length === 0) newErrors.mainImage = 'At least one project image is required';
    // Remove the requirement for process images if they just want to upload main images
    // if (processImagePreviews.length === 0) newErrors.processImages = 'At least one process image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && mainImagePreviews.length > 0) {
      const newProjects: Omit<Project, 'id'>[] = mainImagePreviews.map((img, idx) => ({
        title: formData.title + (mainImagePreviews.length > 1 ? ` ${idx + 1}` : ''),
        description: formData.description,
        category: formData.medium.split(',')[0].trim() || 'Uncategorized',
        year: formData.date.split('-')[0] || formData.date || new Date().getFullYear().toString(),
        image: img,
        images: processImagePreviews.length > 0 ? processImagePreviews : [img],
        size: formData.size,
        medium: formData.medium,
        technologies: formData.mediaUsed.split(',').map(s => s.trim()).filter(Boolean),
        process: processImagePreviews.map((pImg, i) => ({
          image: pImg,
          description: i === 0 ? 'Initial sketch' : `Process step ${i + 1}`,
        }))
      }));
      onSubmit(newProjects);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', mediaUsed: '', size: '', date: '', medium: '' });
    setErrors({});
    setMainImagePreviews([]);
    setProcessImagePreviews([]);
    onClose();
  };

  if (!isOpen) return null;

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
            Add New Project
          </h2>
          <p className="text-white/60 text-sm font-mono">
            All fields are required. Enter the secret project details below.
          </p>
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
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors resize-none rounded-none ${errors.description ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="Describe your project..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Media Used *
              </label>
              <input
                type="text"
                name="mediaUsed"
                value={formData.mediaUsed}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.mediaUsed ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="e.g., Figma, Photoshop"
              />
              {errors.mediaUsed && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.mediaUsed}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Medium / Category *
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.medium ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="e.g., Digital, Print Art"
              />
              {errors.medium && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.medium}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Size *
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none ${errors.size ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
                placeholder="e.g., 1920x1080, A4"
              />
              {errors.size && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border-2 text-white placeholder-white/20 focus:outline-none transition-colors rounded-none [color-scheme:dark] ${errors.date ? 'border-red-500' : 'border-white/20 focus:border-white'}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Project Images (Multiple) *
              </label>
              <div className={`border-2 border-dashed p-6 transition-colors rounded-xl flex flex-col items-center justify-center min-h-[200px] ${errors.mainImage ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-white/60 bg-white/5'}`}>
                {mainImagePreviews.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {mainImagePreviews.map((img, idx) => (
                        <div key={idx} className="relative group rounded-md overflow-hidden bg-black/50 aspect-square">
                          <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeMainImage(idx); }}
                            className="absolute xl:opacity-0 xl:group-hover:opacity-100 top-1 right-1 bg-red-500 text-white p-1 rounded-full transition-opacity z-10"
                            aria-label="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="main-image-upload"
                      className="cursor-pointer flex items-center justify-center w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      <Upload size={14} className="mr-2" />
                      Add More Images
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="main-image-upload"
                    className="cursor-pointer flex flex-col items-center w-full h-full"
                  >
                    <div className="text-center py-8">
                      <ImageIcon className="w-10 h-10 text-white/40 mx-auto mb-3" />
                      <p className="text-white/80 font-bold uppercase tracking-wider text-sm mb-2">Upload Secret Project Images</p>
                      <p className="text-white/40 text-[10px] font-mono uppercase">Select multiple (PNG, JPG)</p>
                    </div>
                  </label>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMainImagesUpload}
                  className="hidden"
                  id="main-image-upload"
                />
              </div>
              {errors.mainImage && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.mainImage}</p>}
            </div>

            <div>
              <label className="block text-white text-xs font-mono font-bold mb-2 uppercase tracking-wide">
                Process Images *
              </label>
              <div className={`border-2 border-dashed p-6 transition-colors rounded-xl flex flex-col items-center justify-center min-h-[200px] ${errors.processImages ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-white/60 bg-white/5'}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProcessImagesUpload}
                  className="hidden"
                  id="process-images-upload"
                />
                
                {processImagePreviews.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-2 mb-4 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                      {processImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={preview}
                            alt={`Process ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeProcessImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label htmlFor="process-images-upload" className="cursor-pointer block text-center w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-colors mb-2">
                      + Add More Process Images
                    </label>
                  </div>
                ) : (
                  <label htmlFor="process-images-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <div className="text-center py-8">
                      <ImageIcon className="w-10 h-10 text-white/40 mx-auto mb-3" />
                      <p className="text-white/80 font-bold uppercase tracking-wider text-sm mb-2">Upload Process Images</p>
                      <p className="text-white/40 text-[10px] font-mono uppercase">Multiple images accepted</p>
                    </div>
                  </label>
                )}
              </div>
              {errors.processImages && <p className="text-red-500 text-xs mt-1 font-mono uppercase">{errors.processImages}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10 mt-8">
            <button
              type="submit"
              className="flex-1 bg-design-green text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-full"
            >
              Confirm Upload
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border-2 border-white/30 text-white py-4 font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white transition-colors rounded-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default ProjectUploadModal;
