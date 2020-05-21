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

const spDetailCsvPath = "src/outputData/spInfo.csv";
const spNutoritionsCsvPath = "src/outputData/spNutorition.csv";
const ingredNameCsvPath = "src/outputData/IngredientName.csv";
const top24URLsCsvPath = "src/outputData/top24URL.csv";

const main = async () => {
  //成分名のcsv読み込み
  const nuttoritions: string[] = ["DHA"];
  nuttoritions.map(async i => {
    //top24取得
    const top24URLS: Top24Supplements = await getTop24URLs(i);

    //過去に一度取得したURLは消去する
    const uniqueURLS: Top24Supplements = await deduplication(
      top24URLS,
      spDetailCsvPath
    );

    // //データの詳細とクローリング
    //const details: SupplementInfo =
    const spInfos: {
      spNutoritions: SupplementNutorition[];
      spDetails: SupplementDetail[];
    } = await getSpDetails(uniqueURLS);

    //spInfo.csvの末尾にサプリ詳細書き出し

    //書き出し用形式に変形
    const exportFormatNutorition: ExFormattNutorition = getExFormattNutorition(
      spInfos.spNutoritions
    );

    write(spInfos.spDetails, spDetailCsvPath);
    write(exportFormatNutorition, spNutoritionsCsvPath);

    // //末尾にtop24一覧の書き出し
    // writerTop24(top24URLS);

    // writeSpInfo(details.spInfo);
    // //末尾に成分の一覧書き出し
    // writeSpDetail(details.spDetail);
  });
};

const top24URLoutputs = async () => {
  const words: any[] = readCsv(ingredNameCsvPath);
  const endWords: string[][] = [];
  console.log("\t--loading start！---");
  for await (var c of words.slice(1, 12)) {
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

top24URLoutputs();
//main();
