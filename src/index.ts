import { sleep } from "./common/utility";
import {
  SupplementInfo,
  SupplementDetail,
  SupplementNutorition,
  Top24Supplements,
  ExFormattNutorition
} from "./types/crawling/crawling";
import getTop24URLs from "./common/GetTop24URLs";
import getSpDetails from "./common/getSpInfo";
import readCsv, { write, overWrite } from "./common/common_csv";
import { deduplication, getExFormattNutorition } from "./common/utility";
import {
  spDetailCsvPath,
  spNutoritionsCsvPath,
  ingredNameCsvPath,
  top24URLsCsvPath
} from "./paths";

//csv fileのpath

const main = async () => {
  console.log("\t--collecting details start！---");
  //成分名のcsv読み込み
  const readURLSCSV = readCsv(top24URLsCsvPath);
  const topSpURLs: Top24Supplements = convertObj(readURLSCSV.slice(1), [
    "category",
    "productName",
    "url",
    "rating",
    "raitingCount",
    "price",
    "capsuleType"
  ]);
  //過去に一度取得したURLは消去する
  const uniqueURLS: Top24Supplements = await deduplication(
    topSpURLs,
    spDetailCsvPath
  );
  await getSpDetails(uniqueURLS);
  console.log("\t--collecting details end！---");
};

const top24URLoutputs = async () => {
  const words: any[] = readCsv(ingredNameCsvPath);
  const endWords: string[][] = [];
  console.log("\t--loading start！---");
  for await (var c of words.slice(1)) {
    if (c[1] === "false") {
      const Top24URL = await getTop24URLs(c[0]);
      write(Top24URL, top24URLsCsvPath);
      await sleep(10000);
      console.log(c[0] + "\tDone! waiting next...");
    } else {
      console.log(c[0] + "\tAlready finished");
    }

    endWords.push([c[0], "true"]);
  }

  const conect = endWords.concat(words.slice(endWords.length + 1));
  overWrite(convertObj(conect, ["name", "isFinish"]), ingredNameCsvPath);
  console.log("\t--All finished！---");
};

const convertObj = (array: string[][], colums: string[]) => {
  const objs: any[] = [];
  array.map(i => {
    const obj: any = {};
    colums.map((c: string, index: number) => {
      obj[c] = i[index];
    });
    objs.push(obj);
  });
  return objs;
};

//コマンドライン引数対応

// const commandLineArgs = require("command-line-args");
// const optionDefinitions = [
//   {
//     name: "fcType",
//     alias: "v",
//     type: String  }
// ];
// const options = commandLineArgs(optionDefinitions);
// console.log(options);
// options.fcType === "getInfo" ? main() : top24URLoutputs();

top24URLoutputs();
main();
