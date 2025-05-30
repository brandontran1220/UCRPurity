"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";
import html2canvas from "html2canvas";

interface DebugScreenshotButtonProps {
  targetId: string;
  fileName?: string;
}

const DebugScreenshotButton = ({
  targetId,
  fileName = "ucr-purity-result",
}: DebugScreenshotButtonProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const captureScreenshot = async () => {
    setIsCapturing(true);
    setDebugInfo("Starting capture...");

    try {
      setDebugInfo("Looking for element...");
      const element = document.getElementById(targetId);
      if (!element) {
        setDebugInfo("ERROR: Element not found!");
        alert(`Could not find element with ID: ${targetId}`);
        setIsCapturing(false);
        return;
      }

      setDebugInfo("Element found, checking dimensions...");
      const rect = element.getBoundingClientRect();
      setDebugInfo(`Element dimensions: ${rect.width}x${rect.height}`);

      if (rect.width === 0 || rect.height === 0) {
        alert("The element to screenshot is not visible. Please try again.");
        setIsCapturing(false);
        return;
      }

      setDebugInfo("Waiting for animations...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDebugInfo("Calling html2canvas...");
      console.log("About to call html2canvas on element:", element);

      const canvas = await html2canvas(element, {
        logging: true,
        useCORS: false,
        allowTaint: true,
      });

      setDebugInfo("Canvas created successfully!");
      console.log("Canvas created:", canvas);

      // Simple download
      canvas.toBlob((blob) => {
        if (blob) {
          setDebugInfo("Blob created, downloading...");
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.png`;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setDebugInfo("Download completed!");
        } else {
          setDebugInfo("ERROR: Failed to create blob");
        }
      }, "image/png");
    } catch (error) {
      console.error("Screenshot failed:", error);
      setDebugInfo(`ERROR: ${error}`);
      alert(`Screenshot failed: ${error}`);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={captureScreenshot}
        disabled={isCapturing}
        className={`flex h-fit w-fit cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 text-lg font-semibold shadow-md transition ${
          isCapturing
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
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
            Debug Screenshot
          </>
        )}
      </button>
      {debugInfo && (
        <div className="max-w-xs rounded bg-gray-100 p-2 text-center text-sm text-gray-600">
          {debugInfo}
        </div>
      )}
    </div>
  );
};

export default DebugScreenshotButton;
