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
  for await (var obj of top24SpInfos) {
    const page: Page = await browser.newPage();
    await page.goto(obj.url);
    const tempSpInfo: any = {};
    tempSpInfo["productId"] = 0;
    await getNutorition(page);
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
  console.log("getNutorition");
  const elemts = await page.$x(
    '//div[@class="supplement-facts-container"]/table'
  );
  const trList = await page.$$("table tr");
  const nutoritions = await getNutoritions();
};

const getNutoritions = async (trList: any) => {
  const nutoritions: { name: string; amount: string }[] = [];
  trList.map(async (tr: any) => {
    const trValue = await tr.getProperty("textContent");
    const content: string = await trValue.jsonValue();
    //空白を消去して１行に
    const replaceText = content.replace(/\s+/g, "");
    //mgやgの表記がないものは省く
    if (
      replaceText.match(/\d{1,}(mg|g)/g) &&
      !replaceText.match(/\D{1,}(オメガ3|omega3|オメガ３)/g)
    ) {
      const name = replaceText.match(/[^\d{1,}(mg|g)]{1,}/g)?.[0];
      const amount = replaceText.match(/\d{1,}(mg|g)/g)?.[0];
      const nutorition: { name: string; amount: string } = {
        name: name ? name : "Not Found",
        amount: amount ? amount : "Not Found"
      };
      nutoritions.push(nutorition);
      console.log(replaceText.match(/[^\d{1,}(mg|g)]{1,}/g)?.[0]);
      console.log(replaceText.match(/\d{1,}(mg|g)/g)?.[0]);
    } else if (replaceText.match(/\D{1,}(オメガ3|omega3|オメガ３)/g)) {
      const name = replaceText.match(
        /\D{1,}(オメガ3|omega3|オメガ３)\D{0,}/g
      )?.[0];
      const amount = replaceText.match(
        /[^(オメガ3|omega3|オメガ３)\D{0,}]\d{1,}(mg|g)/g
      )?.[0];
      const nutorition: { name: string; amount: string } = {
        name: name ? name : "Not Found",
        amount: amount ? amount : "Not Found"
      };
      nutoritions.push(nutorition);
      console.log("omega3-----");
      console.log(
        replaceText.match(/\D{1,}(オメガ3|omega3|オメガ３)\D{0,}/g)?.[0]
      );
      console.log(
        replaceText.match(
          /[^(オメガ3|omega3|オメガ３)\D{0,}]\d{1,}(mg|g)/g
        )?.[0]
      );
      return nutoritions;
    }
  });
  return nutoritions;
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
