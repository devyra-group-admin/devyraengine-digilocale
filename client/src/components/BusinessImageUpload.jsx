import React, { useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BUCKET = 'business-images'; // Make sure this bucket exists in Supabase Storage

function notifyBusinessesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('businesses:changed'));
  }
}

export default function BusinessImageUpload({ businessId, images = [], onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${businessId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const newImages = [...images, data.publicUrl];
      // Update images in DB
      const { error: dbError } = await supabase
        .from('businesses')
        .update({ images: newImages })
        .eq('id', businessId);
      if (dbError) throw dbError;
      onImagesChange && onImagesChange(newImages);
      notifyBusinessesChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (url) => {
    const newImages = images.filter((img) => img !== url);
    setUploading(true);
    setError(null);
    try {
      const { error: dbError } = await supabase
        .from('businesses')
        .update({ images: newImages })
        .eq('id', businessId);
      if (dbError) throw dbError;
      onImagesChange && onImagesChange(newImages);
      notifyBusinessesChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-2">Business Images</label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-2"
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative group">
            <img src={url} alt="Business" className="w-24 h-24 object-cover rounded border" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs hidden group-hover:block"
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
