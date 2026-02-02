

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

export interface DeviceInfo {
  pixelRatio: number;
  isTouch: boolean;
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  safeAreaInsetTop: number;
  safeAreaInsetBottom: number;
  deviceType: 'phone' | 'tablet' | 'desktop';
  hasNotch: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    pixelRatio: 1,
    isTouch: false,
    isMobile: false,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    safeAreaInsetTop: 0,
    safeAreaInsetBottom: 0,
    deviceType: 'desktop',
    hasNotch: false
  });

  useEffect(() => {
    const calculateDeviceInfo = (): DeviceInfo => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Mobile detection
      const isMobile = width <= 768 || isTouch;
      
      // Device type detection
      let deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';
      if (width <= 480) deviceType = 'phone';
      else if (width <= 1024) deviceType = 'tablet';
      
      // Safe area detection (for iOS notches)
      const safeAreaInsetTop = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--sat') // Changed from --safe-top to --sat
          .replace('px', '') || '0'
      );
      
      const safeAreaInsetBottom = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--sab') // Changed from --safe-bottom to --sab
          .replace('px', '') || '0'
      );
      
      // Notch detection (simplified)
      const hasNotch = safeAreaInsetTop > 20 || /iPhone.*?([1-9][0-9]|X|1[0-9])/.test(navigator.userAgent);

      return {
        pixelRatio,
        isTouch,
        isMobile,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
        safeAreaInsetTop,
        safeAreaInsetBottom,
        deviceType,
        hasNotch
      };
    };

    const updateDeviceInfo = () => {
      setDeviceInfo(calculateDeviceInfo());
    };

    // Initial calculation
    updateDeviceInfo();

    // Listeners
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Check for safe area changes
    const observer = new ResizeObserver(updateDeviceInfo);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      observer.disconnect();
    };
  }, []);

  return deviceInfo;
};

// Optional: Device badge component for debugging
export const DeviceBadge: React.FC = () => {
  const device = useDeviceDetection();
  
  return (
    <div className="fixed bottom-2 right-2 z-50 bg-black/80 border border-brandCharcoal/20 p-2 rounded-md text-xs font-mono opacity-50 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${device.pixelRatio >= 2 ? 'bg-brandYellow animate-pulse' : 'bg-brandNeutral'}`} />
        <span className="text-[10px] uppercase tracking-wider text-brandNeutral">
          {device.deviceType} • {device.pixelRatio}x • {device.isTouch ? 'TOUCH' : 'MOUSE'}
        </span>
      </div>
      {device.hasNotch && (
        <div className="text-[8px] text-brandYellow mt-1">NOTCH DETECTED</div>
      )}
    </div>
  );
};