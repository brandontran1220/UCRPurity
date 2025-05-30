"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";

interface ScreenshotButtonIOSProps {
  targetId: string;
  fileName?: string;
}

const ScreenshotButtonIOS = ({
  targetId,
  fileName = "ucr-purity-result",
}: ScreenshotButtonIOSProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect iOS devices (including iPad Pro with iPadOS)
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };

  // Detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  // DOM to SVG conversion - works much better on iOS than html2canvas
  const domToSVG = (element: HTMLElement): string => {
    const rect = element.getBoundingClientRect();

    // Get all styles as they appear
    const styles = Array.from(document.styleSheets)
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules);
        } catch {
          return [];
        }
      })
      .map((rule) => rule.cssText)
      .join("\n");

    // Create SVG with embedded HTML
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <defs>
          <style><![CDATA[
            ${styles}
            * { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
          ]]></style>
        </defs>
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="transform: scale(1); transform-origin: 0 0;">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    return svgContent;
  };

  // Convert SVG to Canvas (more reliable than html2canvas on iOS)
  const svgToCanvas = (
    svgString: string,
    width: number,
    height: number,
  ): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas size with device pixel ratio for crisp images
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(scale, scale);

      // Create blob URL for SVG
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = "#fefdf8"; // Background color
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG image"));
      };

      img.src = url;
    });
  };

  // iOS-specific screenshot capture
  const captureScreenshotIOS = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        throw new Error(`Element with id "${targetId}" not found`);
      }

      // Wait for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      const rect = element.getBoundingClientRect();

      try {
        // Method 1: Try DOM-to-SVG conversion (best for iOS)
        const svgString = domToSVG(element);
        const canvas = await svgToCanvas(svgString, rect.width, rect.height);

        // Try Web Share API first (native iOS sharing)
        if ("share" in navigator) {
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                const file = new File([blob], `${fileName}.png`, {
                  type: "image/png",
                });

                try {
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
                  console.log("Web Share failed:", shareError);
                }
              }

              // Fallback to image display
              showImageForSaving(canvas);
            },
            "image/png",
            0.95,
          );
        } else {
          // No share API, show image for manual saving
          showImageForSaving(canvas);
        }
      } catch (svgError) {
        console.log("SVG method failed, trying alternative:", svgError);

        // Method 2: Create a styled duplicate for manual screenshot
        createStyledDuplicate(element);
      }
    } catch (error) {
      console.error("Screenshot failed:", error);

      // Final fallback: Instruction modal
      showScreenshotInstructions();
    } finally {
      setIsCapturing(false);
    }
  };

  // Create a styled duplicate that's easier to screenshot manually
  const createStyledDuplicate = (element: HTMLElement) => {
    const clone = element.cloneNode(true) as HTMLElement;

    // Create a new window with just the content
    const newWindow = window.open("", "_blank", "width=800,height=600");
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>UCR Purity Test Result - Ready for Screenshot</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: #fefdf8;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .screenshot-ready {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              }
              .instructions {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: #007AFF;
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                z-index: 1000;
                animation: pulse 2s infinite;
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              📸 Take a screenshot now! (Volume Up + Power button)
            </div>
            <div class="screenshot-ready">
              ${clone.outerHTML}
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Show image in a format that's easy to save on iOS
  const showImageForSaving = (canvas: HTMLCanvasElement) => {
    const imageDataURL = canvas.toDataURL("image/png", 0.95);

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Your UCR Purity Test Result</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 10px;
                background: #f0f0f0;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                text-align: center;
              }
              .container {
                max-width: 100%;
                margin: 0 auto;
              }
              .image-wrapper {
                background: white;
                padding: 15px;
                border-radius: 12px;
                display: inline-block;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                /* Enable context menu on iOS */
                -webkit-user-select: none;
                -webkit-touch-callout: default;
                user-select: none;
              }
              .save-instructions {
                background: #007AFF;
                color: white;
                padding: 15px;
                border-radius: 10px;
                margin: 20px auto;
                max-width: 400px;
                font-size: 16px;
                font-weight: 600;
              }
              .step {
                background: white;
                color: #333;
                margin: 10px 0;
                padding: 12px;
                border-radius: 8px;
                text-align: left;
                font-weight: normal;
              }
              .alternative {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="image-wrapper">
                <img src="${imageDataURL}" alt="UCR Purity Test Result" id="result-img">
              </div>
              
              <div class="save-instructions">
                📱 How to Save on iPhone/iPad
                
                <div class="step">
                  1️⃣ <strong>Tap and hold</strong> the image above
                </div>
                <div class="step">
                  2️⃣ Select <strong>"Save to Photos"</strong> from the menu
                </div>
                <div class="step">
                  3️⃣ Find it in your <strong>Photos app</strong> → <strong>Recents</strong>
                </div>
              </div>
              
              <div class="alternative">
                <strong>Alternative:</strong> Press <strong>Volume Up + Power</strong> buttons together to screenshot this page
              </div>
            </div>
            
            <script>
              // Make sure long-press works on iOS
              const img = document.getElementById('result-img');
              
              // Force enable context menu for saving
              img.addEventListener('contextmenu', function(e) {
                // Let the default context menu show
                return true;
              });
              
              // Add haptic feedback on touch start (iOS)
              img.addEventListener('touchstart', function(e) {
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }, { passive: true });
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Show manual screenshot instructions
  const showScreenshotInstructions = () => {
    alert(`📸 iPhone Screenshot Instructions:

1️⃣ Position your result on screen
2️⃣ Press Volume Up + Power buttons together
3️⃣ Your screenshot will be saved to Photos

Alternative: Go back and try the screenshot button again - it sometimes works on the second try!`);
  };

  const captureScreenshot = async () => {
    if (isIOS() || isMobile()) {
      await captureScreenshotIOS();
    } else {
      // Fallback to original method for desktop
      setIsCapturing(true);
      try {
        const element = document.getElementById(targetId);
        if (!element) {
          console.error(`Element with id "${targetId}" not found`);
          return;
        }

        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: false,
          logging: false,
        });

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${fileName}.png`;
              link.click();
              URL.revokeObjectURL(url);
            }
          },
          "image/png",
          0.9,
        );
      } catch (error) {
        console.error("Desktop screenshot failed:", error);
        alert(
          "Screenshot failed. Please try again or take a manual screenshot.",
        );
      } finally {
        setIsCapturing(false);
      }
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
          {isIOS() ? "Preparing..." : "Capturing..."}
        </>
      ) : (
        <>
          <HiCamera className="h-5 w-5" />
          {isIOS() ? "Save Result" : "Screenshot"}
        </>
      )}
    </button>
  );
};

export default ScreenshotButtonIOS;
