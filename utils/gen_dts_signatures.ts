// @ts-ignore
import { writeFileSync } from "fs";
// @ts-ignore
import { resolve, dirname } from "path";
import { generateCstDts } from "chevrotain";
import { parser } from "../src/main.ts";
// @ts-ignore
import { fileURLToPath } from "url";

export function generateParserDts() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const dtsString = generateCstDts(parser.getGAstProductions());
  const dtsPath = resolve(__dirname, "..", "src", "cst.d.ts");
  writeFileSync(dtsPath, dtsString);
}
