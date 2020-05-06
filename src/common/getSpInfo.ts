import puppeteer from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { JSDOM } from "jsdom";
import * as XLSX from "xlsx";
import fs from "fs";
import {
  SupplementNutorition,
  SupplementDetail,
  Top24Supplements,
  SupplementInfo,
  Xpaths
} from "../types/crawling/crawling";

const xpaths: Xpaths = [
  {
    path: '//meta[@itemprop="price"]',
    property: "content",
    name: "price",
    arrayIndex: 0
  },
  {
    path: '//h1[@id="name"]',
    property: "textContent",
    name: "productName",
    arrayIndex: 0
  },
  {
    path: '//ul[@id="product-specs-list"]/li ',
    property: "textContent",
    name: "amount",
    arrayIndex: 4
  },
  {
    path: '//span[@itemprop="sku"] ',
    property: "textContent",
    name: "productCode",
    arrayIndex: 0
  },
  {
    path: '//meta[@itemprop="ratingValue"]',
    property: "content",
    name: "reting",
    arrayIndex: 0
  },
  {
    path: '//meta[@property="og:rating_count"]',
    property: "content",
    name: "retingCount",
    arrayIndex: 0
  },
  {
    path: '//meta[@property="og:availability"]',
    property: "content",
    name: "isStock",
    arrayIndex: 0
  },
  {
    path: '//meta[@property="og:brand"]',
    property: "content",
    name: "brand",
    arrayIndex: 0
  },
  {
    path: '//img[@id="iherb-product-image"]',
    property: "src",
    name: "productImgUrl",
    arrayIndex: 0
  }
  // {
  //   path: '//div[@class="supplement-facts-container"]/table/tbody/tr/td',
  //   property: "textContet",
  //   name: "table",
  //   arrayIndex: 0
  // }
];

//: Promise<SupplementInfo>
const getSpInfo = async (top24SpInfos: Top24Supplements) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  for await (var obj of top24SpInfos) {
    const page = await browser.newPage();
    await page.goto(obj.url);
    console.log("detail url=", obj.url);
    for await (var pathObj of xpaths) {
      const elemts: any = await page.$x(pathObj.path);
      const handle = await elemts?.[pathObj.arrayIndex]?.getProperty(
        pathObj.property
      );
      const result: string = await handle?.jsonValue();
      console.log({ name: pathObj.name, result: result });
    }
    console.log("次へ");
    await sleep(100000);
  }

  browser.close();
};

const sleep = (milliSeconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

export default getSpInfo;
