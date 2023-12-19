import { MarkInParser, markinLexer } from "../parser";

const demoInputElement = document.getElementById(
  "demo-input"
) as HTMLTextAreaElement;

const demoInput = `
heading[1,aitalics[b]]
table[[tic, tac, toe],[second row, a, b]]
heading[1,This is a heading with bold[bold text]!]
`;

demoInputElement.value = demoInput;
const parser = new MarkInParser();

function runParser() {
  const lexingResult = markinLexer.tokenize(demoInputElement.value);
  console.log(lexingResult);
  parser.input = lexingResult.tokens;
  const output = parser.markin();
  console.log(output);
}

demoInputElement.addEventListener("input", () => {
  runParser();
});
runParser();
