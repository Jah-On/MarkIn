const tokens = new Map([
    ["table", 1], ["row", 1], ["cell", 1], ["left", 1], ["right", 1],
    ["image", 2], ["link", 1], ["linked", 2], ["bold", 1], ["italic", 1], 
    ["numbered", 1], ["bullet", 1], ["code-block", 1], ["heading", 2],
    ["color", 2]
]);

export const functions = tokens.keys();

const tokenToFunction = new Map([
    ["table", _table], ["row", _row], ["cell", _cell], ["left", _left], ["right", _right],
    ["image", _image], ["link", _link], ["linkedText", _linkedText], ["bold", _bold], ["italic", _italic], 
    ["numbered", _numbered], ["bullet", _bullet], ["code-block", _codeBlock], ["heading", _heading],
    ["color", _color]
]);

export function asDOM(input=""){
    let fragment = document.createDocumentFragment();

    let lines = sanitize(input).split("\n");
    for (const line of lines){
        switch (line) {
            case "":
                fragment.appendChild(document.createElement("br"));
                break;
            default:
                // fragment.appendChild();
                break;
        }
    }
}

// export function asHTML(input=""){
// }

function sanitize(input=""){
    let output = input;
    output = output.replace("\t", "");

    return output;
}

function parse(input=""){

}

function _link(url=""){
    let elem       = document.createElement("a");
    elem.className = "markin-link";
    elem.href      = url;
    elem.innerText = url;
    return elem;
}

function _linked(url, element){
    let elem       = document.createElement("a");
    elem.className = "markin-linked";
    elem.href      = url;
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _image(alt, image){
    let elem       = document.createElement("img");
    elem.className = "markin-image";
    elem.src       = image;
    elem.alt       = alt;
    return elem;
}

function _bold(element){
    let elem       = document.createElement("strong");
    elem.className = "markin-bold";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _italic(element){
    let elem       = document.createElement("em");
    elem.className = "markin-italic";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _numbered(element){
    let elem       = document.createElement("ol");
    elem.className = "markin-numbered";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _bullet(element){
    let elem       = document.createElement("ul");
    elem.className = "markin-bullet";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _heading(size, element){
    let elem  = document.createElement(`h${size}`);
    elem.className = `markin-heading-${size}`;
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _codeBlock(){
    let elem       = document.createElement("pre");
    elem.className = "markin-code-block";
    elem.innerText = input;
    return elem;
}

function _color(color="", element){
    let elem       = document.createElement("span");
    elem.className = "markin-color";
    elem.style.color = color;
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _table(element){
    let elem       = document.createElement("table");
    elem.className = "markin-table";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _row(element){
    let elem       = document.createElement("tr");
    elem.className = "markin-row";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _cell(element){
    let elem       = document.createElement("td");
    elem.className = "markin-cell";
    if (element instanceof HTMLElement){
        elem.appendChild(element);
    } else {
        elem.innerText = element;
    }
    return elem;
}

function _left(element){
    let elem;
    if (element instanceof HTMLElement){
        elem = document.createElement("div");
        element.style.marginLeft = "0";
        element.style.marginRight = "auto";
        elem.appendChild(element);
    } else {
        elem = document.createElement("div");
        elem.style.textAlign = "left";
        elem.innerText = element;
    }
    elem.className = "markin-left";
    return elem;
}

function _right(element){
    let elem;
    if (element instanceof HTMLElement){
        elem = document.createElement("div");
        element.style.marginLeft = "auto";
        element.style.marginRight = "0";
        elem.appendChild(element);
    } else {
        elem = document.createElement("div");
        elem.style.textAlign = "right";
        elem.innerText = element;
    }
    elem.className = "markin-right";
    return elem;
}

function _center(element){
    let elem;
    if (element instanceof HTMLElement){
        elem = document.createElement("div");
        element.style.marginLeft = "auto";
        element.style.marginRight = "auto";
        elem.appendChild(element);
    } else {
        elem = document.createElement("div");
        elem.style.textAlign = "center";
        elem.innerText = element;
    }
    elem.className = "markin-center";
    return elem;
}

