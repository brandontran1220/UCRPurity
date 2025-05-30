"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";

interface SimpleScreenshotButtonProps {
  targetId: string;
  fileName?: string;
}

const SimpleScreenshotButton = ({
  targetId,
  fileName = "ucr-purity-result",
}: SimpleScreenshotButtonProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect iOS devices
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        alert("Result element not found. Please try again.");
        return;
      }

      if (isIOS()) {
        // iOS: Create a clean page for manual screenshot
        createCleanScreenshotPage(element);
      } else {
        // Desktop: Use html2canvas
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    } catch (error) {
      console.error("Screenshot failed:", error);
      alert(
        isIOS()
          ? "Take a screenshot manually: Press Volume Up + Power buttons together!"
          : "Screenshot failed. Please try again.",
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const createCleanScreenshotPage = (element: HTMLElement) => {
    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement;

    // Create new window with optimized content
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>UCR Purity Test Result</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta charset="utf-8">
            <style>
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              
              .result-container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
              }
              
              .rice-image {
                width: 150px;
                height: 150px;
                margin: 0 auto 20px;
              }
              
              .score-text {
                font-size: 3rem;
                font-weight: bold;
                color: #3b82f6;
                margin: 20px 0;
              }
              
              .message {
                font-size: 1.2rem;
                color: #374151;
                margin: 15px 0;
              }
              
              .subtitle {
                font-size: 0.9rem;
                color: #6b7280;
                font-style: italic;
              }
              
              .instructions {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ef4444;
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: 600;
                animation: pulse 2s infinite;
                z-index: 1000;
                font-size: 14px;
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
              }
              
              @media (max-width: 600px) {
                .result-container {
                  padding: 30px 20px;
                  margin: 10px;
                }
                .score-text {
                  font-size: 2.5rem;
                }
                .instructions {
                  font-size: 13px;
                  padding: 10px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              📸 Press Volume Up + Power buttons to screenshot!
            </div>
            
            <div class="result-container">
              ${clone.innerHTML}
            </div>
            
            <script>
              // Auto-close after 30 seconds
              setTimeout(() => {
                window.close();
              }, 30000);
              
              // Add touch feedback
              document.body.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }
              });
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      // Popup blocked fallback
      alert(`📸 Screenshot Instructions:

1. Position this page nicely on your screen
2. Press Volume Up + Power buttons together
3. Your screenshot will be saved to Photos

The result is ready for screenshot!`);
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
          Preparing...
        </>
      ) : (
        <>
          <HiCamera className="h-5 w-5" />
          {isIOS() ? "Prepare Screenshot" : "Screenshot"}
        </>
      )}
    </button>
  );
};

export default SimpleScreenshotButton;
