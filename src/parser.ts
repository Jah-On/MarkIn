import { createToken, Lexer, CstParser } from "chevrotain";
import escapeStringRegexp from "escape-string-regexp";
import { functions as functionNames } from "./MarkIn.ts";

const FunctionAndBracket = createToken({
  name: "Function",
  pattern: new RegExp(
    `(${functionNames.map((name) => escapeStringRegexp(name)).join("|")})\\[`
  ),
  line_breaks: false,
});

/**
 * https://unicode.org/reports/tr31/
 */
//pattern: { exec: matchFunction },
// function matchFunction(str: string, startOffset: number): any | null {
//   const value = str.substring(startOffset);
//   const match = /^\p{ID_Start}\p{ID_Continue}*\[/u.exec(value);
//   return match;
// }

const LSquareBracket = createToken({
  name: "LSquareBracket",
  pattern: /\[/,
});

const RSquareBracket = createToken({
  name: "RSquareBracket",
  pattern: /\]/,
});

const EscapeToken = createToken({
  name: "Escape",
  pattern: /\\/,
});

const CommaToken = createToken({
  name: "Comma",
  pattern: /,/,
});

const AsciiMathToken = createToken({
  name: "AsciiMathToken",
  pattern: /`.*`/,
});

const AnyToken = createToken({
  name: "Any",
  pattern: /[^a]|a/,
});

// Token order matters
const tokens = [
  AsciiMathToken,
  LSquareBracket,
  RSquareBracket,
  EscapeToken,
  CommaToken,
  FunctionAndBracket,
  AnyToken,
];
export const markinLexer = new Lexer(tokens);

export class MarkInParser extends CstParser {
  constructor() {
    super(tokens, {});
    this.performSelfAnalysis();
  }

  private asciimath = this.RULE("asciimath", () => {
    this.CONSUME(AsciiMathToken);
  });

  // Example https://github.com/Chevrotain/chevrotain/blob/master/examples/implementation_languages/typescript/typescript_json.ts
  public markin = this.RULE("markin", () => {
    this.OR([
      // { ALT: () => this.SUBRULE(this.asciimath) },
      { ALT: () => this.SUBRULE(this.functionArg) },
    ]);
  });

  private functionCall = this.RULE("functionCall", () => {
    this.CONSUME(FunctionAndBracket);
    this.MANY_SEP({
      SEP: CommaToken,
      DEF: () => {
        this.SUBRULE(this.functionArg);
      },
    });
    this.CONSUME(RSquareBracket);
  });

  private array = this.RULE("array", () => {
    this.CONSUME(LSquareBracket);
    this.MANY_SEP({
      SEP: CommaToken,
      DEF: () => {
        this.SUBRULE(this.functionArg);
      },
    });
    this.CONSUME(RSquareBracket);
  });

  private char = this.RULE("char", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.escape) },
      { ALT: () => this.CONSUME(AnyToken) },
    ]);
  });

  private escape = this.RULE("escape", () => {
    this.CONSUME(EscapeToken);
    this.CONSUME(AnyToken);
  });

  private functionArg = this.RULE("functionArg", () => {
    this.SUBRULE(this.functionArgPart);
    this.MANY(() => {
      this.SUBRULE1(this.functionArgPart);
    });
  });

  private functionArgPart = this.RULE("functionArgPart", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.asciimath) },
      { ALT: () => this.SUBRULE(this.functionCall) },
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.SUBRULE(this.char) },
    ]);
  });
}
