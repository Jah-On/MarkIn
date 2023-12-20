import { MarkInVisitor } from "../html-converter";
import { markinParse } from "../main";

const demoInputElement = document.getElementById(
  "demo-input"
) as HTMLTextAreaElement;

const parserOutputElement = document.getElementById(
  "parser-output"
) as HTMLElement;

const demoInput = `
heading[1,aitalic[b]]
table[[[tic, tac, toe],[second row, a, b]]]
heading[1,This is a heading with bold[bold text]!]
`;

demoInputElement.value = demoInput;

const visitor = new MarkInVisitor();

function runParser() {
  const output = markinParse(demoInputElement.value);
  if (output.errors.lexer.length > 0) {
    console.error(output.errors.lexer);
  }
  if (output.errors.parser.length > 0) {
    console.error(output.errors.parser);
  }
  const html = visitor.visit(output.output);
  parserOutputElement.innerHTML = "";
  parserOutputElement.append(html);
}

demoInputElement.addEventListener("input", () => {
  runParser();
});
runParser();
