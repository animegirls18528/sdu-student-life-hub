"use client";

import React, { useRef, useState } from "react";
import { useBackground } from "./background-provider";
import { Settings2, Upload, RotateCcw, Image as ImageIcon, X, Sun, Eye } from "lucide-react";

export function BackgroundCustomizer() {
  const { settings, tempSettings, updateTempSettings, saveSettings, resetSettings } = useBackground();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    if (isOpen) {
      // Closing: revert temp settings to saved settings
      updateTempSettings(settings);
    }
    setIsOpen(!isOpen);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์มีขนาดใหญ่เกินไป (จำกัด 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateTempSettings({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all border border-zinc-100 dark:border-zinc-800"
        title="ปรับแต่งพื้นหลัง"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-2xl p-6 z-[9999]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">ปรับแต่งพื้นหลัง</h3>
            <button onClick={toggleOpen} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Preview Image */}
            {tempSettings.image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <img 
                  src={tempSettings.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${tempSettings.brightness}%)`,
                    opacity: tempSettings.opacity / 100
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">ตัวอย่าง</span>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">รูปภาพพื้นหลัง</label>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                >
                  <Upload className="w-4 h-4" /> อัปโหลดรูป
                </button>
                {tempSettings.image && (
                  <button
                    onClick={() => updateTempSettings({ image: null })}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    title="ลบรูปภาพ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Brightness Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Sun className="w-3 h-3" /> ความสว่าง
                </label>
                <span className="text-xs font-bold text-blue-600">{tempSettings.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={tempSettings.brightness}
                onChange={(e) => updateTempSettings({ brightness: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-3 h-3" /> ความโปร่งใส
                </label>
                <span className="text-xs font-bold text-blue-600">{tempSettings.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tempSettings.opacity}
                onChange={(e) => updateTempSettings({ opacity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  saveSettings();
                  setIsOpen(false);
                }}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
              >
                บันทึกการตั้งค่า
              </button>
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> รีเซ็ตเป็นค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
