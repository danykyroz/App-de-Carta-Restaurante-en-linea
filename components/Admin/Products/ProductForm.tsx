import React, { useState, useRef } from 'react';
import { MenuItem, Category } from '../../../types';
import { ArrowLeft, Save, Wand2, Sparkles, RefreshCcw, Upload } from 'lucide-react';
import { generateMenuDescription, generateDishImage, editDishImage } from '../../../services/geminiService';

interface ProductFormProps {
  item: Partial<MenuItem>;
  categories: Category[];
  onSave: (item: Partial<MenuItem>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ item: initialItem, categories, onSave, onCancel }) => {
  const [newItem, setNewItem] = useState<Partial<MenuItem>>(initialItem);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [showAiImageControls, setShowAiImageControls] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImage = !!newItem.imageUrl;
  const isEditableImage = newItem.imageUrl?.startsWith('data:');

  const handleGenerateDesc = async () => {
    if (!newItem.title) {
        alert("Please enter a title first.");
        return;
    }
    setIsGeneratingDesc(true);
    const result = await generateMenuDescription(newItem.title, newItem.category || 'General');
    setNewItem(prev => ({
        ...prev,
        description: result.description,
        priceCOP: result.suggestedPrice || prev.priceCOP
    }));
    setIsGeneratingDesc(false);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt && !newItem.title) {
        alert("Ingresa un prompt o un título para generar.");
        return;
    }
    
    setIsGeneratingImg(true);
    const promptToUse = imagePrompt || newItem.title || "gourmet dish";
    
    let resultUrl: string | null = null;
    
    if (isEditableImage && newItem.imageUrl) {
        resultUrl = await editDishImage(newItem.imageUrl, promptToUse);
    } else {
        resultUrl = await generateDishImage(promptToUse);
    }

    if (resultUrl) {
        setNewItem(prev => ({ ...prev, imageUrl: resultUrl }));
    } else {
        alert("Hubo un error generando la imagen.");
    }
    setIsGeneratingImg(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
  };

  return (
    <div className="card-flip-back bg-charcoal rounded-xl border border-gray-800 shadow-2xl p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
                <h3 className="text-2xl text-gold-400 font-serif">
                    {newItem.id ? 'Edit Product' : 'Create New Product'}
                </h3>
                <button 
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to List
                </button>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Product Title</label>
                        <input 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                            value={newItem.title}
                            onChange={e => setNewItem({...newItem, title: e.target.value})}
                            placeholder="e.g., Truffle Risotto"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Category</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                            value={newItem.category}
                            onChange={e => setNewItem({...newItem, category: e.target.value})}
                        >
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                
                {/* Image Upload Area */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-gray-300 font-medium">Dish Image</label>
                        <button 
                            onClick={() => setShowAiImageControls(!showAiImageControls)}
                            className="text-xs flex items-center gap-1 bg-gray-800 text-gold-400 hover:text-white px-3 py-1.5 rounded-full border border-gray-700 hover:border-gold-500 transition-all"
                        >
                            <Sparkles size={14} /> {showAiImageControls ? 'Hide AI Studio' : 'Open AI Studio'}
                        </button>
                    </div>

                    {showAiImageControls && (
                        <div className="mb-6 p-4 bg-charcoal rounded-lg border border-gold-500/30 shadow-inner">
                            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                                {isEditableImage 
                                    ? "AI Enhancement (Image-to-Image)" 
                                    : "AI Generation (Text-to-Image)"}
                            </label>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    placeholder={isEditableImage ? "e.g., Add steam..." : "e.g., A gourmet salmon plate..."}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-gold-500"
                                />
                                <button 
                                    onClick={handleGenerateImage}
                                    disabled={isGeneratingImg}
                                    className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-obsidian font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                                >
                                    {isGeneratingImg ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    {isGeneratingImg ? 'Processing...' : 'Generate'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 h-64">
                        {/* Current Image View (Left Side) */}
                        {hasImage && (
                            <div className="w-full md:w-1/3 h-full relative rounded-xl overflow-hidden border border-gray-700 group bg-black shadow-lg">
                                <img src={newItem.imageUrl} alt="Current" className="w-full h-full object-cover opacity-90" />
                                <div className="absolute top-2 left-2 bg-black/70 text-gold-400 text-xs font-bold px-2 py-1 rounded backdrop-blur-md border border-gold-500/30 shadow-md z-10">
                                    Current
                                </div>
                            </div>
                        )}

                        {/* Dropzone */}
                        <div 
                            className={`relative ${hasImage ? 'w-full md:w-2/3' : 'w-full'} h-full border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                                dragActive ? 'border-gold-500 bg-gray-800 scale-[1.02]' : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input 
                                ref={inputRef}
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                            />
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-gray-700 transition-colors">
                                <Upload className={`text-gray-400 group-hover:text-gold-400 ${dragActive ? 'text-gold-500' : ''}`} size={32} />
                            </div>
                            <p className="text-lg font-medium text-gray-300 mb-1">
                                {hasImage ? "Replace Image" : "Upload Image"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {hasImage ? "Drop new file to overwrite" : "Click or drag and drop"}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-400 text-sm">Description</label>
                        <button 
                            onClick={handleGenerateDesc}
                            disabled={isGeneratingDesc}
                            className="text-xs flex items-center gap-1 text-gold-400 hover:text-white transition-colors bg-gray-800 px-3 py-1 rounded border border-gray-700"
                        >
                            <Wand2 size={12} /> {isGeneratingDesc ? 'Writing...' : 'AI Write Description'}
                        </button>
                    </div>
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-32 focus:border-gold-500 outline-none resize-none leading-relaxed"
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                        placeholder="Enter a detailed description of the dish..."
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (COP)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input 
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-8 text-white focus:border-gold-500 outline-none"
                            value={newItem.priceCOP}
                            onChange={e => setNewItem({...newItem, priceCOP: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 rounded-lg border border-gray-700"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(newItem)}
                        className="flex-1 bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                    >
                        <Save size={20} /> {newItem.id ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};