import puppeteer from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { JSDOM } from "jsdom";
import * as XLSX from "xlsx";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  //   const iPhone = devices["iPhone 6"];

  //   await page.emulate(iPhone);
  // login
  const res: any = await page.goto(
    "https://jp.iherb.com/pr/Doctor-s-Best-Glucosamine-Chondroitin-MSM-Hyaluronic-Acid-150-Veggie-Caps/40634?refid=3d808545-7e1d-40a0-8c02-9ade32a36386&reftype=rec"
  ); //sample-site.comへ接続

  const xpath = '//div[@id="price"]';
  const titlePath = '//h1[@id="name"]';
  const amount = '//ul[@id="product-specs-list"]/li ';
  const retingValue = '//meta[@itemprop="ratingValue"]'; //count
  const retingCount = '//meta[@itemprop="ratingCount"]'; //content
  const stockStatus = '//div[@id="stock-status"]/strong'; //textContet
  const imgURL = '//img[@id="iherb-product-image"]'; //src
  const table = '//div[@class="supplement-facts-container"]/table/tbody/tr/td';

  const elems = await page.$x(table);
  console.log(elems.length);
  //   const jsHandle = await elems[0]?.getProperty("textContent");

  await Promise.all(
    elems?.map(async i => {
      const jsHandle = await i?.getProperty("textContent");
      const text = await jsHandle?.jsonValue();
      console.log({ text });
      return true;
    })
  );
  //   const jsHandle = await elems[20]?.getProperty("textContent");
  //   const text = await jsHandle?.jsonValue();

  //console.log({ text });

  browser.close();
})();

//   const jsHandle = await elems[0]?.getProperty("textContent");
// await elems?.map(async i => {
//     console.log(i.getProperty("textContent"));
//     const text = await jsHandle?.jsonValue();
//     console.log({ text });
// });
//     const jsHandle = await elems[20]?.getProperty("textContent");
//     const text = await jsHandle?.jsonValue();

//   console.log({ text });
