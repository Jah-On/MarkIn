import {
  ArrayCstChildren,
  CharCstChildren,
  EscapeCstChildren,
  FunctionArgCstChildren,
  FunctionArgPartCstChildren,
  FunctionCallCstChildren,
  ICstNodeVisitor,
  MarkinCstChildren,
} from "./cst";
import { parser } from "./main";
import { MarkInParser } from "./parser";

function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const BaseClass = parser.getBaseCstVisitorConstructor<null, HTMLElement>();
export class MarkInVisitor
  extends BaseClass
  implements ICstNodeVisitor<null, HTMLElement>
{
  constructor() {
    super();
    this.validateVisitor();
  }
  markin(children: MarkinCstChildren, param?: null | undefined): HTMLElement {
    assert(
      children.functionArg.length === 1,
      "Expected 1 function arg at root"
    );
    let functionArg = this.visit(children.functionArg[0]);
    return functionArg;
  }
  functionCall(
    children: FunctionCallCstChildren,
    param?: null | undefined
  ): HTMLElement {
    throw new Error("Method not implemented.");
  }
  array(children: ArrayCstChildren, param?: null | undefined): HTMLElement {
    throw new Error("Method not implemented.");
  }
  char(children: CharCstChildren, param?: null | undefined): HTMLElement {
    throw new Error("Method not implemented.");
  }
  escape(children: EscapeCstChildren, param?: null | undefined): HTMLElement {
    throw new Error("Method not implemented.");
  }
  functionArg(
    children: FunctionArgCstChildren,
    param?: null | undefined
  ): HTMLElement {
    let elements = children.functionArgPart.map((part) => this.visit(part));
    let elem = document.createElement("span"); // TODO: Make this a div? Sus
    elements.forEach((element) => elem.append(element));
    return elem;
  }
  functionArgPart(
    children: FunctionArgPartCstChildren,
    param?: null | undefined
  ): HTMLElement {
    throw new Error("Method not implemented.");
  }
}
