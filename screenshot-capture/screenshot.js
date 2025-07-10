const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const file of htmlFiles) {
    const filePath = `file://${path.join(rootDir, file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    const name = path.basename(file, '.html');
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    console.log(`✅ Screenshot saved for ${file}`);
  }

  await browser.close();
})();
