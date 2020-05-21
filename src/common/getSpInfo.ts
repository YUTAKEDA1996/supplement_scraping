import puppeteer, { Page } from "puppeteer";
import getNutoritions from "./nutorition";
import getSpDetail from "./spDetail";
import { sleep } from "./utility";
import {
  SupplementDetail,
  Top24Supplements,
  SupplementInfo,
  SupplementNutorition
} from "../types/crawling/crawling";

const getSpInfos = async (
  top24SpInfos: Top24Supplements
): Promise<{
  spNutoritions: SupplementNutorition[];
  spDetails: SupplementDetail[];
}> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const spDetails: SupplementDetail[] = [];
  const spNutoritions: SupplementNutorition[] = [];

  for await (var obj of top24SpInfos.slice(0, 3)) {
    const page: Page = await browser.newPage();
    await page.goto(obj.url);
    const spNutorition = await getNutoritions(page, obj.productName, obj.url);
    const spDetail = await getSpDetail(page, obj.url);
    spNutoritions.push(spNutorition);
    spDetails.push(spDetail);
    await sleep(10000);
  }
  browser.close();
  return { spNutoritions: spNutoritions, spDetails: spDetails };
};

export default getSpInfos;
