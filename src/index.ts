import puppeteer from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { JSDOM } from "jsdom";
import * as XLSX from "xlsx";
import fs from "fs";
import {
  SupplementInfo,
  SupplementDetail,
  SupplementNutorition,
  Top24Supplements
} from "./types/crawling/crawling";
import getTop24URLs from "./common/GetTop24URLs";
import getSpDetails from "./common/getSpInfo";
import { write } from "./common/common_csv";

const main = async () => {
  //成分名のcsv読み込み
  const nuttoritions: string[] = ["DHA"];
  nuttoritions.map(async i => {
    //top24取得
    const top24URLS = await getTop24URLs(i);
    // //データの詳細とクローリング
    //const details: SupplementInfo =
    const spDetails = await getSpDetails(top24URLS);

    //spInfo.csvの末尾にサプリ詳細書き出し
    write(spDetails, "src/outputData/spInfo.csv");
    // //末尾にtop24一覧の書き出し
    // writerTop24(top24URLS);

    // writeSpInfo(details.spInfo);
    // //末尾に成分の一覧書き出し
    // writeSpDetail(details.spDetail);
  });
};

// async function main() {
//   for (var i = 0; i < 10; i++) {
//     console.log(i);
//     await sleep(1000);  // 1000ミリ秒スリープする (厳密に言うとスリープじゃないんだけど)
//   }
// }

async function main2() {
  for await (var num of [1, 2, 3, 4, 5]) {
    console.log(num);
    await sleep(1000); // 1000ミリ秒スリープする (厳密に言うとスリープじゃないんだけど)
  }
}
const sleep = (milliSeconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

// main2();
main();
