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

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        return;
      }
      const canvas = await html2canvas(element, {
        background: "purity-ivory-100",
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
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
      className={`flex h-fit w-fit items-center gap-2 rounded-2xl px-6 py-3 text-lg font-semibold shadow-md transition ${
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
          <HiCamera className="h-5 w-5" />
          Screenshot
        </>
      )}
    </button>
  );
};

export default ScreenshotButton;
