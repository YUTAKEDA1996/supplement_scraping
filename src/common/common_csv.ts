import * as fs from "fs";
import csvSync = require("csv-parse/lib/sync");

const readCsv = (fileName: string) => {
  const data = fs.readFileSync(fileName);
  const matrix = csvSync(data);
  return matrix;
};

export default readCsv;
