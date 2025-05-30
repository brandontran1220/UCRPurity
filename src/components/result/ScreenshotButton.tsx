"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { HiCamera } from "react-icons/hi2";

interface ScreenshotButtonProps {
  targetId: string;
  fileName?: string;
}

const ScreenshotButton = ({
  targetId,
  fileName = "ucr-purity-result",
}: ScreenshotButtonProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);

        if (isMobile()) {
          // 📱 Open in new tab with instruction
          const newTab = window.open();
          if (newTab) {
            newTab.document.write(`
              <html>
                <head><title>Save Screenshot</title></head>
                <body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:white;">
                  <img src="${url}" style="max-width:100vw;max-height:90vh;" />
                  <p style="font-family:sans-serif;padding:1rem;text-align:center;">
                    Long-press the image to save or share it
                  </p>
                </body>
              </html>
            `);
            newTab.document.close();
          }
        } else {
          // 💻 Download on desktop
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={captureScreenshot}
      disabled={isCapturing}
      className={`flex h-fit w-fit cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 text-lg font-semibold shadow-md transition ${
        isCapturing
          ? "cursor-not-allowed bg-gray-300 text-gray-500"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isCapturing ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
          Capturing...
        </>
      ) : (
        <>
          <div>
          Save to Gallery
          </div>
        </>
      )}
    </button>
  );
};

export default ScreenshotButton;
