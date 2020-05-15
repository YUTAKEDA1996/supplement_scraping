import puppeteer from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { JSDOM } from "jsdom";
import * as XLSX from "xlsx";
import fs from "fs";
import { Top24Supplements } from "../types/crawling/crawling";

const getTop24URLs = async (nutorition: string): Promise<Top24Supplements> => {
  //空白をURL用にencode
  const encodeNutorition = nutorition.replace(/ /g, "%20");
  const url =
    "https://jp.iherb.com/search?kw=" + encodeNutorition + "&noi=24&cids=1855";
  console.log(url);
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  const res: any = await page.goto(url);
  const links = '//a[@class="absolute-link product-link"]';
  const elemts: any = await page.$x(links);
  const top24Supplement: Top24Supplements = [];
  await Promise.all(
    elemts.map(async (i: any) => {
      const handleURL = await i.getProperty("href");
      const handleTitle = await i.getProperty("title");
      const url: string = await handleURL.jsonValue();
      const title: string = await handleTitle.jsonValue();
      top24Supplement.push({
        category: nutorition,
        productName: title,
        url: url
      });
      return true;
    })
  );
  await browser.close();
  return top24Supplement;
};

export default getTop24URLs;
