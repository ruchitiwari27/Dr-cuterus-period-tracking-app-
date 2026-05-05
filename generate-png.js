import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  console.log("Starting chromium...");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  
  const svgPath = path.resolve(__dirname, "assets/icon.svg");
  const svgContent = fs.readFileSync(svgPath, "utf-8");
  
  console.log("Rendering SVG to PNG...");
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; background: #F5D1DA; }
          svg { width: 1024px; height: 1024px; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `);
  
  // take screenshot
  await page.screenshot({ path: path.resolve(__dirname, "assets/icon.png") });
  
  await browser.close();
  console.log("Successfully generated assets/icon.png");
}

generate().catch(console.error);
