import puppeteer, { Page } from "puppeteer";
import getNutoritions from "./nutorition";
import getSpDetail from "./spDetail";
import { sleep, getExFormattNutorition } from "./utility";
import {
  SupplementDetail,
  Top24Supplements,
  SupplementInfo,
  SupplementNutorition,
  ExFormattNutorition
} from "../types/crawling/crawling";
import readCsv, { write, overWrite } from "../common/common_csv";
import {
  spDetailCsvPath,
  spNutoritionsCsvPath,
  ingredNameCsvPath,
  top24URLsCsvPath
} from "../paths";

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
  var counter = 0;
  for await (var obj of top24SpInfos) {
    counter += 1;
    const page: Page = await browser.newPage();
    await page.goto(obj.url);
    const spNutorition = await getNutoritions(page, obj.productName, obj.url);
    const spDetail = await getSpDetail(page, obj.url);
    spNutoritions.push(spNutorition);
    spDetails.push(spDetail);
    const exportFormatNutorition: ExFormattNutorition = getExFormattNutorition([
      spNutorition
    ]);
    write([spDetail], spDetailCsvPath);
    write(exportFormatNutorition, spNutoritionsCsvPath);
    const nokoriZikan = ((top24SpInfos.length - counter) * 20) / 60;
    console.log(
      obj.productName +
        "\tDone! waiting next...  remaining time\t" +
        String(Math.floor(nokoriZikan)) +
        "min"
    );
    await sleep(10000);
  }
  browser.close();
  return { spNutoritions: spNutoritions, spDetails: spDetails };
};

export default getSpInfos;
