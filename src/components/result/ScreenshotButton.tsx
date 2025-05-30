"use client";

import { HiShare } from "react-icons/hi2";

interface ScreenshotButtonProps {
  score: number;
  avatarName: string;
  resultMessage: string;
  riceImageSrc: string;
}

const ScreenshotButton = ({
  score,
  avatarName,
  resultMessage,
  riceImageSrc,
}: ScreenshotButtonProps) => {
  const openShareableResult = () => {
    // Create a canvas to generate the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions (adjust as needed)
    canvas.width = 800;
    canvas.height = 600;

    if (!ctx) {
      alert("Canvas not supported in this browser");
      return;
    }

    // Fill background
    ctx.fillStyle = "#fefdf8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw the rice image
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Draw rice image on the left
      ctx.drawImage(img, 50, 150, 250, 250);

      // Set text styles and draw text
      ctx.fillStyle = "#000000";
      ctx.font = "bold 48px Inter, Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Your Score", 350, 200);

      // Draw score number
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 72px Inter, Arial, sans-serif";
      ctx.fillText(score.toString(), 350, 280);

      // Draw avatar text
      ctx.fillStyle = "#000000";
      ctx.font = "24px Inter, Arial, sans-serif";
      ctx.fillText(`You're ${avatarName}!`, 350, 320);

      // Draw result message
      ctx.fillStyle = "#6b7280";
      ctx.font = "italic 16px Inter, Arial, sans-serif";

      // Word wrap for result message
      const words = resultMessage.split(" ");
      let line = "";
      let y = 350;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > 350 && n > 0) {
          ctx.fillText(line, 350, y);
          line = words[n] + " ";
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 350, y);

      // Draw footer text
      ctx.fillStyle = "#000000";
      ctx.font = "24px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Thanks for your submission!", canvas.width / 2, 480);

      ctx.fillStyle = "#374151";
      ctx.font = "18px Inter, Arial, sans-serif";
      ctx.fillText(
        "The UCRPurity Test was created by the Purified Rice Team",
        canvas.width / 2,
        510,
      );

      // Convert canvas to image data URL
      const imageDataURL = canvas.toDataURL("image/png", 1.0);

      // Create the HTML for the new tab with the generated image
      const shareableHTML = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>UCR Purity Test Result - Score: ${score}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              
              .image-container {
                background: white;
                padding: 20px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
              }
              
              .result-image {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
                display: block;
              }
              
              .download-btn {
                background: #3b82f6;
                color: white;
                padding: 15px 30px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                margin: 10px;
                display: inline-block;
                transition: background-color 0.2s ease;
              }
              
              .download-btn:hover {
                background: #2563eb;
              }
              
              .instructions {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                max-width: 500px;
                margin-top: 20px;
                backdrop-filter: blur(10px);
              }
              
              .instructions h3 {
                margin-bottom: 15px;
                font-size: 18px;
              }
              
              .instruction-item {
                margin: 10px 0;
                padding: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
              }
              
              @media (max-width: 768px) {
                .instructions {
                  margin-top: 30px;
                }
              }
            </style>
          </head>
          <body>
            <div class="image-container">
              <img src="${imageDataURL}" alt="UCR Purity Test Result - Score: ${score}" class="result-image" />
              <div style="text-align: center; margin-top: 15px;">
                <a href="${imageDataURL}" download="ucr-purity-score-${score}.png" class="download-btn">
                  📥 Download Image
                </a>
              </div>
            </div>
            
            <div class="instructions">
              <h3>💾 How to Save This Image:</h3>
              <div class="instruction-item">
                <strong>Desktop:</strong> Right-click on the image above → "Save Image As..."
              </div>
              <div class="instruction-item">
                <strong>iPhone:</strong> Tap and hold the image → "Save to Photos"
              </div>
              <div class="instruction-item">
                <strong>Android:</strong> Tap and hold the image → "Download Image"
              </div>
              <div class="instruction-item">
                <strong>Alternative:</strong> Click the "Download Image" button above
              </div>
            </div>
          </body>
        </html>
      `;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(shareableHTML);
        newWindow.document.close();
      } else {
        alert("Please allow popups to open the shareable result page.");
      }
    };

    img.onerror = () => {
      // Fallback if image fails to load - create text-only version
      console.warn("Rice image failed to load, creating text-only version");

      // Clear canvas and redraw without image
      ctx.fillStyle = "#fefdf8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center everything since there's no image
      ctx.fillStyle = "#000000";
      ctx.font = "bold 48px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Your Score", canvas.width / 2, 150);

      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 96px Inter, Arial, sans-serif";
      ctx.fillText(score.toString(), canvas.width / 2, 250);

      ctx.fillStyle = "#000000";
      ctx.font = "32px Inter, Arial, sans-serif";
      ctx.fillText(`You're ${avatarName}!`, canvas.width / 2, 300);

      ctx.fillStyle = "#6b7280";
      ctx.font = "italic 20px Inter, Arial, sans-serif";
      ctx.fillText(resultMessage, canvas.width / 2, 340);

      ctx.fillStyle = "#000000";
      ctx.font = "24px Inter, Arial, sans-serif";
      ctx.fillText("Thanks for your submission!", canvas.width / 2, 420);

      ctx.fillStyle = "#374151";
      ctx.font = "18px Inter, Arial, sans-serif";
      ctx.fillText(
        "The UCRPurity Test was created by the Purified Rice Team",
        canvas.width / 2,
        450,
      );

      // Generate image and create new tab
      const imageDataURL = canvas.toDataURL("image/png", 1.0);
      const shareableHTML = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>UCR Purity Test Result - Score: ${score}</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              .image-container {
                background: white;
                padding: 20px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              }
              .result-image {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
              }
              .download-btn {
                background: #3b82f6;
                color: white;
                padding: 15px 30px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 15px;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <div class="image-container">
              <img src="${imageDataURL}" alt="UCR Purity Test Result" class="result-image" />
              <div style="text-align: center;">
                <a href="${imageDataURL}" download="ucr-purity-score-${score}.png" class="download-btn">
                  📥 Download Image
                </a>
              </div>
            </div>
          </body>
        </html>
      `;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(shareableHTML);
        newWindow.document.close();
      }
    };

    // Set the image source to trigger loading
    img.src = riceImageSrc;
  };
  return (
    <button
      onClick={openShareableResult}
      className="flex h-fit w-fit cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
    >
      <HiShare className="h-5 w-5" />
      Share Result
    </button>
  );
};

export default ScreenshotButton;
