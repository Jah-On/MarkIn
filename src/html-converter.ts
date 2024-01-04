// import { asciimath } from "./ASCIIMathML";
import {
	ArrayCstChildren,
	AsciimathCstChildren,
	CharCstChildren,
	CharCstNode,
	EscapeCstChildren,
	FunctionArgCstChildren,
	FunctionArgCstNode,
	FunctionArgPartCstChildren,
	FunctionCallCstChildren,
	ICstNodeVisitor,
	MarkinCstChildren,
} from "./cst";
import { createNode } from "./dom-utils";
import { FunctionArgumentType, tokenToFunction } from "./htmlConstructors";
import { parser } from "./main";
import * as AMML from "./ASCIIMathML";

let asciimath = new AMML.AsciiMath();

function assert(condition: any, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

type Result<T, E> = Ok<T, E> | Err<T, E>;
class Ok<T, E> {
	constructor(public readonly value: T) {}
	isOk(): this is Ok<T, E> {
		return true;
	}
	isErr(): this is Err<T, E> {
		return false;
	}
	then<U>(callback: (value: T) => Result<U, E>): Result<U, E> {
		return callback(this.value);
	}
	mapError<U>(_callback: (error: E) => U): Result<T, U> {
		return new Ok(this.value);
	}
	static allOk<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
		let values: T[] = [];
		let errors: E[] = [];
		for (let result of results) {
			if (result.isOk()) {
				values.push(result.value);
			} else {
				errors.push(result.error);
			}
		}
		if (errors.length > 0) {
			return new Err(errors);
		} else {
			return new Ok(values);
		}
	}
}
class Err<T, E> {
	constructor(public readonly error: E) {}
	isOk(): this is Ok<T, E> {
		return false;
	}
	isErr(): this is Err<T, E> {
		return true;
	}
	then<U>(_callback: (value: T) => Result<U, E>): Result<U, E> {
		return new Err(this.error);
	}
	mapError<U>(callback: (error: E) => U): Result<T, U> {
		return new Err(callback(this.error));
	}
}

const BaseClass = parser.getBaseCstVisitorConstructor<null, Element>();
export class MarkInVisitor
	extends BaseClass
	implements ICstNodeVisitor<null, Element>
{
	constructor() {
		super();
		this.validateVisitor();
	}

	markin(children: MarkinCstChildren, _param?: null | undefined): Element {
		// assert(
		//   children.functionArg.length === 1,
		//   "Expected 1 function arg at root"
		// );
		let ret
		if (children.functionArg){
			ret = this.visit(children.functionArg[0]);
		}
		assert(ret, "Expected return value");
		return ret;
	}

	asciimath(children: AsciimathCstChildren): Element {
		let cleaned = children.AsciiMathToken[0].image.slice(1, -1);
		console.log(cleaned);
		return asciimath.parseMath(cleaned);
	}
	functionCall(
		children: FunctionCallCstChildren,
		_param?: null | undefined
	): Element {
		assert(children.Function.length === 1, "Expected Function");
		const functionName = children.Function[0].image.replace(/\[$/, "");
		const myFunction = tokenToFunction.get(functionName);
		if (!myFunction) {
			// TODO: Print contents
			return createErrorElement("Unknown function: " + functionName);
		}
		const functionArg = children.functionArg;
		if (!functionArg) {
			return createErrorElement("Expected function args for " + functionName);
		}
		if (functionArg.length !== myFunction.args.length) {
			return createErrorElement(
				"Expected " + myFunction.args.length + " args for " + functionName
			);
		}
		const myFunctionArgs = Ok.allOk(
			myFunction.args.map((argType, i) =>
				this.parseFunctionArg(argType, functionArg[i])
			)
		);
		if (myFunctionArgs.isErr()) {
			return createErrorElement(
				"Error in args for " + functionName + ": " + myFunctionArgs.error
			);
		} else {
			return myFunction.callback(...myFunctionArgs.value);
		}
	}
	private parseFunctionArgString(arg: FunctionArgCstNode) : Result<string, string[]> {
		assert(arg.children.functionArgPart, "Expected char");
		return Ok.allOk(
			arg.children.functionArgPart.map((part) => {
				if (part.children.char) {
					return new Ok<string, string>(
						charNodesToString(part.children.char)
					);
				} else {
					return new Err("Expected char");
				}
			})
		).then((values) => new Ok(values.join("")));
	}
	private parseFunctionArg(argType: FunctionArgumentType, arg: FunctionArgCstNode) : Result<any, string[]> {
		if (argType.t === "string") {
			return this.parseFunctionArgString(arg);
		} else if (argType.t === "number") {
			return this.parseFunctionArgString(arg).then((value) => {
				if (isNaN(Number(value))) {
					return new Err(["Expected number"]);
				} else {
					return new Ok(Number(value));
				}
			});
		} else if (argType.t === "boolean") {
			return this.parseFunctionArgString(arg).then((value) => {
				if (value === "true") {
					return new Ok(true);
				} else if (value === "false") {
					return new Ok(false);
				} else {
					return new Err(["Expected boolean"]);
				}
			});
		} else if (argType.t === "element") {
			return new Ok(this.visit(arg));
		} else if (argType.t === "array") {
			assert(arg.children.functionArgPart, "Expected array");
			assert(arg.children.functionArgPart.length === 1, "Expected 1 arg");
			const arrayArg = arg.children.functionArgPart[0];
			assert(arrayArg.children.array, "Expected array");
			assert(arrayArg.children.array.length === 1, "Expected 1 array");
			const arrayChildren = arrayArg.children.array[0].children;
			assert(arrayChildren.functionArg, "Expected array contents");
			const arrayContents = arrayChildren.functionArg;
			return Ok.allOk(
				arrayContents.map((arrayContent) =>
					this.parseFunctionArg(argType.v, arrayContent)
				)
			).mapError((errors) => {
				return errors.flat();
			});
		} else {
			return new Err(["Unknown arg type" + argType.t]);
		}
	}
	array(children: ArrayCstChildren, _param?: null | undefined): Element {
		// TODO: Print array contents
		console.log(children);
		return createErrorElement("Array needs to be handled by function call");
	}
	char(children: CharCstChildren, _param?: null | undefined): Element {
		return createNode("span", {}, [charChildrenToString(children)]);
	}
	escape(children: EscapeCstChildren, _param?: null | undefined): Element {
		return createNode("span", { classList: ["escape"] }, [
			escapeChildrenToString(children),
		]);
	}
	functionArg(
		children: FunctionArgCstChildren,
		_param?: null | undefined
	): Element {
		let elements;
		if (children.functionArgPart) {
			elements = children.functionArgPart.map((part) => this.visit(part));
		}
		return createNode("span", {}, elements); // TODO: Make this a div? Sus
	}
	functionArgPart(
		children: FunctionArgPartCstChildren,
		_param?: null | undefined
	): Element {
		let childElements = [];
		if (children.asciimath) {
			childElements.push(this.visit(children.asciimath));
		}
		if (children.functionCall) {
			childElements.push(this.visit(children.functionCall));
		}
		if (children.array) {
			childElements.push(this.visit(children.array));
		}
		if (children.char) {
			childElements.push(this.visit(children.char));
		}
		return createNode("span", {}, childElements);
	}
}

function createErrorElement(message: string): HTMLElement {
	return createNode("span", { classList: ["error"] }, [message]);
}

function charNodesToString(charNodes: CharCstNode[]): string {
	return charNodes
		.map((node) => {
			return charChildrenToString(node.children);
		})
		.join("");
}

function charChildrenToString(charNode: CharCstChildren): string {
	if (charNode.escape) {
		assert(charNode.escape.length === 1, "Expected 1 escape");
		return escapeChildrenToString(charNode.escape[0].children);
	} else {
		assert(charNode.Any, "Expected Any");
		assert(charNode.Any.length === 1, "Expected 1 char");
		return charNode.Any[0].image;
	}
}
function escapeChildrenToString(escapeNode: EscapeCstChildren): string {
	assert(escapeNode.Any, "Expected Any");
	assert(escapeNode.Any.length === 1, "Expected 1 char");
	return escapeNode.Any[0].image;
}
