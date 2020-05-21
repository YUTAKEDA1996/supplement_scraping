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
      const handleId = await i.getProperty("daria-label");
      const url: string = await handleURL.jsonValue();
      const title: string = await handleTitle.jsonValue();
      const itemId: string = await handleId.jsonValue();
      const ratingInfo: {
        rating: number;
        ratingCount: number;
      } = await getRating(itemId, page);
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
    '"]/div[@itemprop="aggregateRating"]/meta[@itemprop="ratingValue"]';
  const ratingCountPath =
    '//div[@id="' +
    productCode +
    '"]/div[@itemprop="aggregateRating"]/meta[@itemprop="ratingCount"]';
  const ratingValueElement: puppeteer.ElementHandle<Element>[] = await page.$x(
    ratingValuePath
  );
  const ratingCountElement: puppeteer.ElementHandle<Element>[] = await page.$x(
    ratingCountPath
  );

  const handleRatingValue = await ratingValueElement?.[0]?.getProperty(
    "itemprop"
  );
  const handleRatingCount = await ratingCountElement?.[0]?.getProperty(
    "itemprop"
  );
  const ratingValue = await handleRatingValue?.jsonValue();
  const ratingCount = await handleRatingCount?.jsonValue();

  return { rating: Number(0), ratingCount: Number(0) };
};

const getPrice = async (itemId: number, page: Page) => {
  return 100;
};

export default getTop24URLs;
