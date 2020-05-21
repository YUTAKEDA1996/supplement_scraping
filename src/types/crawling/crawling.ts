export type Top24Supplements = {
  category: string;
  productName: string;
  url: string;
  rating: number;
  raitingCount: number;
  price: number;
  capsuleType: string;
}[];

export type SupplementDetail = {
  productId: number;
  productName: string;
  amount: number;
  price: number;
  productImgUrl: string;
  productCode: string;
  rating: number;
  raitingCount: number;
  stokeStatus: boolean;
  brand: string;
  priceperOne: number;
  productUrl: string;
  unit: string;
  capsuleType: string;
};

export type SupplementNutorition = {
  nutritions: {
    nutoritionName: string;
    nutoritionAmount: string;
  }[];
  name: string;
  url: string;
  productId: number;
};

export type ExFormattNutorition = {
  nutoritionName: string;
  nutoritionAmount: string;
  name: string;
  url: string;
  productId: number;
}[];

export type SupplementInfo = {
  id: number;
  spDetail: SupplementDetail;
  spNutorition: SupplementNutorition;
};

export type Xpaths = {
  path: string;
  property: string;
  name:
    | "productId"
    | "productName"
    | "amount"
    | "price"
    | "productImgUrl"
    | "productCode"
    | "rating"
    | "raitingCount"
    | "stokeStatus"
    | "brand"
    | "priceperOne"
    | "productUrl"
    | "unit"
    | "capsuleType";
  arrayIndex: number;
  typeInfo: "string" | "number" | "array";
}[];
