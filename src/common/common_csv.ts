import * as fs from "fs";
import csvSync = require("csv-parse/lib/sync");
import * as csv from "csv";

export const readCsv = (fileName: string) => {
  const data = fs.readFileSync(fileName);
  const matrix = csvSync(data);
  return matrix;
};

//"src/outputData/spInfo.csv"
export const write = (input: any[], fileName: string) => {
  if (readCsv(fileName)?.length > 0) {
    csv.stringify(input, { header: false }, function(err, output) {
      fs.appendFileSync(fileName, output);
    });
  } else {
    csv.stringify(input, { header: true }, function(err, output) {
      fs.writeFileSync(fileName, output);
    });
  }
};

export const overWrite = (input: any[], fileName: string) => {
  csv.stringify(input, { header: true }, function(err, output) {
    fs.writeFileSync(fileName, output);
  });
};

const isExistFile = (fileName: string) => {
  try {
    fs.statSync(fileName);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
  }
};

export const convertCSVtoArray = async (path: string) => {};

export default readCsv;
