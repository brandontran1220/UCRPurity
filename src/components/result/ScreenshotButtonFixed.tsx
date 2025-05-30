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

      // Wait a moment for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        backgroundColor: "#fefdf8",
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: false,
        imageTimeout: 10000,
        removeContainer: false,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc: Document) => {
          // Copy all styles to the cloned document
          const originalStyles = Array.from(document.styleSheets);
          originalStyles.forEach((styleSheet) => {
            try {
              if (styleSheet.href) {
                // External stylesheet
                const link = clonedDoc.createElement("link");
                link.rel = "stylesheet";
                link.href = styleSheet.href;
                clonedDoc.head.appendChild(link);
              } else if (styleSheet.ownerNode) {
                // Inline stylesheet
                const clonedStyle = styleSheet.ownerNode.cloneNode(true);
                clonedDoc.head.appendChild(clonedStyle);
              }
            } catch (e) {
              // Cross-origin or other access issues, ignore
              console.log("Could not clone stylesheet:", e);
            }
          });

          // Ensure all images are fully loaded and visible
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img: HTMLImageElement) => {
            // Force image visibility and proper sizing
            img.style.display = "block";
            img.style.visibility = "visible";
            img.style.opacity = "1";

            // Ensure explicit sizing
            if (img.width && img.height) {
              img.style.width = img.width + "px";
              img.style.height = img.height + "px";
            }
          });

          // Ensure text is properly styled
          const textElements = clonedDoc.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, p, span, div",
          );
          textElements.forEach((el: HTMLElement) => {
            const computedStyle = window.getComputedStyle(el);
            el.style.color = computedStyle.color;
            el.style.fontSize = computedStyle.fontSize;
            el.style.fontWeight = computedStyle.fontWeight;
            el.style.fontFamily = computedStyle.fontFamily;
            el.style.lineHeight = computedStyle.lineHeight;
            el.style.textAlign = computedStyle.textAlign;
          });
        },
      });

      // Handle the screenshot based on platform
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
          0.95,
        );
      } else if (isIOS()) {
        // iOS without share support
        showImageInNewTab(canvas);
      } else {
        // Desktop/Android - direct download
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
          0.95,
        );
      }
    } catch (error) {
      console.error("Screenshot failed:", error);

      if (isIOS()) {
        alert(
          "Screenshot capture failed. Please take a manual screenshot using Volume Up + Power button.",
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
