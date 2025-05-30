"use client";

import { useState } from "react";
import { HiCamera } from "react-icons/hi2";

interface ManualScreenshotButtonProps {
  targetId: string;
  fileName?: string;
}

const ManualScreenshotButton = ({
  targetId,
  fileName = "ucr-purity-result",
}: ManualScreenshotButtonProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect iOS devices
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };

  // Create a styled screenshot manually by recreating the content
  const createManualScreenshot = async (
    element: HTMLElement,
  ): Promise<HTMLCanvasElement> => {
    const rect = element.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas size for high quality
    const scale = 2; // Always use 2x for crisp images
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.scale(scale, scale);

    // Set background to match UCR theme
    ctx.fillStyle = "#fefdf8";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add some padding
    const padding = 20;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      padding,
      padding,
      rect.width - padding * 2,
      rect.height - padding * 2,
    );

    // Manually draw the content based on what we know should be there
    const centerX = rect.width / 2;
    let currentY = padding + 40;

    // Title
    ctx.fillStyle = "#1a1a1a";
    ctx.font =
      'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("UCR Purity Test", centerX, currentY);
    currentY += 60;

    // Try to extract the actual score from the DOM
    const scoreElement = element.querySelector(
      '[class*="score"], .text-6xl, .text-7xl, .text-8xl',
    );
    const scoreText = scoreElement?.textContent || "Your Score";

    ctx.font =
      'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = "#2563eb";
    ctx.fillText(scoreText, centerX, currentY);
    currentY += 80;

    // Try to extract the rice description
    const messageElement = element.querySelector('[class*="message"], p');
    const messageText = messageElement?.textContent || "Your UCR Purity Result";

    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = "#4a5568";
    ctx.fillText(messageText, centerX, currentY);
    currentY += 60;

    // Add a simple rice icon representation (circle with face)
    ctx.beginPath();
    ctx.arc(centerX, currentY + 40, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();

    // Simple face
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(centerX - 10, currentY + 35, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 10, currentY + 35, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(centerX, currentY + 40, 15, 0, Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a1a";
    ctx.stroke();

    currentY += 100;

    // Footer text
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Thanks for your submission!", centerX, currentY);
    currentY += 25;
    ctx.fillText(
      "The UCRPurity Test was created by the Purified Rice Team",
      centerX,
      currentY,
    );

    return canvas;
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        alert("Could not find the content to screenshot. Please try again.");
        setIsCapturing(false);
        return;
      }

      // Create manual screenshot
      const canvas = await createManualScreenshot(element);

      if (isIOS()) {
        // For iOS, always show in new tab with save instructions
        showImageInNewTab(canvas);
      } else {
        // For other platforms, try to download directly
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
    } catch (error) {
      console.error("Screenshot failed:", error);
      alert(
        "Screenshot failed. Please try taking a manual screenshot using your device's screenshot function.",
      );
    } finally {
      setIsCapturing(false);
    }
  };

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
              * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
              }
              body {
                margin: 0;
                padding: 15px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .container {
                width: 100%;
                max-width: 450px;
                text-align: center;
              }
              .image-container {
                background: white;
                border-radius: 25px;
                padding: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                margin-bottom: 25px;
                transform: scale(1);
                transition: transform 0.3s ease;
              }
              .image-container:active {
                transform: scale(0.98);
              }
              img {
                width: 100%;
                height: auto;
                border-radius: 20px;
                display: block;
                user-select: none;
                -webkit-user-select: none;
                -webkit-touch-callout: default;
              }
              .instructions {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                padding: 25px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }
              h2 {
                color: #1a1a1a;
                margin: 0 0 20px 0;
                font-size: 24px;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .step {
                background: rgba(102, 126, 234, 0.1);
                border: 2px solid #667eea;
                border-radius: 15px;
                padding: 18px;
                margin: 18px 0;
                text-align: left;
                position: relative;
                overflow: hidden;
              }
              .step::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: linear-gradient(to bottom, #667eea, #764ba2);
              }
              .step-number {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                margin-right: 12px;
                flex-shrink: 0;
              }
              .step-content {
                flex: 1;
              }
              .step-title {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 5px;
              }
              .step-desc {
                color: #4a5568;
                font-size: 14px;
                line-height: 1.5;
              }
              .alternative {
                background: linear-gradient(135deg, #ffeaa7, #fab1a0);
                border: none;
                border-radius: 20px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
              }
              .alternative strong {
                color: #2d3436;
                font-size: 16px;
              }
              .download-btn {
                background: linear-gradient(135deg, #00b894, #00a085);
                color: white;
                padding: 18px 35px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                font-size: 18px;
                display: inline-block;
                margin: 20px 0;
                transition: all 0.3s ease;
                box-shadow: 0 10px 20px rgba(0, 184, 148, 0.3);
                border: none;
                cursor: pointer;
              }
              .download-btn:active {
                transform: translateY(2px);
                box-shadow: 0 5px 10px rgba(0, 184, 148, 0.3);
              }
              .tip {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 15px;
                padding: 15px;
                margin-top: 20px;
                font-style: italic;
                color: #666;
                font-size: 14px;
              }
              @media (max-width: 480px) {
                body { padding: 10px; }
                .container { max-width: 95%; }
                .instructions { padding: 20px; }
                .step { padding: 15px; }
                h2 { font-size: 22px; }
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
                  <button onclick="saveImage()" class="download-btn">
                    📱 Save to Photos
                  </button>
                `
                    : ""
                }
              </div>
              
              <div class="instructions">
                <h2>📸 Save Your Result</h2>
                
                ${
                  isIOS()
                    ? `
                  <div class="step">
                    <div style="display: flex; align-items: flex-start;">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <div class="step-title">Tap and Hold Image</div>
                        <div class="step-desc">Press and hold the image above until a menu appears</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div style="display: flex; align-items: flex-start;">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <div class="step-title">Save to Photos</div>
                        <div class="step-desc">Tap "Save to Photos" or "Add to Photos" from the menu</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div style="display: flex; align-items: flex-start;">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <div class="step-title">Find in Photos App</div>
                        <div class="step-desc">Check Photos app → Recents album for your saved image</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="alternative">
                    <strong>🔄 Backup Method</strong><br>
                    Press <strong>Volume Up + Power</strong> buttons at the same time to screenshot this page
                  </div>
                  
                  <div class="tip">
                    💡 If the long-press doesn't work, try the screenshot buttons or refresh this page
                  </div>
                `
                    : `
                  <div class="step">
                    <div style="display: flex; align-items: flex-start;">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <div class="step-title">Right-click Image</div>
                        <div class="step-desc">Right-click on the image above</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div style="display: flex; align-items: flex-start;">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <div class="step-title">Save Image</div>
                        <div class="step-desc">Select "Save Image As..." or "Download Image"</div>
                      </div>
                    </div>
                  </div>
                `
                }
              </div>
            </div>
            
            <script>
              function saveImage() {
                const img = document.getElementById('result-image');
                
                // Try to trigger the context menu programmatically
                const event = new Event('contextmenu', {
                  bubbles: true,
                  cancelable: true
                });
                img.dispatchEvent(event);
                
                // Also try to create a download link
                const link = document.createElement('a');
                link.href = img.src;
                link.download = '${fileName}.png';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              
              // Enhanced iOS support
              if (${isIOS()}) {
                const img = document.getElementById('result-image');
                
                // Make image saveable
                img.style.webkitUserSelect = 'none';
                img.style.webkitTouchCallout = 'default';
                img.style.userSelect = 'none';
                
                // Add visual feedback
                img.addEventListener('touchstart', function() {
                  this.style.opacity = '0.8';
                  if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                  }
                }, { passive: true });
                
                img.addEventListener('touchend', function() {
                  this.style.opacity = '1';
                }, { passive: true });
                
                img.addEventListener('touchcancel', function() {
                  this.style.opacity = '1';
                }, { passive: true });
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert(
        "Please allow popups to save your screenshot, or take a manual screenshot using Volume Up + Power buttons.",
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
          : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
      }`}
    >
      {isCapturing ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
          Creating...
        </>
      ) : (
        <>
          <HiCamera className="h-5 w-5" />
          {isIOS() ? "Save Result" : "Save Image"}
        </>
      )}
    </button>
  );
};

export default ManualScreenshotButton;
