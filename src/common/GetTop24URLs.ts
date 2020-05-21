import puppeteer, { Page } from "puppeteer";
import { Top24Supplements } from "../types/crawling/crawling";
import { getCapsuleType } from "../common/utility";
import { stringify } from "querystring";

const getTop24URLs = async (nutorition: string): Promise<Top24Supplements> => {
  //空白をURL用にencode
  const encodeNutorition = nutorition.replace(/ /g, "%20");
  const url =
    "https://jp.iherb.com/search?kw=" + encodeNutorition + "&noi=24&cids=1855";
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url);
  const links = '//a[@class="absolute-link product-link"]';

  const elemts: any = await page.$x(links);
  const top24Supplement: Top24Supplements = [];
  await Promise.all(
    elemts.map(async (i: any) => {
      const handleURL = await i.getProperty("href");
      const handleTitle = await i.getProperty("title");
      const url: string = await handleURL.jsonValue();
      const title: string = await handleTitle.jsonValue();
      const itemId = getItemId(url);
      const ratingInfo: {
        rating: number;
        ratingCount: number;
      } = await getRating(String(itemId), page);
      const price: number = await getPrice(Number(itemId), page);
      top24Supplement.push({
        category: nutorition,
        productName: title,
        url: url,
        rating: ratingInfo.rating,
        raitingCount: ratingInfo.ratingCount,
        price: price,
        capsuleType: getCapsuleType(url)
      });
      return true;
    })
  );
  await browser.close();
  return top24Supplement;
};

const getRating = async (
  itemId: string,
  page: Page
): Promise<{ rating: number; ratingCount: number }> => {
  const productCode = "pid_" + String(itemId);
  const ratingValuePath =
    '//div[@id="' +
    productCode +
    '"]/div[@class="product-inner product-inner-wide"]/div[@itemprop="aggregateRating"]/meta[@itemprop="ratingValue"]';
  const ratingCountPath =
    '//div[@id="' +
    productCode +
    '"]/div[@class="product-inner product-inner-wide"]/div[@itemprop="aggregateRating"]/meta[@itemprop="ratingCount"]';
  const ratingValueElement: puppeteer.ElementHandle<Element>[] = await page.$x(
    ratingValuePath
  );

  const ratingCountElement: puppeteer.ElementHandle<Element>[] = await page.$x(
    ratingCountPath
  );
  const handleRatingValue = await ratingValueElement?.[0]?.getProperty(
    "content"
  );
  const handleRatingCount = await ratingCountElement?.[0]?.getProperty(
    "content"
  );

  const ratingValue = await handleRatingValue?.jsonValue();
  const ratingCount = await handleRatingCount?.jsonValue();

  return { rating: Number(ratingValue), ratingCount: Number(ratingCount) };
};

const getPrice = async (itemId: number, page: Page): Promise<number> => {
  const productCode = "pid_" + String(itemId);
  const pricePath =
    '//div[@id="' +
    productCode +
    '"]/div[@class="product-inner product-inner-wide"]/div[@itemprop="offers"]/meta[@itemprop="price"]';
  const priceElement: puppeteer.ElementHandle<Element>[] = await page.$x(
    pricePath
  );
  const handlePrice = await priceElement?.[0]?.getProperty("content");
  const price = await handlePrice?.jsonValue();
  return Number(price ? price : 0);
};

const getItemId = (url: string) => {
  const numbers = url.match(/[\d]{1,}/g);
  const itemId = numbers ? numbers[numbers?.length - 1] : 0;
  return itemId;
};

export default getTop24URLs;
