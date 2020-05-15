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
