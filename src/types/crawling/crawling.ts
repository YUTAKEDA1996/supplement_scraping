export type Top24Supplements = {
  category: string;
  productName: string;
  url: string;
}[];

export type SupplementDetail = {
  productId: number;
  productName: string;
  amount: number;
  price: number;
  priceperOne: number;
  productUrl: string;
  productCode: string;
  rating: number;
  raitingCount: number;
  productImgUrl: string;
  isStoke: boolean;
};

export type SupplementNutorition = {
  nutritions: {
    nutoritionName: string;
    nutoritionAmount: string;
    NutoritionPer: string;
  }[];
  name: string;
  productId: number;
};

export type SupplementInfo = {
  id: number;
  spDetail: SupplementDetail;
  spNutorition: SupplementNutorition;
};

export type Xpaths = {
  path: string;
  property: string;
  name: string;
  arrayIndex: number;
}[];
