console.log('Looking for HTML files in:', rootDir);
console.log('Found HTML files:', htmlFiles);
const puppeteer = require('puppeteer');

const urls = [
  'http://localhost:3000', // 👈 Replace these with your actual URLs
  'http://localhost:3000/about.html',
  'http://localhost:3000/interview.html'
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const filename = url.split('/').pop() || 'home';
    await page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
    console.log(`✅ Screenshot saved: screenshots/${filename}.png`);
  }

  await browser.close();
})();
