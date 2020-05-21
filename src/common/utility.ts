import {
  SupplementInfo,
  SupplementDetail,
  SupplementNutorition,
  Top24Supplements,
  ExFormattNutorition
} from "../types/crawling/crawling";
import { write, readCsv } from "../common/common_csv";

export const sleep = (milliSeconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

export const getCapsuleType = (productURL: string): string => {
  if (productURL.match(/soft/gi)) {
    return "Softgels";
  } else if (productURL.match(/capsules/gi)) {
    return "Capsules";
  } else if (productURL.match(/tablets/gi)) {
    return "Tablets";
  }
  return "Not Found";
};

export const getAmount = (amountString: string): number => {
  const amount = amountString.match(/\d+/g)?.[0];
  return amount ? Number(amount) : 0;
};

export const getUnit = (amountString: string): string => {
  const unit = amountString.match(/\D+/g)?.[1];
  return unit ? unit : "Not Found";
};

export const deduplication = async (
  top24Supplements: Top24Supplements,
  fileName: string
): Promise<Top24Supplements> => {
  try {
    const existURLs: Top24Supplements = readCsv(fileName);
    const uniqueUrls: Top24Supplements = [];
    top24Supplements.map(c => {
      if (
        existURLs.filter(e => {
          return String(e).match(c.url);
        }).length === 0
      ) {
        uniqueUrls.push(c);
      }
    });
    return uniqueUrls;
  } catch (e) {
    console.log("Top24Supplementsの形が違う可能性があります！");
    return top24Supplements;
  }
};

export const getExFormattNutorition = (
  spNutoritions: SupplementNutorition[]
): ExFormattNutorition => {
  const exportFormatNutorition: ExFormattNutorition = [];
  spNutoritions.map(sp => {
    sp.nutritions.map(c => {
      exportFormatNutorition.push({
        productId: sp.productId,
        name: sp.name,
        url: sp.url,
        nutoritionName: c.nutoritionName,
        nutoritionAmount: c.nutoritionAmount
      });
    });
  });
  return exportFormatNutorition;
};
