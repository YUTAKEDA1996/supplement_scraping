import { Page } from "puppeteer";
import { SupplementNutorition } from "../types/crawling/crawling";

const getNutoritions = async (
  page: Page,
  name: string,
  url: string
): Promise<SupplementNutorition> => {
  const elemts = await page.$x(
    '//div[@class="supplement-facts-container"]/table'
  );
  const trList = await page.$$("table tr");
  const nutritions = await parseTabeleNutoritions(trList);
  return { name, url, nutritions, productId: 0 };
};

const parseTabeleNutoritions = async (
  trList: any
): Promise<SupplementNutorition["nutritions"]> => {
  const nutoritions: SupplementNutorition["nutritions"] = [];
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
      const nutorition: {
        nutoritionName: string;
        nutoritionAmount: string;
      } = {
        nutoritionName: name ? name : "Not Found",
        nutoritionAmount: amount ? amount : "Not Found"
      };
      nutoritions.push(nutorition);
    } else if (replaceText.match(/\D{1,}(オメガ3|omega3|オメガ３)/g)) {
      const name = replaceText.match(
        /\D{1,}(オメガ3|omega3|オメガ３)\D{0,}/g
      )?.[0];
      const amount = replaceText.match(
        /[^(オメガ3|omega3|オメガ３)\D{0,}]\d{1,}(mg|g)/g
      )?.[0];
      const nutorition: { nutoritionName: string; nutoritionAmount: string } = {
        nutoritionName: name ? name : "Not Found",
        nutoritionAmount: amount ? amount : "Not Found"
      };
      nutoritions.push(nutorition);
    }
  });
  return nutoritions;
};

export default getNutoritions;
