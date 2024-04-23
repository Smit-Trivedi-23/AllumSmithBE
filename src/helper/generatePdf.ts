import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

export const generatePDF = async (path) => {
  const browser = await puppeteer.launch({
    headless: true,
    // executablePath: '/snap/bin/chromium',
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 595,
    height: 842,
    deviceScaleFactor: 1,
  });
  const html = readFileSync(path, 'utf8');
  await page.setContent(html, {
    waitUntil: 'load',
  });

  const pdf = await page.pdf({
    // displayHeaderFooter: true,
    // headerTemplate: `
    //     <div style="
    //         font-family: Arial, Helvetica, sans-serif;
    //         font-size: 27px;
    //         width: 100%;
    //         display: flex;
    //         justify-content: flex-end; /* Align header content to the end */
    //         padding: 20px;
    //         color: #333333;
    //     ">
    //         PURCHASE ORDER
    //     </div>
    // `,
    format: 'A4',
    path: 'new.pdf',
    margin: { top: '50px', bottom: '50px' },
    printBackground: true,
    landscape: true,
  });

  await browser.close();
  return pdf;
};
