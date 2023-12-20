import { createNode } from "./dom-utils";

export const tokenToFunction = new Map<string, FunctionType>([
  _map("link", [{ t: "string" }], _link),
  _map("linked", [{ t: "string" }, { t: "element" }], _linked),
  _map("image", [{ t: "string" }, { t: "string" }], _image),
  _map("bold", [{ t: "element" }], _bold),
  _map("italic", [{ t: "element" }], _italic),
  _map("numbered", [{ t: "array", v: { t: "element" } }], _numbered),
  _map("bullet", [{ t: "array", v: { t: "element" } }], _bullet),
  _map("heading", [{ t: "number" }, { t: "element" }], _heading),
  _map("codeBlock", [{ t: "string" }], _codeBlock),
  _map("color", [{ t: "string" }, { t: "element" }], _color),
  _map(
    "table",
    [{ t: "array", v: { t: "array", v: { t: "element" } } }],
    _table
  ),
  _map("left", [{ t: "element" }], _left),
  _map("right", [{ t: "element" }], _right),
  _map("center", [{ t: "element" }], _center),
]);

// Sensible code
export type FunctionArgumentType =
  | { t: "string" }
  | { t: "number" }
  | { t: "boolean" }
  | { t: "element" }
  | { t: "array"; v: FunctionArgumentType }
  | { t: "object"; v: Record<string, FunctionArgumentType> };

type MapType<T extends FunctionArgumentType> = T extends { t: "string" }
  ? string
  : T extends { t: "number" }
  ? number
  : T extends { t: "boolean" }
  ? boolean
  : T extends { t: "element" }
  ? HTMLElement
  : T extends { t: "array" }
  ? Array<MapType<T["v"]>>
  : T extends { t: "object" }
  ? {
      [K in keyof T["v"]]: MapType<T["v"][K]>;
    }
  : never;

type MapTypes<T extends FunctionArgumentType[]> = {
  [K in keyof T]: MapType<T[K]>;
};

function _map<
  // TS needs the const, otherwise it collapses the tuple into an array
  const T extends FunctionArgumentType[],
  U extends (...args: MapTypes<T>) => HTMLElement
>(name: string, args: T, callback: U): [string, FunctionType] {
  return [
    name,
    {
      args,
      callback: (...args: any) => callback(...args),
    },
  ];
}

export type FunctionType = {
  args: FunctionArgumentType[];
  callback: (...args: any) => HTMLElement;
};
// End of entirely sensible and reasonable code

function _link(url: string) {
  return createNode("a", { href: url, classList: ["markin-link"] }, [url]);
}

function _linked(url: string, element: HTMLElement) {
  return createNode("a", { href: url, classList: ["markin-linked"] }, [
    element,
  ]);
}

function _image(alt: string, image: string) {
  return createNode(
    "img",
    { src: image, alt: alt, classList: ["markin-image"] },
    []
  );
}

function _bold(element: HTMLElement) {
  return createNode("strong", { classList: ["markin-bold"] }, [element]);
}

function _italic(element: HTMLElement) {
  return createNode("em", { classList: ["markin-italic"] }, [element]);
}

function _numbered(input: Array<HTMLElement>) {
  return createNode(
    "ol",
    { classList: ["markin-numbered"] },
    input.map((element) =>
      createNode("li", { classList: ["markin-numbered-item"] }, [element])
    )
  );
}

function _bullet(input: Array<HTMLElement>) {
  return createNode(
    "ul",
    { classList: ["markin-bullet"] },
    input.map((element) =>
      createNode("li", { classList: ["markin-bullet-item"] }, [element])
    )
  );
}

function _heading(size: number, element: HTMLElement) {
  return createNode(
    `h${size}` as any,
    { classList: [`markin-heading-${size}`] },
    [element]
  );
}

function _codeBlock(input: string) {
  return createNode("pre", { classList: ["markin-code-block"] }, [
    createNode("code", { classList: ["markin-code-block-code"] }, [input]),
  ]);
}

function _color(color: string, element: HTMLElement) {
  return createNode("span", { style: { color: color } }, [element]);
}

function _table(input: Array<Array<HTMLElement>>) {
  let returnElement = document.createElement("table");
  returnElement.className = "markin-table";
  for (const row of input) {
    let rowElement = document.createElement("tr");
    rowElement.className = "markin-row";
    for (const cell of row) {
      let cellElement = document.createElement("td");
      cellElement.className = "markin-cell";
      cellElement.appendChild(cell);
      rowElement.appendChild(cellElement);
    }
    returnElement.appendChild(rowElement);
  }
  return returnElement;
}

function _left(element: HTMLElement): HTMLElement {
  let returnElement;
  if (element.constructor.name == Text.name) {
    element.style.textAlign = "left";
    returnElement = element;
  } else {
    returnElement = document.createElement("div");
    element.style.marginLeft = "0";
    element.style.marginRight = "auto";
    returnElement.appendChild(element);
  }
  returnElement.className = "markin-left";
  return returnElement;
}

function _right(element: HTMLElement): HTMLElement {
  let returnElement;
  if (element.constructor.name == Text.name) {
    element.style.textAlign = "right";
    returnElement = element;
  } else {
    returnElement = document.createElement("div");
    element.style.marginLeft = "auto";
    element.style.marginRight = "0";
    returnElement.appendChild(element);
  }
  returnElement.className = "markin-right";
  return returnElement;
}

function _center(element: HTMLElement): HTMLElement {
  let returnElement;
  if (element.constructor.name == Text.name) {
    element.style.textAlign = "center";
    returnElement = element;
  } else {
    returnElement = document.createElement("div");
    element.style.marginLeft = "auto";
    element.style.marginRight = "auto";
    returnElement.appendChild(element);
  }
  returnElement.className = "markin-center";
  return returnElement;
}
