import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface AsciimathCstNode extends CstNode {
  name: "asciimath";
  children: AsciimathCstChildren;
}

export type AsciimathCstChildren = {
  AsciiMathToken: IToken[];
};

export interface MarkinCstNode extends CstNode {
  name: "markin";
  children: MarkinCstChildren;
}

export type MarkinCstChildren = {
  functionArg?: FunctionArgCstNode[];
};

export interface FunctionCallCstNode extends CstNode {
  name: "functionCall";
  children: FunctionCallCstChildren;
}

export type FunctionCallCstChildren = {
  Function: IToken[];
  functionArg?: FunctionArgCstNode[];
  Comma?: IToken[];
  RSquareBracket: IToken[];
};

export interface ArrayCstNode extends CstNode {
  name: "array";
  children: ArrayCstChildren;
}

export type ArrayCstChildren = {
  LSquareBracket: IToken[];
  functionArg?: FunctionArgCstNode[];
  Comma?: IToken[];
  RSquareBracket: IToken[];
};

export interface CharCstNode extends CstNode {
  name: "char";
  children: CharCstChildren;
}

export type CharCstChildren = {
  escape?: EscapeCstNode[];
  Any?: IToken[];
};

export interface EscapeCstNode extends CstNode {
  name: "escape";
  children: EscapeCstChildren;
}

export type EscapeCstChildren = {
  Escape: IToken[];
  Any: IToken[];
};

export interface FunctionArgCstNode extends CstNode {
  name: "functionArg";
  children: FunctionArgCstChildren;
}

export type FunctionArgCstChildren = {
  functionArgPart: (FunctionArgPartCstNode)[];
};

export interface FunctionArgPartCstNode extends CstNode {
  name: "functionArgPart";
  children: FunctionArgPartCstChildren;
}

export type FunctionArgPartCstChildren = {
  asciimath?: AsciimathCstNode[];
  functionCall?: FunctionCallCstNode[];
  array?: ArrayCstNode[];
  char?: CharCstNode[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  asciimath(children: AsciimathCstChildren, param?: IN): OUT;
  markin(children: MarkinCstChildren, param?: IN): OUT;
  functionCall(children: FunctionCallCstChildren, param?: IN): OUT;
  array(children: ArrayCstChildren, param?: IN): OUT;
  char(children: CharCstChildren, param?: IN): OUT;
  escape(children: EscapeCstChildren, param?: IN): OUT;
  functionArg(children: FunctionArgCstChildren, param?: IN): OUT;
  functionArgPart(children: FunctionArgPartCstChildren, param?: IN): OUT;
}
