export const tokenToFunction = new Map<string, Function>([
    ["table", _table], ["left", _left], ["right", _right], ["image", _image], ["link", _link], 
    ["linked", _linked], ["bold", _bold], ["italic", _italic], ["numbered", _numbered], 
    ["bullet", _bullet], ["code-block", _codeBlock], ["heading", _heading], ["color", _color]
]);

function _link(url: string){
    let elem       = document.createElement("a");
    elem.className = "markin-link";
    elem.href      = url;
    elem.innerText = url;
    return elem;
}

function _linked(url:string, element: HTMLElement){
    let elem       = document.createElement("a");
    elem.className = "markin-linked";
    elem.href      = url;
    elem.appendChild(element);
    return elem;
}

function _image(alt: string, image: string){
    let elem       = document.createElement("img");
    elem.className = "markin-image";
    elem.src       = image;
    elem.alt       = alt;
    return elem;
}

function _bold(element: HTMLElement){
    let elem       = document.createElement("strong");
    elem.className = "markin-bold";
    elem.appendChild(element);
    return elem;
}

function _italic(element: HTMLElement){
    let elem       = document.createElement("em");
    elem.className = "markin-italic";
    elem.appendChild(element);
    return elem;
}

function _numbered(input: Array<HTMLElement>){
    let returnElement       = document.createElement("ol");
    returnElement.className = "markin-numbered";
    for (const element of input){
        let elem       = document.createElement("li");
        elem.className = "markin-numbered-item";
        elem.appendChild(element);
        returnElement.appendChild(elem);
    }
    return returnElement;
}

function _bullet(input: Array<HTMLElement>){
    let returnElement       = document.createElement("ul");
    returnElement.className = "markin-bullet";
    for (const element of input){
        let elem       = document.createElement("li");
        elem.className = "markin-bullet-item";
        elem.appendChild(element);
        returnElement.appendChild(elem);
    }
    return returnElement;
}

function _heading(size: number, element: HTMLElement){
    let elem  = document.createElement(`h${size}`);
    elem.className = `markin-heading-${size}`;
    elem.appendChild(element);
    return elem;
}

function _codeBlock(){
    let elem       = document.createElement("pre");
    // elem.className = "markin-code-block";
    // elem.innerText = input;
    return elem;
}

function _color(color: string, element: HTMLElement){
    let elem       = document.createElement("span");
    elem.className = "markin-color";
    elem.style.color = color;
    elem.appendChild(element);
    return elem;
}

function _table(input: Array<Array<HTMLElement>>){
    let returnElement       = document.createElement("table");
    returnElement.className = "markin-table";
    for (const row of input){
        let rowElement       = document.createElement("tr");
        rowElement.className = "markin-row";
        for (const cell of row){
            let cellElement       = document.createElement("td");
            cellElement.className = "markin-cell";
            cellElement.appendChild(cell);
            rowElement.appendChild(cellElement);
        }
        returnElement.appendChild(rowElement);
    }
    return returnElement;
}

function _left(element: HTMLElement) : HTMLElement {
    let returnElement;
    if (element.constructor.name == Text.name){
        element.style.textAlign = "left";
        returnElement           = element;
    } else {
        returnElement             = document.createElement("div");
        element.style.marginLeft  = "0";
        element.style.marginRight = "auto";
        returnElement.appendChild(element);
    }
    returnElement.className = "markin-left";
    return returnElement;
}

function _right(element: HTMLElement) : HTMLElement {
    let returnElement;
    if (element.constructor.name == Text.name){
        element.style.textAlign = "right";
        returnElement           = element;
    } else {
        returnElement             = document.createElement("div");
        element.style.marginLeft  = "auto";
        element.style.marginRight = "0";
        returnElement.appendChild(element);
    }
    returnElement.className = "markin-right";
    return returnElement;
}

function _center(element: HTMLElement) : HTMLElement {
    let returnElement;
    if (element.constructor.name == Text.name){
        element.style.textAlign = "center";
        returnElement           = element;
    } else {
        returnElement             = document.createElement("div");
        element.style.marginLeft  = "auto";
        element.style.marginRight = "auto";
        returnElement.appendChild(element);
    }
    returnElement.className = "markin-center";
    return returnElement;
}

