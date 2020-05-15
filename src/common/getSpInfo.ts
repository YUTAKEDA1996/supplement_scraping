import puppeteer, { Page } from "puppeteer";
import {
  SupplementNutorition,
  SupplementDetail,
  Top24Supplements,
  SupplementInfo,
  Xpaths
} from "../types/crawling/crawling";

const xpaths: Xpaths = [
  {
    path: '//h1[@id="name"]',
    property: "textContent",
    name: "productName",
    arrayIndex: 0,
    typeInfo: "string"
  },
  {
    path: '//meta[@property="og:brand"]',
    property: "content",
    name: "brand",
    arrayIndex: 0,
    typeInfo: "string"
  },
  {
    path: '//ul[@id="product-specs-list"]/li ',
    property: "textContent",
    name: "amount",
    arrayIndex: 4,
    typeInfo: "number"
  },
  {
    path: '//ul[@id="product-specs-list"]/li ',
    property: "textContent",
    name: "unit",
    arrayIndex: 4,
    typeInfo: "string"
  },
  {
    path: '//meta[@itemprop="price"]',
    property: "content",
    name: "price",
    arrayIndex: 0,
    typeInfo: "number"
  },

  {
    path: '//span[@itemprop="sku"] ',
    property: "textContent",
    name: "productCode",
    arrayIndex: 0,
    typeInfo: "string"
  },
  {
    path: '//meta[@itemprop="ratingValue"]',
    property: "content",
    name: "rating",
    arrayIndex: 0,
    typeInfo: "number"
  },
  {
    path: '//meta[@property="og:rating_count"]',
    property: "content",
    name: "raitingCount",
    arrayIndex: 0,
    typeInfo: "number"
  },
  {
    path: '//meta[@property="og:availability"]',
    property: "content",
    name: "stokeStatus",
    arrayIndex: 0,
    typeInfo: "string"
  },

  {
    path: '//img[@id="iherb-product-image"]',
    property: "src",
    name: "productImgUrl",
    arrayIndex: 0,
    typeInfo: "string"
  }
  // {
  //   path: '//div[@class="supplement-facts-container"]/table/tbody/tr/td',
  //   property: "textContet",
  //   name: "table",
  //   arrayIndex: 0,
  //   n,e
  // }
];

const getSpDetails = async (top24SpInfos: Top24Supplements) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const spDetails: Partial<SupplementDetail>[] = [];
  for await (var obj of top24SpInfos.slice(0, 2)) {
    const page: Page = await browser.newPage();
    await page.goto(obj.url);
    const tempSpInfo: any = {};
    tempSpInfo["productId"] = 0;
    for await (var pathObj of xpaths) {
      const elemts: any = await page.$x(pathObj.path);
      const handle = await elemts?.[pathObj.arrayIndex]?.getProperty(
        pathObj.property
      );
      const result: string = await handle?.jsonValue();
      switch (pathObj.typeInfo) {
        case "string":
          tempSpInfo[pathObj.name] =
            pathObj.name === "unit" ? getUnit(result) : result;
          break;
        case "number":
          tempSpInfo[pathObj.name] =
            pathObj.name === "amount" ? getAmount(result) : Number(result);
          break;
        default:
      }
    }
    const pricePerOne = tempSpInfo.price / tempSpInfo.amount;
    tempSpInfo["capsu"] = pricePerOne ? pricePerOne : 0;
    tempSpInfo["capsuleType"] = getCapsuleType(obj.url);
    tempSpInfo["productUrl"] = obj.url;
    const spDetail: Partial<SupplementDetail> = tempSpInfo;
    spDetails.push(spDetail);
    console.log("次へ");
    await sleep(10000);
  }
  browser.close();
  return spDetails;
};

const getNutorition = async (page: Page) => {
  // const query = (selector: string, page: Page) =>
  //   Array.from(page.querySelectorAll(selector));
  // console.log(
  //   query("tr", document).map(row =>
  //     query("td, th", row).map(cell => cell.textContent)
  //   )
  // );

  console.log("getNutorition");
  // const elemts = await page.$x(
  //   '//div[@class="supplement-facts-container"]/table'
  // );
  const trList = await page.$$("table tr");
  // console.log(
  //   await Promise.all(
  //     trList.map(async (tr: any) => {
  //       return {
  //         key: (
  //           await tr
  //             .$("td.key")
  //             .getProperty("innerText")
  //             .jsonValue()
  //         ).trim(),
  //         value: (
  //           await tr
  //             .$("tr.key")
  //             .getProperty("innerText")
  //             .jsonValue()
  //         ).trim()
  //       };
  //     })
  //   )
  // );
  // console.log(await Promise.all(trList));

  // const ws = XLSX.utils.table_to_sheet(elemts);
  // console.log({ ws });
  // console.log(elemts.length);
  // await Promise.all(
  //   elemts.map(async (i: any) => {
  //     const jsHandle = await i.getProperty("textContent");
  //     const ws = XLSX.utils.table_to_sheet(i);
  //
  //     const text = await jsHandle.jsonValue();
  //     console.log(text.replace(/      /g, "\t").split("\t"));
  //     return true;
  //   })
  // );
};

const getCapsuleType = (productURL: string): string => {
  if (productURL.match(/soft/gi)) {
    return "Softgels";
  } else if (productURL.match(/capsules/gi)) {
    return "Capsules";
  } else if (productURL.match(/tablets/gi)) {
    return "Tablets";
  }
  return "Not Found";
};

const getAmount = (amountString: string): number => {
  const amount = amountString.match(/\d+/g)?.[0];
  return amount ? Number(amount) : 0;
};

const getUnit = (amountString: string): string => {
  const unit = amountString.match(/\D+/g)?.[1];
  return unit ? unit : "Not Found";
};

const sleep = (milliSeconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

export default getSpDetails;
