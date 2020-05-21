import { Page } from "puppeteer";
import { getCapsuleType, getAmount, getUnit } from "./utility";
import { SupplementDetail, Xpaths } from "../types/crawling/crawling";

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
];

const getSpDetail = async (page: Page, url: string) => {
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
  tempSpInfo["pricePerOne"] = pricePerOne ? pricePerOne : 0;
  tempSpInfo["capsuleType"] = getCapsuleType(url);
  tempSpInfo["productUrl"] = url;
  const spDetail: SupplementDetail = tempSpInfo;

  return spDetail;
};

export default getSpDetail;
