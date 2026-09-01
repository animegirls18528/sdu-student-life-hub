"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BackgroundSettings {
  image: string | null;
  brightness: number;
  opacity: number;
}

interface BackgroundContextType {
  settings: BackgroundSettings;
  tempSettings: BackgroundSettings;
  updateTempSettings: (newSettings: Partial<BackgroundSettings>) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const defaultSettings: BackgroundSettings = {
  image: null,
  brightness: 100,
  opacity: 100,
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings);
  const [tempSettings, setTempSettings] = useState<BackgroundSettings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedSettings = localStorage.getItem("dashboard-background-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setTempSettings(parsed);
      } catch (e) {
        console.error("Failed to parse background settings", e);
      }
    }
  }, []);

  const updateTempSettings = (newSettings: Partial<BackgroundSettings>) => {
    setTempSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    try {
      localStorage.setItem("dashboard-background-settings", JSON.stringify(tempSettings));
      alert("บันทึกการตั้งค่าพื้นหลังเรียบร้อยแล้ว");
    } catch (e) {
      console.error("Failed to save background settings to localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        alert("ไม่สามารถบันทึกรูปภาพได้เนื่องจากขนาดไฟล์ใหญ่เกินขีดจำกัดของเบราว์เซอร์ กรุณาลองใช้รูปที่มีขนาดเล็กลง");
      }
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setTempSettings(defaultSettings);
    localStorage.removeItem("dashboard-background-settings");
  };

  return (
    <BackgroundContext.Provider value={{ settings, tempSettings, updateTempSettings, saveSettings, resetSettings }}>
      {isMounted && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 ease-in-out bg-background"
          style={tempSettings.image ? {
            backgroundImage: `url(${tempSettings.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: `brightness(${tempSettings.brightness}%)`,
            opacity: tempSettings.opacity / 100,
          } : {}}
        />
      )}
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
