import {
  ArrayCstChildren,
  CharCstChildren,
  EscapeCstChildren,
  FunctionArgCstChildren,
  FunctionCallCstChildren,
  ICstNodeVisitor,
  MarkinCstChildren,
} from "./cst";
import { parser } from "./main";
import { MarkInParser } from "./parser";

export class MarkInVisitor
  extends parser.getBaseCstVisitorConstructor()
  implements ICstNodeVisitor<null, null>
{
  constructor() {
    super();
    this.validateVisitor();
  }
  markin(children: MarkinCstChildren, param?: null | undefined): null {
    throw new Error("Method not implemented.");
  }
  functionCall(
    children: FunctionCallCstChildren,
    param?: null | undefined
  ): null {
    throw new Error("Method not implemented.");
  }
  array(children: ArrayCstChildren, param?: null | undefined): null {
    throw new Error("Method not implemented.");
  }
  char(children: CharCstChildren, param?: null | undefined): null {
    throw new Error("Method not implemented.");
  }
  escape(children: EscapeCstChildren, param?: null | undefined): null {
    throw new Error("Method not implemented.");
  }
  functionArg(
    children: FunctionArgCstChildren,
    param?: null | undefined
  ): null {
    throw new Error("Method not implemented.");
  }
}
