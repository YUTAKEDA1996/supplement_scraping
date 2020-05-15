import puppeteer, { Page } from "puppeteer";
import getNutoritions from "./nutorition";
import getSpDetail from "./spDetail";
import { sleep } from "./utility";
import {
  SupplementDetail,
  Top24Supplements,
  SupplementInfo
} from "../types/crawling/crawling";

const getSpDetails = async (top24SpInfos: Top24Supplements) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const spInfos: SupplementInfo[] = [];
  for await (var obj of top24SpInfos) {
    const page: Page = await browser.newPage();
    await page.goto(obj.url);
    const spNutorition = await getNutoritions(page, obj.productName, obj.url);
    const spDetail = await getSpDetail(page, obj.url);
    const spInfo: SupplementInfo = {
      id: 0,
      spDetail: spDetail,
      spNutorition: spNutorition
    };
    spInfos.push(spInfo);
    console.log("次へ");
    console.log({ spInfo });
    console.log(spInfo.spNutorition);
    await sleep(10000);
  }
  browser.close();
  return spInfos;
};

export default getSpDetails;
