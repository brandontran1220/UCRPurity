"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";
import html2canvas from "html2canvas";

interface ScreenshotButtonFixedProps {
  targetId: string;
  fileName?: string;
}

const ScreenshotButtonFixed = ({
  targetId,
  fileName = "ucr-purity-result",
}: ScreenshotButtonFixedProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect iOS devices
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  };

  // Check if browser supports native share API
  const canShare = () => {
    return "share" in navigator && "canShare" in navigator;
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        alert("Could not find the element to screenshot. Please try again.");
        setIsCapturing(false);
        return;
      }

      // Check if element is visible
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        alert("The element to screenshot is not visible. Please try again.");
        setIsCapturing(false);
        return;
      }

      console.log(
        `Capturing element with ID: ${targetId}, dimensions: ${rect.width}x${rect.height}`,
      );

      // Wait a moment for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fix modern CSS colors that html2canvas can't parse
      const fixModernColors = (element: HTMLElement) => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_ELEMENT,
        );

        const elements: HTMLElement[] = [];
        let node = walker.nextNode();
        while (node) {
          elements.push(node as HTMLElement);
          node = walker.nextNode();
        }

        elements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);

          // Fix background colors
          if (
            computedStyle.backgroundColor &&
            computedStyle.backgroundColor.includes("oklch")
          ) {
            el.style.backgroundColor = "#fefdf8"; // fallback background
          }

          // Fix text colors
          if (computedStyle.color && computedStyle.color.includes("oklch")) {
            el.style.color = "#000000"; // fallback text color
          }

          // Fix border colors
          if (
            computedStyle.borderColor &&
            computedStyle.borderColor.includes("oklch")
          ) {
            el.style.borderColor = "#cccccc"; // fallback border color
          }
        });
      };

      // Create a clone and fix colors
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "0";
      document.body.appendChild(clonedElement);

      let canvas: HTMLCanvasElement;
      try {
        fixModernColors(clonedElement);

        // Try capturing the cloned element
        canvas = await html2canvas(clonedElement, {
          background: "#fefdf8",
          useCORS: true,
          allowTaint: false,
          logging: false,
        });

        // Clean up
        document.body.removeChild(clonedElement);
      } catch (error) {
        // Clean up and try fallback
        document.body.removeChild(clonedElement);
        throw error;
      }

      // Handle the screenshot based on platform
      if (isIOS() && canShare()) {
        // Try native share on iOS
        canvas.toBlob(
          async (blob: Blob | null) => {
            if (blob) {
              try {
                const file = new File([blob], `${fileName}.png`, {
                  type: "image/png",
                });

                if (
                  navigator.canShare &&
                  navigator.canShare({ files: [file] })
                ) {
                  await navigator.share({
                    title: "UCR Purity Test Result",
                    text: "Check out my UCR Purity Test score!",
                    files: [file],
                  });
                  return;
                }
              } catch (shareError) {
                console.log("Share failed:", shareError);
              }
            }
            // Fallback to showing image
            showImageInNewTab(canvas);
          },
          "image/png",
          0.95,
        );
      } else if (isIOS()) {
        // iOS without share support
        showImageInNewTab(canvas);
      } else {
        // Desktop/Android - direct download
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${fileName}.png`;
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          },
          "image/png",
          0.95,
        );
      }
    } catch (error) {
      console.error("Screenshot failed:", error);

      // More detailed error information
      let errorMessage = "Screenshot failed. ";
      if (error instanceof Error) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += `Unknown error: ${String(error)}`;
      }

      if (isIOS()) {
        alert(
          `Screenshot capture failed. ${errorMessage}\n\nPlease take a manual screenshot using Volume Up + Power button.`,
        );
      } else {
        alert(
          `${errorMessage}\n\nPlease try again or take a manual screenshot.`,
        );
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Show image in new tab with iOS-optimized instructions
  const showImageInNewTab = (canvas: HTMLCanvasElement) => {
    const imageDataURL = canvas.toDataURL("image/png", 0.95);

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
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: #f5f5f7;
                text-align: center;
                line-height: 1.6;
              }
              .container {
                max-width: 90%;
                margin: 0 auto;
              }
              .image-container {
                background: white;
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
                display: inline-block;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 16px;
                display: block;
              }
              .instructions {
                background: white;
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                margin: 0 auto;
                text-align: left;
              }
              h2 {
                color: #1d1d1f;
                text-align: center;
                margin: 0 0 20px 0;
                font-size: 22px;
                font-weight: 600;
              }
              .step {
                background: #f6f6f6;
                border-radius: 12px;
                padding: 15px;
                margin: 15px 0;
                border-left: 4px solid #007AFF;
              }
              .step strong {
                color: #007AFF;
              }
              .download-btn {
                display: inline-block;
                background: linear-gradient(135deg, #007AFF, #0056CC);
                color: white;
                padding: 15px 30px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                margin: 15px auto;
                display: block;
                width: fit-content;
                transition: transform 0.2s ease;
              }
              .download-btn:hover {
                transform: translateY(-2px);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="image-container">
                <img src="${imageDataURL}" alt="UCR Purity Test Result" id="result-image" />
                <a href="${imageDataURL}" download="${fileName}.png" class="download-btn">
                  📥 Save Image
                </a>
              </div>
              
              <div class="instructions">
                <h2>📱 Save Your Result</h2>
                
                ${
                  isIOS()
                    ? `
                  <div class="step">
                    <strong>Step 1:</strong> Tap and hold on the image above
                  </div>
                  <div class="step">
                    <strong>Step 2:</strong> Select "Save to Photos"
                  </div>
                  <div class="step">
                    <strong>Step 3:</strong> Check your Photos app
                  </div>
                `
                    : `
                  <div class="step">
                    <strong>Step 1:</strong> Right-click on the image above
                  </div>
                  <div class="step">
                    <strong>Step 2:</strong> Select "Save Image As..."
                  </div>
                  <div class="step">
                    <strong>Step 3:</strong> Choose download location
                  </div>
                `
                }
              </div>
            </div>
            
            <script>
              // Enhanced touch handling for iOS
              if (${isIOS()}) {
                const img = document.getElementById('result-image');
                img.style.webkitUserSelect = 'none';
                img.style.webkitTouchCallout = 'default';
                img.style.userSelect = 'none';
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert(
        "Please allow popups to save your screenshot, or take a manual screenshot.",
      );
    }
  };

  return (
    <button
      onClick={captureScreenshot}
      disabled={isCapturing}
      className={`flex h-fit w-fit cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 text-lg font-semibold shadow-md transition ${
        isCapturing
          ? "cursor-not-allowed bg-gray-300 text-gray-500"
          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
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
          {isIOS() ? "Save Image" : "Screenshot"}
        </>
      )}
    </button>
  );
};

export default ScreenshotButtonFixed;
