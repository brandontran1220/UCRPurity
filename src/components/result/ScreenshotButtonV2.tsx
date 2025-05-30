"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";

interface ScreenshotButtonV2Props {
  targetId: string;
  fileName?: string;
}

const ScreenshotButtonV2 = ({
  targetId,
  fileName = "ucr-purity-result",
}: ScreenshotButtonV2Props) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect iOS devices
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };

  // Check if browser supports native share API
  const canShare = () => {
    return "share" in navigator && "canShare" in navigator;
  };

  // Convert DOM element to SVG
  const domToSvg = async (element: HTMLElement): Promise<string> => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Get all styles and convert to inline styles
    const svgElements: string[] = [];

    const processElement = (
      el: HTMLElement,
      offsetX = 0,
      offsetY = 0,
    ): void => {
      const elRect = el.getBoundingClientRect();
      const elStyle = window.getComputedStyle(el);

      // Calculate position relative to target element
      const x = elRect.left - rect.left + offsetX;
      const y = elRect.top - rect.top + offsetY;

      if (el.tagName === "SVG") {
        // Handle SVG elements specially
        const svgContent = el.outerHTML;
        svgElements.push(`
          <foreignObject x="${x}" y="${y}" width="${elRect.width}" height="${elRect.height}">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${svgContent}
            </div>
          </foreignObject>
        `);
      } else {
        // Create a rectangle with background and border
        const bgColor = elStyle.backgroundColor || "transparent";
        const color = elStyle.color || "#000000";
        const fontSize = elStyle.fontSize || "16px";
        const fontFamily = elStyle.fontFamily || "Arial, sans-serif";
        const fontWeight = elStyle.fontWeight || "normal";

        if (bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)") {
          svgElements.push(`
            <rect x="${x}" y="${y}" width="${elRect.width}" height="${elRect.height}" 
                  fill="${bgColor}" stroke="none"/>
          `);
        }

        // Add text content
        if (el.textContent && el.textContent.trim()) {
          const lines = el.textContent.trim().split("\n");
          lines.forEach((line, index) => {
            if (line.trim()) {
              svgElements.push(`
                <text x="${x + 10}" y="${y + 20 + index * 20}" 
                      fill="${color}" font-size="${fontSize}" 
                      font-family="${fontFamily}" font-weight="${fontWeight}">
                  ${line.trim()}
                </text>
              `);
            }
          });
        }
      }

      // Process children
      Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          processElement(child, offsetX, offsetY);
        }
      });
    };

    processElement(element);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="${rect.width}" height="${rect.height}"
           viewBox="0 0 ${rect.width} ${rect.height}">
        <rect width="100%" height="100%" fill="${computedStyle.backgroundColor || "#fefdf8"}"/>
        ${svgElements.join("")}
      </svg>
    `;
  };

  // Convert SVG to Canvas
  const svgToCanvas = async (
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

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas);
      };
      img.onerror = reject;

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    });
  };

  // Manual DOM rendering approach for iOS
  const renderDomToCanvas = async (
    element: HTMLElement,
  ): Promise<HTMLCanvasElement> => {
    const rect = element.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas size
    const scale = window.devicePixelRatio || 1;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.scale(scale, scale);

    // Set background
    ctx.fillStyle = "#fefdf8";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const renderElement = (el: HTMLElement, offsetX = 0, offsetY = 0): void => {
      const elRect = el.getBoundingClientRect();
      const elStyle = window.getComputedStyle(el);

      const x = elRect.left - rect.left + offsetX;
      const y = elRect.top - rect.top + offsetY;

      // Draw background
      if (
        elStyle.backgroundColor &&
        elStyle.backgroundColor !== "transparent" &&
        elStyle.backgroundColor !== "rgba(0, 0, 0, 0)"
      ) {
        ctx.fillStyle = elStyle.backgroundColor;
        ctx.fillRect(x, y, elRect.width, elRect.height);
      }

      // Draw border
      if (elStyle.borderWidth && elStyle.borderWidth !== "0px") {
        ctx.strokeStyle = elStyle.borderColor || "#000000";
        ctx.lineWidth = parseInt(elStyle.borderWidth) || 1;
        ctx.strokeRect(x, y, elRect.width, elRect.height);
      }

      // Draw text
      if (el.textContent && el.textContent.trim() && el.children.length === 0) {
        ctx.fillStyle = elStyle.color || "#000000";
        ctx.font = `${elStyle.fontWeight || "normal"} ${elStyle.fontSize || "16px"} ${elStyle.fontFamily || "Arial"}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const text = el.textContent.trim();
        const lines = text.split("\n");
        const lineHeight = parseInt(elStyle.fontSize || "16") * 1.2;

        lines.forEach((line, index) => {
          if (line.trim()) {
            ctx.fillText(line.trim(), x + 10, y + 10 + index * lineHeight);
          }
        });
      }

      // Process children
      Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          renderElement(child, offsetX, offsetY);
        }
      });
    };

    renderElement(element);
    return canvas;
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        alert("Could not find the element to screenshot. Please try again.");
        setIsCapturing(false);
        return;
      }

      let canvas: HTMLCanvasElement;

      // For iOS, try the manual DOM rendering approach
      if (isIOS()) {
        try {
          console.log("Using iOS-optimized rendering...");
          canvas = await renderDomToCanvas(element);
        } catch (error) {
          console.log(
            "iOS manual rendering failed, trying SVG approach:",
            error,
          );

          try {
            // Fallback to SVG approach
            const rect = element.getBoundingClientRect();
            const svgString = await domToSvg(element);
            canvas = await svgToCanvas(svgString, rect.width, rect.height);
          } catch (svgError) {
            console.error("Both iOS methods failed:", svgError);
            throw new Error("Screenshot capture failed on iOS device");
          }
        }
      } else {
        // For other platforms, use SVG approach
        try {
          const rect = element.getBoundingClientRect();
          const svgString = await domToSvg(element);
          canvas = await svgToCanvas(svgString, rect.width, rect.height);
        } catch (error) {
          console.log("SVG approach failed, using manual rendering:", error);
          canvas = await renderDomToCanvas(element);
        }
      }

      // Try to share or download the image
      if (isIOS() && canShare()) {
        // Try native share on iOS
        canvas.toBlob(
          async (blob) => {
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
          0.9,
        );
      } else {
        // For other platforms or if share fails
        if (isIOS()) {
          showImageInNewTab(canvas);
        } else {
          // Standard download for desktop
          canvas.toBlob(
            (blob) => {
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
            0.9,
          );
        }
      }
    } catch (error) {
      console.error("Screenshot failed:", error);

      if (isIOS()) {
        alert(
          "Screenshot capture isn't working on your device. Please take a manual screenshot using Volume Up + Power button, or try using Chrome browser instead of Safari.",
        );
      } else {
        alert(
          "Screenshot failed. Please try again or take a manual screenshot.",
        );
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Show image in new tab with iOS-optimized instructions
  const showImageInNewTab = (canvas: HTMLCanvasElement) => {
    const imageDataURL = canvas.toDataURL("image/png", 0.9);

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
              .alternative {
                background: #fff3cd;
                border: 2px solid #ffc107;
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
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
              @media (max-width: 480px) {
                .container { max-width: 95%; }
                .instructions { padding: 20px; }
                h2 { font-size: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="image-container">
                <img src="${imageDataURL}" alt="UCR Purity Test Result" id="result-image" />
                ${
                  isIOS()
                    ? `
                  <a href="${imageDataURL}" download="${fileName}.png" class="download-btn">
                    📥 Download Image
                  </a>
                `
                    : ""
                }
              </div>
              
              <div class="instructions">
                <h2>📱 Save Your Result</h2>
                
                ${
                  isIOS()
                    ? `
                  <div class="step">
                    <strong>Step 1:</strong> Tap and hold on the image above until a menu appears
                  </div>
                  <div class="step">
                    <strong>Step 2:</strong> Select "Save to Photos" or "Add to Photos"
                  </div>
                  <div class="step">
                    <strong>Step 3:</strong> Check your Photos app → Recents album
                  </div>
                  
                  <div class="alternative">
                    <strong>🔄 Alternative Method:</strong><br>
                    Press <strong>Volume Up + Power</strong> buttons together to screenshot this entire page
                  </div>
                `
                    : `
                  <div class="step">
                    <strong>Step 1:</strong> Right-click on the image above
                  </div>
                  <div class="step">
                    <strong>Step 2:</strong> Select "Save Image As..." or "Download Image"
                  </div>
                  <div class="step">
                    <strong>Step 3:</strong> Choose your download location and save
                  </div>
                `
                }
              </div>
            </div>
            
            <script>
              // Enhanced touch handling for iOS
              if (${isIOS()}) {
                const img = document.getElementById('result-image');
                
                // Make image saveable on iOS
                img.style.webkitUserSelect = 'none';
                img.style.webkitTouchCallout = 'default';
                img.style.userSelect = 'none';
                
                // Add haptic feedback on touch (if supported)
                img.addEventListener('touchstart', function() {
                  if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                  }
                }, { passive: true });
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert(
        "Please allow popups to save your screenshot, or take a manual screenshot using your device's screenshot function.",
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
          {isIOS() ? "Generating..." : "Capturing..."}
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

export default ScreenshotButtonV2;
