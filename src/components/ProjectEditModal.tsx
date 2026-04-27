import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectProcessStep } from '../types';
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
  const [processSteps, setProcessSteps] = useState<ProjectProcessStep[]>([]);
  
  // State for adding a new process step
  const [newStepImage, setNewStepImage] = useState<string>('');
  const [newStepDesc, setNewStepDesc] = useState<string>('');

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
      setProcessSteps(project.process || []);
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
        const compressed = await compressImage(file, 1200, 1200, 0.8);
        setMainImagePreview(compressed);
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  const handleStepImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 1000, 0.7);
        setNewStepImage(compressed);
      } catch (err) {
        console.error("Failed to compress step image", err);
      }
    }
  };

  const addProcessStep = () => {
    if (newStepImage) {
      setProcessSteps(prev => [...prev, { image: newStepImage, description: newStepDesc }]);
      setNewStepImage('');
      setNewStepDesc('');
    }
  };

  const removeProcessStep = (index: number) => {
    setProcessSteps(prev => prev.filter((_, i) => i !== index));
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
        technologies: formData.mediaUsed.split(',').map(s => s.trim()).filter(Boolean),
        process: processSteps
      };
      
      onSubmit(updatedProject);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    setNewStepImage('');
    setNewStepDesc('');
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

        <div className="mb-8 pr-12 text-center">
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
            Update Archive Entry
          </h2>
          <div className="h-1 w-20 bg-design-green mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Main Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono font-bold text-design-green uppercase tracking-[0.2em] mb-4">I. Core Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border-2 text-white placeholder-white/10 focus:outline-none transition-colors rounded-xl ${errors.title ? 'border-red-500' : 'border-white/10 focus:border-design-green'}`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-[10px] mt-1 font-mono uppercase">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/5 border-2 text-white placeholder-white/10 focus:outline-none transition-colors rounded-xl resize-none ${errors.description ? 'border-red-500' : 'border-white/10 focus:border-design-green'}`}
                  placeholder="Brief description of the project"
                />
                {errors.description && <p className="text-red-500 text-[10px] mt-1 font-mono uppercase">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Media / Technologies
                </label>
                <input
                  type="text"
                  name="mediaUsed"
                  value={formData.mediaUsed}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white placeholder-white/10 focus:outline-none focus:border-design-green transition-all rounded-xl"
                  placeholder="e.g. Figma, Photoshop"
                />
              </div>

              <div>
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white placeholder-white/10 focus:outline-none focus:border-design-green transition-all rounded-xl"
                  placeholder="e.g. 1920x1080"
                />
              </div>

              <div>
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Year
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white placeholder-white/10 focus:outline-none focus:border-design-green transition-all rounded-xl"
                  placeholder="e.g. 2024"
                />
              </div>

              <div>
                <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Category
                </label>
                <input
                  type="text"
                  name="medium"
                  value={formData.medium}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white placeholder-white/10 focus:outline-none focus:border-design-green transition-all rounded-xl"
                  placeholder="e.g. Digital Art"
                />
              </div>
              
              <div className="md:col-span-2">
                 <label className="block text-white text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-60">
                  Main Presentation Image
                </label>
                <div className="border-2 border-dashed border-white/10 hover:border-design-green/50 transition-all p-4 rounded-2xl flex items-center justify-center bg-white/5 relative h-64 group cursor-pointer overflow-hidden">
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {mainImagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</span>
                        </div>
                      </div>
                  ) : (
                      <div className="text-center pointer-events-none">
                          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Upload Main Image</span>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Process Management */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono font-bold text-design-green uppercase tracking-[0.2em] mb-4">II. Creative Process Steps</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Existing Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {processSteps.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative border border-white/10 rounded-xl overflow-hidden aspect-square group group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                    >
                      <img src={step.image} alt="Step" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                        <p className="text-[8px] text-white font-medium mb-2 line-clamp-3">{step.description || 'No description'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProcessStep(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-90 group-hover:scale-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add New Step Form */}
              <div className="p-6 border-2 border-white/10 rounded-2xl bg-white/5 space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">Add Process Milestone</h4>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-40 shrink-0">
                    <div className="relative aspect-square border-2 border-dashed border-white/20 hover:border-design-green/50 transition-all rounded-xl flex flex-col items-center justify-center bg-black overflow-hidden group cursor-pointer h-40">
                       <input
                          type="file"
                          accept="image/*"
                          onChange={handleStepImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {newStepImage ? (
                          <img src={newStepImage} alt="New step preview" className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <div className="text-center pointer-events-none">
                            <Plus className="w-6 h-6 text-white/20 mx-auto mb-1" />
                            <span className="text-[8px] font-bold text-white/30 uppercase">Step Image</span>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <label className="block text-white text-[9px] font-mono font-bold mb-2 uppercase tracking-wide opacity-40">
                        Milestone Detail
                      </label>
                      <textarea
                        value={newStepDesc}
                        onChange={(e) => setNewStepDesc(e.target.value)}
                        className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder-white/5 text-sm focus:outline-none focus:border-design-green/50 rounded-xl resize-none h-24"
                        placeholder="Describe this part of the process..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addProcessStep}
                      disabled={!newStepImage}
                      className={`mt-4 w-full py-3 rounded-xl border border-white/20 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${newStepImage ? 'hover:bg-white hover:text-black hover:border-transparent' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <Plus size={14} /> Commit Step
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-white/10 pt-8 mt-12 pb-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-4 text-white/60 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="px-12 py-4 bg-design-green text-black font-bold uppercase tracking-[0.3em] text-xs transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-lg active:scale-95"
            >
              Persist to Archive
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default ProjectEditModal;
