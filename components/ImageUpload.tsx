import React, { useRef } from 'react';
import { ImageFile } from '../types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  image: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data (remove "data:image/xyz;base64," prefix)
      const base64Data = result.split(',')[1];
      
      onImageChange({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {image ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-800 shadow-xl">
          <img 
            src={image.previewUrl} 
            alt="Source" 
            className="w-full h-64 object-contain bg-zinc-900/50"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
              title="Replace Image"
            >
              <Upload size={20} />
            </button>
            <button 
              onClick={handleRemove}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white font-medium">
            Original Image
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full h-64 border-2 border-dashed border-zinc-700 hover:border-banana-400 hover:bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group bg-zinc-900"
        >
          <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors mb-4">
            <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-banana-400" />
          </div>
          <p className="text-zinc-300 font-medium">Click or drag image to upload</p>
          <p className="text-zinc-500 text-sm mt-2">To edit an existing image (Optional)</p>
        </div>
      )}
    </div>
  );
};