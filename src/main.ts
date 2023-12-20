import { MarkInParser, markinLexer } from "./parser";

// Library entry point
export const parser = new MarkInParser();

export function markinParse(input: string) {
  const lexingResult = markinLexer.tokenize(input);
  parser.input = lexingResult.tokens;

  const output = parser.markin();
  return {
    output,
    errors: {
      lexer: lexingResult.errors,
      parser: parser.errors,
    },
  };
}
