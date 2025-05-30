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

  // Detect Safari browser
  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

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

  // Check if browser supports native share API
  const canShare = () => {
    return "share" in navigator && "canShare" in navigator;
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        setIsCapturing(false);
        return;
      }

      // Wait a bit for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // For iOS devices, try an alternative approach first
      if (isIOS()) {
        try {
          // Alternative method: Create a high-quality canvas copy
          const rect = element.getBoundingClientRect();
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");

          if (ctx) {
            // Set canvas size with device pixel ratio for better quality
            const scale = window.devicePixelRatio || 1;
            tempCanvas.width = rect.width * scale;
            tempCanvas.height = rect.height * scale;
            tempCanvas.style.width = rect.width + "px";
            tempCanvas.style.height = rect.height + "px";
            ctx.scale(scale, scale);

            // Try to render using html2canvas with iOS-specific settings
            const fallbackCanvas = await html2canvas(element, {
              useCORS: true,
              allowTaint: false,
              logging: false,
            });

            // Copy the result to our high-quality canvas
            ctx.drawImage(fallbackCanvas, 0, 0, rect.width, rect.height);

            // Try native share first
            if (canShare()) {
              tempCanvas.toBlob(
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
                    } catch (shareErr) {
                      console.log("Share failed:", shareErr);
                    }
                  }
                  // If share fails, show in new tab
                  showImageInNewTab(tempCanvas);
                },
                "image/png",
                0.95,
              );
              return;
            } else {
              // No share API, show in new tab
              showImageInNewTab(tempCanvas);
              return;
            }
          }
        } catch (iosError) {
          console.log("iOS alternative method failed:", iosError);
          // Fall through to standard method
        }
      }

      // Standard html2canvas approach for other platforms
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      // Try native share first on iOS if available
      if (isIOS() && canShare()) {
        try {
          canvas.toBlob(
            async (blob) => {
              if (blob) {
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
              }
              // Fallback to image tab if share fails
              showImageInNewTab(canvas);
            },
            "image/png",
            0.8,
          );
          return;
        } catch {
          console.log("Native share failed, falling back to image display");
          // Continue to fallback method
        }
      }

      // For Safari (macOS and iOS) or mobile devices
      if (isSafari() || isIOS() || isMobile()) {
        showImageInNewTab(canvas);
      } else {
        // For all other browsers: Standard download
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
      console.error("Failed to capture screenshot:", error);

      // Enhanced error handling for different platforms
      let errorMsg = "Screenshot failed. ";
      if (isIOS()) {
        errorMsg +=
          "Please try taking a manual screenshot using your device's screenshot function (Volume Up + Power button).";
      } else if (isSafari()) {
        errorMsg +=
          "Please try using Chrome or Firefox, or take a manual screenshot.";
      } else {
        errorMsg += "Please try again or take a manual screenshot.";
      }

      alert(errorMsg);
    } finally {
      setIsCapturing(false);
    }
  };

  // Helper function to show image in new tab with enhanced instructions
  const showImageInNewTab = (canvas: HTMLCanvasElement) => {
    const imageDataURL = canvas.toDataURL("image/png", 0.8);

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
                padding: 15px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: #f8f9fa;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                box-sizing: border-box;
                line-height: 1.5;
              }
              .container {
                max-width: 95%;
                width: 100%;
                text-align: center;
              }
              .image-container {
                background: white;
                border-radius: 16px;
                padding: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                margin-bottom: 25px;
                display: inline-block;
                max-width: 100%;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                display: block;
                touch-action: manipulation;
              }
              .instructions {
                background: white;
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                max-width: 450px;
                margin: 0 auto;
              }
              h2 {
                color: #1a1a1a;
                margin: 0 0 15px 0;
                font-size: 20px;
                font-weight: 600;
              }
              p {
                color: #666;
                margin: 8px 0;
                font-size: 14px;
              }
              .step {
                background: #f1f3f4;
                border-radius: 10px;
                padding: 12px 15px;
                margin: 10px 0;
                text-align: left;
                border-left: 4px solid #4285f4;
                font-size: 14px;
              }
              .platform-specific {
                display: none;
              }
              .ios-instructions {
                display: ${isIOS() ? "block" : "none"};
              }
              .safari-mac-instructions {
                display: ${isSafari() && !isIOS() ? "block" : "none"};
              }
              .android-instructions {
                display: ${isMobile() && !isIOS() ? "block" : "none"};
              }
              .highlight {
                background: #e8f0fe;
                padding: 15px;
                border-radius: 10px;
                border: 2px solid #4285f4;
                margin: 15px 0;
              }
              .emoji {
                font-size: 18px;
                margin-right: 8px;
              }
              @media (max-width: 480px) {
                .container { max-width: 100%; }
                .instructions { padding: 15px; margin: 0 10px; }
                h2 { font-size: 18px; }
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
                <div style="margin-top: 15px;">
                  <a href="${imageDataURL}" download="${fileName}.png" 
                     style="display: inline-block; background: #007AFF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    📥 Download Image
                  </a>
                  <p style="font-size: 12px; color: #666; margin-top: 8px; margin-bottom: 0;">
                    (Tap the download button, then follow the instructions below)
                  </p>
                </div>
                `
                    : ""
                }
              </div>
              
              <div class="instructions">
                <h2>📸 Save Your Result</h2>
                
                <div class="ios-instructions platform-specific">
                  <div class="highlight">
                    <p><strong>📱 iPhone/iPad Instructions:</strong></p>
                  </div>
                  <div class="step">
                    <span class="emoji">1️⃣</span>
                    <strong>Tap and hold</strong> on the image above until a menu appears
                  </div>
                  <div class="step">
                    <span class="emoji">2️⃣</span>
                    Tap <strong>"Save to Photos"</strong> or <strong>"Add to Photos"</strong>
                  </div>
                  <div class="step">
                    <span class="emoji">3️⃣</span>
                    Check the <strong>Photos app</strong> → <strong>Recents</strong> album
                  </div>
                  <div class="step">
                    <span class="emoji">🔄</span>
                    <strong>Alternative:</strong> Press <strong>Volume Up + Power</strong> buttons together to screenshot this entire page
                  </div>
                  <p style="margin-top: 15px; font-style: italic; color: #888;">
                    💡 If the long-press doesn't work, try refreshing this page or taking a regular screenshot
                  </p>
                </div>
                
                <div class="safari-mac-instructions platform-specific">
                  <div class="highlight">
                    <p><strong>🖥️ Safari on Mac Instructions:</strong></p>
                  </div>
                  <div class="step">
                    <span class="emoji">1️⃣</span>
                    <strong>Right-click</strong> on the image above
                  </div>
                  <div class="step">
                    <span class="emoji">2️⃣</span>
                    Select <strong>"Save Image As..."</strong> or <strong>"Download Image"</strong>
                  </div>
                  <div class="step">
                    <span class="emoji">3️⃣</span>
                    Choose your <strong>download location</strong> and save
                  </div>
                  <p style="margin-top: 15px; font-style: italic; color: #888;">
                    💡 Alternative: Try using Chrome or Firefox for automatic downloads
                  </p>
                </div>
                
                <div class="android-instructions platform-specific">
                  <div class="highlight">
                    <p><strong>📱 Android Instructions:</strong></p>
                  </div>
                  <div class="step">
                    <span class="emoji">1️⃣</span>
                    <strong>Long press</strong> on the image above
                  </div>
                  <div class="step">
                    <span class="emoji">2️⃣</span>
                    Select <strong>"Download image"</strong> or <strong>"Save image"</strong>
                  </div>
                  <div class="step">
                    <span class="emoji">3️⃣</span>
                    Check your <strong>Downloads folder</strong> or <strong>Gallery</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <script>
              // Enhanced iOS support
              if (${isIOS()}) {
                const img = document.getElementById('result-image');
                
                // Enable image saving on iOS
                img.style.webkitUserSelect = 'none';
                img.style.webkitTouchCallout = 'default';
                img.style.userSelect = 'none';
                img.style.touchAction = 'manipulation';
                
                // Add long-press detection for iOS
                let pressTimer = null;
                let touchStartTime = 0;
                
                img.addEventListener('touchstart', function(e) {
                  touchStartTime = Date.now();
                  pressTimer = setTimeout(() => {
                    // Trigger context menu after 500ms
                    const event = new Event('contextmenu', { bubbles: true, cancelable: true });
                    img.dispatchEvent(event);
                  }, 500);
                }, { passive: true });
                
                img.addEventListener('touchend', function(e) {
                  if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                  }
                  
                  const touchDuration = Date.now() - touchStartTime;
                  if (touchDuration > 500) {
                    // Long press detected
                    e.preventDefault();
                  }
                }, { passive: false });
                
                img.addEventListener('touchmove', function(e) {
                  if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                  }
                }, { passive: true });
                
                // Prevent default context menu to make our custom one work
                img.addEventListener('contextmenu', function(e) {
                  // Don't prevent - we want the context menu to show
                  return true;
                });
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      // Fallback if popup is blocked
      alert(
        "Please allow popups for this site to save your screenshot, or take a manual screenshot using your device's screenshot function.",
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
