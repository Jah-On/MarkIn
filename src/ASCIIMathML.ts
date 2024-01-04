/*
ASCIIMathML.js
==============
This file contains JavaScript functions to convert ASCII math notation
and (some) LaTeX to Presentation MathML. The conversion is done while the
HTML page loads, and should work with Firefox and other browsers that can
render MathML.

Just add the next line to your HTML page with this file in the same folder:

<script type="text/javascript" src="ASCIIMathML.js"></script>

Version 2.2 Mar 3, 2014.
Latest version at https://github.com/mathjax/asciimathml
If you use it on a webpage, please send the URL to jipsen@chapman.edu

Copyright (c) 2014 Peter Jipsen and other ASCIIMathML.js contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const AMmathml = "http://www.w3.org/1998/Math/MathML";

const mathcolor = "";        // change it to "" (to inherit) or another color
const mathfontsize = "1em";      // change to e.g. 1.2em for larger math
const mathfontfamily = "serif";  // change to "" to inherit (works in IE)
                               // or another family (e.g. "arial")
const checkForMathML = true;     // check if browser can display MathML
const translateASCIIMath = true; // false to preserve `..`
const displaystyle = true;      // puts limits above and below large operators
const showasciiformulaonhover = true; // helps students learn ASCIIMath
const decimalsign = ".";        // if "," then when writing lists or matrices put
			      //a space after the "," like `(1, 2)` not `(1,2)`
const AMdelimiter1 = "`", AMescape1 = "\\\\`"; // can use other characters
const AMdocumentId = "wikitext" // PmWiki element containing math (default=body)
const fixphi = true;  		//false to return to legacy phi/varphi mapping

const enum TYPE {
  CONST, UNARY, BINARY, INFIX, LEFTBRACKET, RIGHTBRACKET, SPACE, UNDEROVER,
  DEFINITION, LEFTRIGHT, UNARYUNDEROVER, TEXT
}

const AMcal = ["\uD835\uDC9C","\u212C","\uD835\uDC9E","\uD835\uDC9F","\u2130","\u2131","\uD835\uDCA2","\u210B","\u2110","\uD835\uDCA5","\uD835\uDCA6","\u2112","\u2133","\uD835\uDCA9","\uD835\uDCAA","\uD835\uDCAB","\uD835\uDCAC","\u211B","\uD835\uDCAE","\uD835\uDCAF","\uD835\uDCB0","\uD835\uDCB1","\uD835\uDCB2","\uD835\uDCB3","\uD835\uDCB4","\uD835\uDCB5","\uD835\uDCB6","\uD835\uDCB7","\uD835\uDCB8","\uD835\uDCB9","\u212F","\uD835\uDCBB","\u210A","\uD835\uDCBD","\uD835\uDCBE","\uD835\uDCBF","\uD835\uDCC0","\uD835\uDCC1","\uD835\uDCC2","\uD835\uDCC3","\u2134","\uD835\uDCC5","\uD835\uDCC6","\uD835\uDCC7","\uD835\uDCC8","\uD835\uDCC9","\uD835\uDCCA","\uD835\uDCCB","\uD835\uDCCC","\uD835\uDCCD","\uD835\uDCCE","\uD835\uDCCF"];

const AMfrk = ["\uD835\uDD04","\uD835\uDD05","\u212D","\uD835\uDD07","\uD835\uDD08","\uD835\uDD09","\uD835\uDD0A","\u210C","\u2111","\uD835\uDD0D","\uD835\uDD0E","\uD835\uDD0F","\uD835\uDD10","\uD835\uDD11","\uD835\uDD12","\uD835\uDD13","\uD835\uDD14","\u211C","\uD835\uDD16","\uD835\uDD17","\uD835\uDD18","\uD835\uDD19","\uD835\uDD1A","\uD835\uDD1B","\uD835\uDD1C","\u2128","\uD835\uDD1E","\uD835\uDD1F","\uD835\uDD20","\uD835\uDD21","\uD835\uDD22","\uD835\uDD23","\uD835\uDD24","\uD835\uDD25","\uD835\uDD26","\uD835\uDD27","\uD835\uDD28","\uD835\uDD29","\uD835\uDD2A","\uD835\uDD2B","\uD835\uDD2C","\uD835\uDD2D","\uD835\uDD2E","\uD835\uDD2F","\uD835\uDD30","\uD835\uDD31","\uD835\uDD32","\uD835\uDD33","\uD835\uDD34","\uD835\uDD35","\uD835\uDD36","\uD835\uDD37"];

const AMbbb = ["\uD835\uDD38","\uD835\uDD39","\u2102","\uD835\uDD3B","\uD835\uDD3C","\uD835\uDD3D","\uD835\uDD3E","\u210D","\uD835\uDD40","\uD835\uDD41","\uD835\uDD42","\uD835\uDD43","\uD835\uDD44","\u2115","\uD835\uDD46","\u2119","\u211A","\u211D","\uD835\uDD4A","\uD835\uDD4B","\uD835\uDD4C","\uD835\uDD4D","\uD835\uDD4E","\uD835\uDD4F","\uD835\uDD50","\u2124","\uD835\uDD52","\uD835\uDD53","\uD835\uDD54","\uD835\uDD55","\uD835\uDD56","\uD835\uDD57","\uD835\uDD58","\uD835\uDD59","\uD835\uDD5A","\uD835\uDD5B","\uD835\uDD5C","\uD835\uDD5D","\uD835\uDD5E","\uD835\uDD5F","\uD835\uDD60","\uD835\uDD61","\uD835\uDD62","\uD835\uDD63","\uD835\uDD64","\uD835\uDD65","\uD835\uDD66","\uD835\uDD67","\uD835\uDD68","\uD835\uDD69","\uD835\uDD6A","\uD835\uDD6B"];

type AMsymbol = {
  input: string;
  tag: string;
  output: string;
  tex?: string | null;
  ttype: TYPE;
  invisible?: boolean;
  acc?: boolean;
  func?: boolean;
  rewriteleftright?: string[];
  codes?: string[];
  notexcopy?: boolean;
  atname?: string;
  atval?: string;
}

const AMsymbols: AMsymbol[] = [
  //some greek symbols
  {input:"alpha",  tag:"mi", output:"\u03B1", tex:null, ttype:TYPE.CONST},
  {input:"beta",   tag:"mi", output:"\u03B2", tex:null, ttype:TYPE.CONST},
  {input:"chi",    tag:"mi", output:"\u03C7", tex:null, ttype:TYPE.CONST},
  {input:"delta",  tag:"mi", output:"\u03B4", tex:null, ttype:TYPE.CONST},
  {input:"Delta",  tag:"mo", output:"\u0394", tex:null, ttype:TYPE.CONST},
  {input:"epsi",   tag:"mi", output:"\u03B5", tex:"epsilon", ttype:TYPE.CONST},
  {input:"varepsilon", tag:"mi", output:"\u025B", tex:null, ttype:TYPE.CONST},
  {input:"eta",    tag:"mi", output:"\u03B7", tex:null, ttype:TYPE.CONST},
  {input:"gamma",  tag:"mi", output:"\u03B3", tex:null, ttype:TYPE.CONST},
  {input:"Gamma",  tag:"mo", output:"\u0393", tex:null, ttype:TYPE.CONST},
  {input:"iota",   tag:"mi", output:"\u03B9", tex:null, ttype:TYPE.CONST},
  {input:"kappa",  tag:"mi", output:"\u03BA", tex:null, ttype:TYPE.CONST},
  {input:"lambda", tag:"mi", output:"\u03BB", tex:null, ttype:TYPE.CONST},
  {input:"Lambda", tag:"mo", output:"\u039B", tex:null, ttype:TYPE.CONST},
  {input:"lamda", tag:"mi", output:"\u03BB", tex:null, ttype:TYPE.CONST},
  {input:"Lamda", tag:"mo", output:"\u039B", tex:null, ttype:TYPE.CONST},
  {input:"mu",     tag:"mi", output:"\u03BC", tex:null, ttype:TYPE.CONST},
  {input:"nu",     tag:"mi", output:"\u03BD", tex:null, ttype:TYPE.CONST},
  {input:"omega",  tag:"mi", output:"\u03C9", tex:null, ttype:TYPE.CONST},
  {input:"Omega",  tag:"mo", output:"\u03A9", tex:null, ttype:TYPE.CONST},
  {input:"phi",    tag:"mi", output:fixphi?"\u03D5":"\u03C6", tex:null, ttype:TYPE.CONST},
  {input:"varphi", tag:"mi", output:fixphi?"\u03C6":"\u03D5", tex:null, ttype:TYPE.CONST},
  {input:"Phi",    tag:"mo", output:"\u03A6", tex:null, ttype:TYPE.CONST},
  {input:"pi",     tag:"mi", output:"\u03C0", tex:null, ttype:TYPE.CONST},
  {input:"Pi",     tag:"mo", output:"\u03A0", tex:null, ttype:TYPE.CONST},
  {input:"psi",    tag:"mi", output:"\u03C8", tex:null, ttype:TYPE.CONST},
  {input:"Psi",    tag:"mi", output:"\u03A8", tex:null, ttype:TYPE.CONST},
  {input:"rho",    tag:"mi", output:"\u03C1", tex:null, ttype:TYPE.CONST},
  {input:"sigma",  tag:"mi", output:"\u03C3", tex:null, ttype:TYPE.CONST},
  {input:"Sigma",  tag:"mo", output:"\u03A3", tex:null, ttype:TYPE.CONST},
  {input:"tau",    tag:"mi", output:"\u03C4", tex:null, ttype:TYPE.CONST},
  {input:"theta",  tag:"mi", output:"\u03B8", tex:null, ttype:TYPE.CONST},
  {input:"vartheta", tag:"mi", output:"\u03D1", tex:null, ttype:TYPE.CONST},
  {input:"Theta",  tag:"mo", output:"\u0398", tex:null, ttype:TYPE.CONST},
  {input:"upsilon", tag:"mi", output:"\u03C5", tex:null, ttype:TYPE.CONST},
  {input:"xi",     tag:"mi", output:"\u03BE", tex:null, ttype:TYPE.CONST},
  {input:"Xi",     tag:"mo", output:"\u039E", tex:null, ttype:TYPE.CONST},
  {input:"zeta",   tag:"mi", output:"\u03B6", tex:null, ttype:TYPE.CONST},
  
  //binary operation symbols
  //{input:"-",  tag:"mo", output:"\u0096", tex:null, ttype:TYPE.CONST},
  {input:"*",  tag:"mo", output:"\u22C5", tex:"cdot", ttype:TYPE.CONST},
  {input:"**", tag:"mo", output:"\u2217", tex:"ast", ttype:TYPE.CONST},
  {input:"***", tag:"mo", output:"\u22C6", tex:"star", ttype:TYPE.CONST},
  {input:"//", tag:"mo", output:"/",      tex:null, ttype:TYPE.CONST},
  {input:"\\\\", tag:"mo", output:"\\",   tex:"backslash", ttype:TYPE.CONST},
  {input:"setminus", tag:"mo", output:"\\", tex:null, ttype:TYPE.CONST},
  {input:"xx", tag:"mo", output:"\u00D7", tex:"times", ttype:TYPE.CONST},
  {input:"|><", tag:"mo", output:"\u22C9", tex:"ltimes", ttype:TYPE.CONST},
  {input:"><|", tag:"mo", output:"\u22CA", tex:"rtimes", ttype:TYPE.CONST},
  {input:"|><|", tag:"mo", output:"\u22C8", tex:"bowtie", ttype:TYPE.CONST},
  {input:"-:", tag:"mo", output:"\u00F7", tex:"div", ttype:TYPE.CONST},
  {input:"divide",   tag:"mo", output:"-:", tex:null, ttype:TYPE.DEFINITION},
  {input:"@",  tag:"mo", output:"\u2218", tex:"circ", ttype:TYPE.CONST},
  {input:"o+", tag:"mo", output:"\u2295", tex:"oplus", ttype:TYPE.CONST},
  {input:"ox", tag:"mo", output:"\u2297", tex:"otimes", ttype:TYPE.CONST},
  {input:"o.", tag:"mo", output:"\u2299", tex:"odot", ttype:TYPE.CONST},
  {input:"sum", tag:"mo", output:"\u2211", tex:null, ttype:TYPE.UNDEROVER},
  {input:"prod", tag:"mo", output:"\u220F", tex:null, ttype:TYPE.UNDEROVER},
  {input:"^^",  tag:"mo", output:"\u2227", tex:"wedge", ttype:TYPE.CONST},
  {input:"^^^", tag:"mo", output:"\u22C0", tex:"bigwedge", ttype:TYPE.UNDEROVER},
  {input:"vv",  tag:"mo", output:"\u2228", tex:"vee", ttype:TYPE.CONST},
  {input:"vvv", tag:"mo", output:"\u22C1", tex:"bigvee", ttype:TYPE.UNDEROVER},
  {input:"nn",  tag:"mo", output:"\u2229", tex:"cap", ttype:TYPE.CONST},
  {input:"nnn", tag:"mo", output:"\u22C2", tex:"bigcap", ttype:TYPE.UNDEROVER},
  {input:"uu",  tag:"mo", output:"\u222A", tex:"cup", ttype:TYPE.CONST},
  {input:"uuu", tag:"mo", output:"\u22C3", tex:"bigcup", ttype:TYPE.UNDEROVER},
  
  //binary relation symbols
  {input:"!=",  tag:"mo", output:"\u2260", tex:"ne", ttype:TYPE.CONST},
  {input:":=",  tag:"mo", output:":=",     tex:null, ttype:TYPE.CONST},
  {input:"lt",  tag:"mo", output:"<",      tex:null, ttype:TYPE.CONST},
  {input:"<=",  tag:"mo", output:"\u2264", tex:"le", ttype:TYPE.CONST},
  {input:"lt=", tag:"mo", output:"\u2264", tex:"leq", ttype:TYPE.CONST},
  {input:"gt",  tag:"mo", output:">",      tex:null, ttype:TYPE.CONST},
  {input:"mlt", tag:"mo", output:"\u226A", tex:"ll", ttype:TYPE.CONST},
  {input:">=",  tag:"mo", output:"\u2265", tex:"ge", ttype:TYPE.CONST},
  {input:"gt=", tag:"mo", output:"\u2265", tex:"geq", ttype:TYPE.CONST},
  {input:"mgt", tag:"mo", output:"\u226B", tex:"gg", ttype:TYPE.CONST},
  {input:"-<",  tag:"mo", output:"\u227A", tex:"prec", ttype:TYPE.CONST},
  {input:"-lt", tag:"mo", output:"\u227A", tex:null, ttype:TYPE.CONST},
  {input:">-",  tag:"mo", output:"\u227B", tex:"succ", ttype:TYPE.CONST},
  {input:"-<=", tag:"mo", output:"\u2AAF", tex:"preceq", ttype:TYPE.CONST},
  {input:">-=", tag:"mo", output:"\u2AB0", tex:"succeq", ttype:TYPE.CONST},
  {input:"in",  tag:"mo", output:"\u2208", tex:null, ttype:TYPE.CONST},
  {input:"!in", tag:"mo", output:"\u2209", tex:"notin", ttype:TYPE.CONST},
  {input:"sub", tag:"mo", output:"\u2282", tex:"subset", ttype:TYPE.CONST},
  {input:"sup", tag:"mo", output:"\u2283", tex:"supset", ttype:TYPE.CONST},
  {input:"sube", tag:"mo", output:"\u2286", tex:"subseteq", ttype:TYPE.CONST},
  {input:"supe", tag:"mo", output:"\u2287", tex:"supseteq", ttype:TYPE.CONST},
  {input:"-=",  tag:"mo", output:"\u2261", tex:"equiv", ttype:TYPE.CONST},
  {input:"~=",  tag:"mo", output:"\u2245", tex:"cong", ttype:TYPE.CONST},
  {input:"~~",  tag:"mo", output:"\u2248", tex:"approx", ttype:TYPE.CONST},
  {input:"~",  tag:"mo", output:"\u223C", tex:"sim", ttype:TYPE.CONST},
  {input:"prop", tag:"mo", output:"\u221D", tex:"propto", ttype:TYPE.CONST},
  
  //logical symbols
  {input:"and", tag:"mtext", output:"and", tex:null, ttype:TYPE.SPACE},
  {input:"or",  tag:"mtext", output:"or",  tex:null, ttype:TYPE.SPACE},
  {input:"not", tag:"mo", output:"\u00AC", tex:"neg", ttype:TYPE.CONST},
  {input:"=>",  tag:"mo", output:"\u21D2", tex:"implies", ttype:TYPE.CONST},
  {input:"if",  tag:"mo", output:"if",     tex:null, ttype:TYPE.SPACE},
  {input:"<=>", tag:"mo", output:"\u21D4", tex:"iff", ttype:TYPE.CONST},
  {input:"AA",  tag:"mo", output:"\u2200", tex:"forall", ttype:TYPE.CONST},
  {input:"EE",  tag:"mo", output:"\u2203", tex:"exists", ttype:TYPE.CONST},
  {input:"_|_", tag:"mo", output:"\u22A5", tex:"bot", ttype:TYPE.CONST},
  {input:"TT",  tag:"mo", output:"\u22A4", tex:"top", ttype:TYPE.CONST},
  {input:"|--",  tag:"mo", output:"\u22A2", tex:"vdash", ttype:TYPE.CONST},
  {input:"|==",  tag:"mo", output:"\u22A8", tex:"models", ttype:TYPE.CONST},
  
  //grouping brackets
  {input:"(", tag:"mo", output:"(", tex:"left(", ttype:TYPE.LEFTBRACKET},
  {input:")", tag:"mo", output:")", tex:"right)", ttype:TYPE.RIGHTBRACKET},
  {input:"[", tag:"mo", output:"[", tex:"left[", ttype:TYPE.LEFTBRACKET},
  {input:"]", tag:"mo", output:"]", tex:"right]", ttype:TYPE.RIGHTBRACKET},
  {input:"{", tag:"mo", output:"{", tex:null, ttype:TYPE.LEFTBRACKET},
  {input:"}", tag:"mo", output:"}", tex:null, ttype:TYPE.RIGHTBRACKET},
  {input:"|", tag:"mo", output:"|", tex:null, ttype:TYPE.LEFTRIGHT},
  {input:":|:", tag:"mo", output:"|", tex:null, ttype:TYPE.CONST},
  {input:"|:", tag:"mo", output:"|", tex:null, ttype:TYPE.LEFTBRACKET},
  {input:":|", tag:"mo", output:"|", tex:null, ttype:TYPE.RIGHTBRACKET},
  //{input:"||", tag:"mo", output:"||", tex:null, ttype:TYPE.LEFTRIGHT},
  {input:"(:", tag:"mo", output:"\u2329", tex:"langle", ttype:TYPE.LEFTBRACKET},
  {input:":)", tag:"mo", output:"\u232A", tex:"rangle", ttype:TYPE.RIGHTBRACKET},
  {input:"<<", tag:"mo", output:"\u2329", tex:null, ttype:TYPE.LEFTBRACKET},
  {input:">>", tag:"mo", output:"\u232A", tex:null, ttype:TYPE.RIGHTBRACKET},
  {input:"{:", tag:"mo", output:"{:", tex:null, ttype:TYPE.LEFTBRACKET, invisible:true},
  {input:":}", tag:"mo", output:":}", tex:null, ttype:TYPE.RIGHTBRACKET, invisible:true},
  
  //miscellaneous symbols
  {input:"int",  tag:"mo", output:"\u222B", tex:null, ttype:TYPE.CONST},
  {input:"dx",   tag:"mi", output:"{:d x:}", tex:null, ttype:TYPE.DEFINITION},
  {input:"dy",   tag:"mi", output:"{:d y:}", tex:null, ttype:TYPE.DEFINITION},
  {input:"dz",   tag:"mi", output:"{:d z:}", tex:null, ttype:TYPE.DEFINITION},
  {input:"dt",   tag:"mi", output:"{:d t:}", tex:null, ttype:TYPE.DEFINITION},
  {input:"oint", tag:"mo", output:"\u222E", tex:null, ttype:TYPE.CONST},
  {input:"del",  tag:"mo", output:"\u2202", tex:"partial", ttype:TYPE.CONST},
  {input:"grad", tag:"mo", output:"\u2207", tex:"nabla", ttype:TYPE.CONST},
  {input:"+-",   tag:"mo", output:"\u00B1", tex:"pm", ttype:TYPE.CONST},
  {input:"-+",   tag:"mo", output:"\u2213", tex:"mp", ttype:TYPE.CONST},
  {input:"O/",   tag:"mo", output:"\u2205", tex:"emptyset", ttype:TYPE.CONST},
  {input:"oo",   tag:"mo", output:"\u221E", tex:"infty", ttype:TYPE.CONST},
  {input:"aleph", tag:"mo", output:"\u2135", tex:null, ttype:TYPE.CONST},
  {input:"...",  tag:"mo", output:"...",    tex:"ldots", ttype:TYPE.CONST},
  {input:":.",  tag:"mo", output:"\u2234",  tex:"therefore", ttype:TYPE.CONST},
  {input:":'",  tag:"mo", output:"\u2235",  tex:"because", ttype:TYPE.CONST},
  {input:"/_",  tag:"mo", output:"\u2220",  tex:"angle", ttype:TYPE.CONST},
  {input:"/_\\",  tag:"mo", output:"\u25B3",  tex:"triangle", ttype:TYPE.CONST},
  {input:"'",   tag:"mo", output:"\u2032",  tex:"prime", ttype:TYPE.CONST},
  {input:"tilde", tag:"mover", output:"~", tex:null, ttype:TYPE.UNARY, acc:true},
  {input:"\\ ",  tag:"mo", output:"\u00A0", tex:null, ttype:TYPE.CONST},
  {input:"frown",  tag:"mo", output:"\u2322", tex:null, ttype:TYPE.CONST},
  {input:"quad", tag:"mo", output:"\u00A0\u00A0", tex:null, ttype:TYPE.CONST},
  {input:"qquad", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", tex:null, ttype:TYPE.CONST},
  {input:"cdots", tag:"mo", output:"\u22EF", tex:null, ttype:TYPE.CONST},
  {input:"vdots", tag:"mo", output:"\u22EE", tex:null, ttype:TYPE.CONST},
  {input:"ddots", tag:"mo", output:"\u22F1", tex:null, ttype:TYPE.CONST},
  {input:"diamond", tag:"mo", output:"\u22C4", tex:null, ttype:TYPE.CONST},
  {input:"square", tag:"mo", output:"\u25A1", tex:null, ttype:TYPE.CONST},
  {input:"|__", tag:"mo", output:"\u230A",  tex:"lfloor", ttype:TYPE.CONST},
  {input:"__|", tag:"mo", output:"\u230B",  tex:"rfloor", ttype:TYPE.CONST},
  {input:"|~", tag:"mo", output:"\u2308",  tex:"lceiling", ttype:TYPE.CONST},
  {input:"~|", tag:"mo", output:"\u2309",  tex:"rceiling", ttype:TYPE.CONST},
  {input:"CC",  tag:"mo", output:"\u2102", tex:null, ttype:TYPE.CONST},
  {input:"NN",  tag:"mo", output:"\u2115", tex:null, ttype:TYPE.CONST},
  {input:"QQ",  tag:"mo", output:"\u211A", tex:null, ttype:TYPE.CONST},
  {input:"RR",  tag:"mo", output:"\u211D", tex:null, ttype:TYPE.CONST},
  {input:"ZZ",  tag:"mo", output:"\u2124", tex:null, ttype:TYPE.CONST},
  {input:"f",   tag:"mi", output:"f",      tex:null, ttype:TYPE.UNARY, func:true},
  {input:"g",   tag:"mi", output:"g",      tex:null, ttype:TYPE.UNARY, func:true},
  
  //standard functions
  {input:"lim",  tag:"mo", output:"lim", tex:null, ttype:TYPE.UNDEROVER},
  {input:"Lim",  tag:"mo", output:"Lim", tex:null, ttype:TYPE.UNDEROVER},
  {input:"sin",  tag:"mo", output:"sin", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"cos",  tag:"mo", output:"cos", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"tan",  tag:"mo", output:"tan", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"sinh", tag:"mo", output:"sinh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"cosh", tag:"mo", output:"cosh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"tanh", tag:"mo", output:"tanh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"cot",  tag:"mo", output:"cot", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"sec",  tag:"mo", output:"sec", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"csc",  tag:"mo", output:"csc", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"arcsin",  tag:"mo", output:"arcsin", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"arccos",  tag:"mo", output:"arccos", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"arctan",  tag:"mo", output:"arctan", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"coth",  tag:"mo", output:"coth", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"sech",  tag:"mo", output:"sech", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"csch",  tag:"mo", output:"csch", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"exp",  tag:"mo", output:"exp", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"abs",   tag:"mo", output:"abs",  tex:null, ttype:TYPE.UNARY, rewriteleftright:["|","|"]},
  {input:"norm",   tag:"mo", output:"norm",  tex:null, ttype:TYPE.UNARY, rewriteleftright:["\u2225","\u2225"]},
  {input:"floor",   tag:"mo", output:"floor",  tex:null, ttype:TYPE.UNARY, rewriteleftright:["\u230A","\u230B"]},
  {input:"ceil",   tag:"mo", output:"ceil",  tex:null, ttype:TYPE.UNARY, rewriteleftright:["\u2308","\u2309"]},
  {input:"log",  tag:"mo", output:"log", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"ln",   tag:"mo", output:"ln",  tex:null, ttype:TYPE.UNARY, func:true},
  {input:"det",  tag:"mo", output:"det", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"dim",  tag:"mo", output:"dim", tex:null, ttype:TYPE.CONST},
  {input:"mod",  tag:"mo", output:"mod", tex:null, ttype:TYPE.CONST},
  {input:"gcd",  tag:"mo", output:"gcd", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"lcm",  tag:"mo", output:"lcm", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"lub",  tag:"mo", output:"lub", tex:null, ttype:TYPE.CONST},
  {input:"glb",  tag:"mo", output:"glb", tex:null, ttype:TYPE.CONST},
  {input:"min",  tag:"mo", output:"min", tex:null, ttype:TYPE.UNDEROVER},
  {input:"max",  tag:"mo", output:"max", tex:null, ttype:TYPE.UNDEROVER},
  {input:"Sin",  tag:"mo", output:"Sin", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Cos",  tag:"mo", output:"Cos", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Tan",  tag:"mo", output:"Tan", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Arcsin",  tag:"mo", output:"Arcsin", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Arccos",  tag:"mo", output:"Arccos", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Arctan",  tag:"mo", output:"Arctan", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Sinh", tag:"mo", output:"Sinh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Cosh", tag:"mo", output:"Cosh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Tanh", tag:"mo", output:"Tanh", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Cot",  tag:"mo", output:"Cot", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Sec",  tag:"mo", output:"Sec", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Csc",  tag:"mo", output:"Csc", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Log",  tag:"mo", output:"Log", tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Ln",   tag:"mo", output:"Ln",  tex:null, ttype:TYPE.UNARY, func:true},
  {input:"Abs",   tag:"mo", output:"abs",  tex:null, ttype:TYPE.UNARY, notexcopy:true, rewriteleftright:["|","|"]},
  
  //arrows
  {input:"uarr", tag:"mo", output:"\u2191", tex:"uparrow", ttype:TYPE.CONST},
  {input:"darr", tag:"mo", output:"\u2193", tex:"downarrow", ttype:TYPE.CONST},
  {input:"rarr", tag:"mo", output:"\u2192", tex:"rightarrow", ttype:TYPE.CONST},
  {input:"->",   tag:"mo", output:"\u2192", tex:"to", ttype:TYPE.CONST},
  {input:">->",   tag:"mo", output:"\u21A3", tex:"rightarrowtail", ttype:TYPE.CONST},
  {input:"->>",   tag:"mo", output:"\u21A0", tex:"twoheadrightarrow", ttype:TYPE.CONST},
  {input:">->>",   tag:"mo", output:"\u2916", tex:"twoheadrightarrowtail", ttype:TYPE.CONST},
  {input:"|->",  tag:"mo", output:"\u21A6", tex:"mapsto", ttype:TYPE.CONST},
  {input:"larr", tag:"mo", output:"\u2190", tex:"leftarrow", ttype:TYPE.CONST},
  {input:"harr", tag:"mo", output:"\u2194", tex:"leftrightarrow", ttype:TYPE.CONST},
  {input:"rArr", tag:"mo", output:"\u21D2", tex:"Rightarrow", ttype:TYPE.CONST},
  {input:"lArr", tag:"mo", output:"\u21D0", tex:"Leftarrow", ttype:TYPE.CONST},
  {input:"hArr", tag:"mo", output:"\u21D4", tex:"Leftrightarrow", ttype:TYPE.CONST},
  //commands with argument
  {input:"sqrt", tag:"msqrt", output:"sqrt", tex:null, ttype:TYPE.UNARY},
  {input:"root", tag:"mroot", output:"root", tex:null, ttype:TYPE.BINARY},
  {input:"frac", tag:"mfrac", output:"/",    tex:null, ttype:TYPE.BINARY},
  {input:"/",    tag:"mfrac", output:"/",    tex:null, ttype:TYPE.INFIX},
  {input:"stackrel", tag:"mover", output:"stackrel", tex:null, ttype:TYPE.BINARY},
  {input:"overset", tag:"mover", output:"stackrel", tex:null, ttype:TYPE.BINARY},
  {input:"underset", tag:"munder", output:"stackrel", tex:null, ttype:TYPE.BINARY},
  {input:"_",    tag:"msub",  output:"_",    tex:null, ttype:TYPE.INFIX},
  {input:"^",    tag:"msup",  output:"^",    tex:null, ttype:TYPE.INFIX},
  {input:"hat", tag:"mover", output:"\u005E", tex:null, ttype:TYPE.UNARY, acc:true},
  {input:"bar", tag:"mover", output:"\u00AF", tex:"overline", ttype:TYPE.UNARY, acc:true},
  {input:"vec", tag:"mover", output:"\u2192", tex:null, ttype:TYPE.UNARY, acc:true},
  {input:"dot", tag:"mover", output:".",      tex:null, ttype:TYPE.UNARY, acc:true},
  {input:"ddot", tag:"mover", output:"..",    tex:null, ttype:TYPE.UNARY, acc:true},
  {input:"overarc", tag:"mover", output:"\u23DC", tex:"overparen", ttype:TYPE.UNARY, acc:true},
  {input:"ul", tag:"munder", output:"\u0332", tex:"underline", ttype:TYPE.UNARY, acc:true},
  {input:"ubrace", tag:"munder", output:"\u23DF", tex:"underbrace", ttype:TYPE.UNARYUNDEROVER, acc:true},
  {input:"obrace", tag:"mover", output:"\u23DE", tex:"overbrace", ttype:TYPE.UNARYUNDEROVER, acc:true},
  {input:"text", tag:"mtext", output:"text", tex:null, ttype:TYPE.TEXT},
  {input:"mbox", tag:"mtext", output:"mbox", tex:null, ttype:TYPE.TEXT},
  {input:"cancel", tag:"menclose", output:"cancel", tex:null, ttype:TYPE.UNARY},
  {input:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"bb", tex:null, ttype:TYPE.UNARY},
  {input:"mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"mathbf", tex:null, ttype:TYPE.UNARY},
  {input:"sf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"sf", tex:null, ttype:TYPE.UNARY},
  {input:"mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"mathsf", tex:null, ttype:TYPE.UNARY},
  {input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", tex:null, ttype:TYPE.UNARY, codes:AMbbb},
  {input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", tex:null, ttype:TYPE.UNARY, codes:AMbbb},
  {input:"cc",  tag:"mstyle", atname:"mathvariant", atval:"script", output:"cc", tex:null, ttype:TYPE.UNARY, codes:AMcal},
  {input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", tex:null, ttype:TYPE.UNARY, codes:AMcal},
  {input:"tt",  tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"tt", tex:null, ttype:TYPE.UNARY},
  {input:"mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"mathtt", tex:null, ttype:TYPE.UNARY},
  {input:"fr",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"fr", tex:null, ttype:TYPE.UNARY, codes:AMfrk},
  {input:"mathfrak",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"mathfrak", tex:null, ttype:TYPE.UNARY, codes:AMfrk}
];

export class AsciiMath {
  private isIE:                              boolean;
  private mathML:                            boolean;
  private translated:                        boolean;
  private AMnames:                           Array<any>; //list of input symbols
  private AMnestingDepth:                    number;
  private AMpreviousSymbol:                  TYPE;
  private AMcurrentSymbol:                   TYPE;
  private automathrecognize:                 boolean; //writing "amath" on page makes this true
  constructor() {
    this.isIE              = (navigator.appName.slice(0,9)=="Microsoft");
    this.mathML            = (window.MathMLElement != undefined) && checkForMathML;
    this.translated        = false;
    this.AMnames           = [];
    this.AMnestingDepth    = 0;
    this.AMpreviousSymbol  = this.AMcurrentSymbol = TYPE.SPACE;
    this.automathrecognize = false; // writing "amath" on page makes this true

    this.setStylesheet("#AMMLcloseDiv \{font-size:0.8em; padding-top:1em; color:#014\}\n#AMMLwarningBox \{position:absolute; width:100%; top:0; left:0; z-index:200; text-align:center; font-size:1em; font-weight:bold; padding:0.5em 0 0.5em 0; color:#ffc; background:#c30\}");
    if (!this.mathML) this.initSymbols();
  }

  public parseMath(str : string) {
    let frag, node;
    this.AMnestingDepth = 0;
    //some basic cleanup for dealing with stuff editors like TinyMCE adds
    str = str.replace(/&nbsp;/g,"");
    str = str.replace(/&gt;/g,">");
    str = str.replace(/&lt;/g,"<");
    frag = this.AMparseExpr(str.replace(/^\s+/g,""),false)[0];
    node = createMmlNode("mstyle",frag);
    if (mathcolor != "") node.setAttribute("mathcolor",mathcolor);
    if (mathfontsize.length != 0) {
      node.setAttribute("fontsize", mathfontsize);
      node.setAttribute("mathsize", mathfontsize);
    }
    if (mathfontfamily.length != 0) {
      node.setAttribute("fontfamily", mathfontfamily);
      node.setAttribute("mathvariant", mathfontfamily);
    }
  
    if (displaystyle) node.setAttribute("displaystyle","true");
    node = createMmlNode("math",node);
    if (showasciiformulaonhover)                      //fixed by djhsu so newline
      node.setAttribute("title",str.replace(/\s+/g," "));//does not show in Gecko
    return node;
  }

  // generic(){
  //   if(!this.init()) return;
  //   if (translateOnLoad) {
  //     this.translate();
  //   }
  // };

  // Add a stylesheet, replacing any previous custom stylesheet (adapted from TW)
  setStylesheet(s: string) {
    const id  = "AMMLcustomStyleSheet";
    let    n  = document.getElementById(id);
    if (!n) {
      n = document.createElement("style");
      n.id = id;
      n.appendChild(document.createTextNode(s));
      document.getElementsByTagName("head")[0].appendChild(n);
      return;
    }
    if (!n.firstChild) return;
    n.replaceChild(document.createTextNode(s),n.firstChild);
  }

  translate(spanclassAM : HTMLSpanElement) {
    if (!this.translated) { // run this only once
      this.translated = true;
      let body = document.getElementsByTagName("body")[0];
      let processN = document.getElementById(AMdocumentId);
      if (translateASCIIMath) {
        this.AMprocessNode((processN!=null?processN:body), false, spanclassAM);
      }
    }
  }

  AMgetSymbol(str : string) {
    //return maximal initial substring of str that appears in names
    //return null if there is none
      let st;
      let tagst;
      let k     = 0;    //new pos
      let j     = 0;    //old pos
      let mk    = k;    //match pos
      let match = "";
      let more  = true;
      for (let i = 1; (i <= str.length) && more; i++) {
        st = str.slice(0,i); //initial substring of length i
        j = k;
        k = position(this.AMnames, st, j);
        if (k<this.AMnames.length && str.slice(0,this.AMnames[k].length)==this.AMnames[k]){
          match = this.AMnames[k];
          mk = k;
          i = match.length;
        }
        more = k<this.AMnames.length && str.slice(0,this.AMnames[k].length)>=this.AMnames[k];
      }
      this.AMpreviousSymbol = this.AMcurrentSymbol;
      if (match!=""){
        this.AMcurrentSymbol = AMsymbols[mk].ttype;
        return AMsymbols[mk];
      }
    // if str[0] is a digit or - return maxsubstring of digits.digits
      this.AMcurrentSymbol=TYPE.CONST;
      k = 1;
      st = str.slice(0,1);
      var integ = true;
      while ("0"<=st && st<="9" && k<=str.length) {
        st = str.slice(k,k+1);
        k++;
      }
      if (st == decimalsign) {
        st = str.slice(k,k+1);
        if ("0"<=st && st<="9") {
          integ = false;
          k++;
          while ("0"<=st && st<="9" && k<=str.length) {
            st = str.slice(k,k+1);
            k++;
          }
        }
      }
      if ((integ && k>1) || k>2) {
        st = str.slice(0,k-1);
        tagst = "mn";
      } else {
        k = 2;
        st = str.slice(0,1); //take 1 character
        tagst = (("A">st || st>"Z") && ("a">st || st>"z")?"mo":"mi");
      }
      if ((st == "-") && (str.charAt(1) !== ' ') && (this.AMpreviousSymbol == TYPE.INFIX)) {
        this.AMcurrentSymbol = TYPE.INFIX;  //trick "/" into recognizing "-" on second parse
        return {input:st, tag:tagst, output:st, ttype:TYPE.UNARY, func:true};
      }
      return {input:st, tag:tagst, output:st, ttype:TYPE.CONST};
  }

  AMparseSexpr(str : string) : [Element, string] { //parses str and returns [node,tailstr]
    let symbol : AMsymbol; 
    let node, result, i, st;
    let newFrag = document.createDocumentFragment();
    str = AMremoveCharsAndBlanks(str,0);
    symbol = this.AMgetSymbol(str);             //either a token or a bracket or empty
    if ((symbol == null) || (symbol.ttype == TYPE.RIGHTBRACKET) && (this.AMnestingDepth > 0)) {
      return [document.createElement("br"), str];
    }
    if (symbol.ttype == TYPE.DEFINITION) {
      str = symbol.output+AMremoveCharsAndBlanks(str,symbol.input.length);
      symbol = this.AMgetSymbol(str);
    }
    switch (symbol.ttype) {
      case TYPE.UNDEROVER:
      case TYPE.CONST:
        str = AMremoveCharsAndBlanks(str,symbol.input.length);
        return [
          createMmlNode(symbol.tag, document.createTextNode(symbol.output)), 
          str
        ];
    case TYPE.LEFTBRACKET:   //read (expr+)
      this.AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      result = this.AMparseExpr(str,true);
      this.AMnestingDepth--;
      if (symbol.invisible != undefined)
        node = createMmlNode("mrow",result[0]);
      else {
        node = createMmlNode("mo",document.createTextNode(symbol.output));
        node = createMmlNode("mrow",node);
        node.appendChild(result[0]);
      }
      return [node,result[1]];
    case TYPE.TEXT:
        if (symbol!=AMquote) str = AMremoveCharsAndBlanks(str,symbol.input.length);
        if (str.charAt(0)=="{") i=str.indexOf("}");
        else if (str.charAt(0)=="(") i=str.indexOf(")");
        else if (str.charAt(0)=="[") i=str.indexOf("]");
        else if (symbol==AMquote) i=str.slice(1).indexOf("\"")+1;
        else i = 0;
        if (i==-1) i = str.length;
        st = str.slice(1,i);
        if (st.charAt(0) == " ") {
          node = createMmlNode("mspace", null);
          node.setAttribute("width","1ex");
          newFrag.appendChild(node);
        }
        newFrag.appendChild(
          createMmlNode(symbol.tag,document.createTextNode(st)));
        if (st.charAt(st.length-1) == " ") {
          node = createMmlNode("mspace", null);
          node.setAttribute("width","1ex");
          newFrag.appendChild(node);
        }
        str = AMremoveCharsAndBlanks(str,i+1);
        return [createMmlNode("mrow",newFrag),str];
    case TYPE.UNARYUNDEROVER:
    case TYPE.UNARY:
        str = AMremoveCharsAndBlanks(str,symbol.input.length);
        result = this.AMparseSexpr(str);
        
        if (result[0]==null) { 
          if (symbol.tag=="mi" || symbol.tag=="mo") {
            return [
              createMmlNode(symbol.tag, document.createTextNode(symbol.output)),
              str
            ];
          } else {
            result[0] = createMmlNode("mi", null); 
          }
        }
        if (typeof symbol.func == "boolean" && symbol.func) { // functions hack
          st = str.charAt(0);
            if (st=="^" || st=="_" || st=="/" || st=="|" || st=="," ||
               (symbol.input.length==1 && symbol.input.match(/\w/) && st!="(")) {
            return [createMmlNode(symbol.tag,
                      document.createTextNode(symbol.output)),str];
          } else {
            node = createMmlNode("mrow",
             createMmlNode(symbol.tag,document.createTextNode(symbol.output)));
            node.appendChild(result[0]);
            return [node,result[1]];
          }
        }
        AMremoveBrackets(result[0]);
        if (symbol.input == "sqrt") {           // sqrt
          return [createMmlNode(symbol.tag,result[0]),result[1]];
        } else if (symbol.rewriteleftright) {    // abs, floor, ceil
            node = createMmlNode("mrow", createMmlNode("mo",document.createTextNode(symbol.rewriteleftright[0])));
            node.appendChild(result[0]);
            node.appendChild(createMmlNode("mo",document.createTextNode(symbol.rewriteleftright[1])));
            return [node,result[1]];
        } else if (symbol.input == "cancel") {   // cancel
          node = createMmlNode(symbol.tag,result[0]);
    node.setAttribute("notation","updiagonalstrike");
    return [node,result[1]];
        } else if (typeof symbol.acc == "boolean" && symbol.acc) {   // accent
          node = createMmlNode(symbol.tag,result[0]);
          var accnode = createMmlNode("mo",document.createTextNode(symbol.output));
          if (symbol.input=="vec" && (
      (result[0].nodeName=="mrow" && result[0].childNodes.length==1
        && result[0].firstChild !==null
        && result[0].firstChild.firstChild !== null
        && result[0].firstChild.firstChild.nodeValue !== null
        && result[0].firstChild.firstChild.nodeValue.length==1) ||
      (result[0].firstChild && result[0].firstChild.nodeValue !== null
        && result[0].firstChild.nodeValue.length==1) )) {
        accnode.setAttribute("stretchy", "false");
          }
          node.appendChild(accnode);
          return [node,result[1]];
        }
        else {                        // font change command
          if (!this.isIE && symbol.codes) {
            for (i=0; i<result[0].childNodes.length; i++){
              if (result[0].childNodes[i].nodeName=="mi" || result[0].nodeName=="mi") {
                if (result[0].firstChild && result[0].nodeName=="mi") { 
                  st = result[0].firstChild.nodeValue;
                } else {
                  let firstChild = result[0].childNodes[i].firstChild;
                  if (firstChild) {
                    st = firstChild.nodeValue;
                  }
                }
                let newst = "";
                if (!st){ continue; }
                for (var j=0; j<st.length; j++)
        if (st.charCodeAt(j)>64 && st.charCodeAt(j)<91) 
          newst = newst + symbol.codes[st.charCodeAt(j)-65];
                  else if (st.charCodeAt(j)>96 && st.charCodeAt(j)<123)
                    newst = newst + symbol.codes[st.charCodeAt(j)-71];
                  else newst = newst + st.charAt(j);
                if (result[0].nodeName=="mi"){
                  result[0]=createMmlNode("mo", null);
                  result[0].appendChild(document.createTextNode(newst));
                } else {
                  result[0].replaceChild(createMmlNode("mo", null).
                                 appendChild(document.createTextNode(newst)),
                                             result[0].childNodes[i]);
                }
              }
            }
          }
          node = createMmlNode(symbol.tag,result[0]);
          node.setAttribute(
            symbol.atname ? symbol.atname : "",
            symbol.atval  ? symbol.atval  : ""
          );
          return [node,result[1]];
        }
    case TYPE.BINARY:
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      result = this.AMparseSexpr(str);
      if (result[0]==null) return [createMmlNode("mo",
                             document.createTextNode(symbol.input)),str];
      AMremoveBrackets(result[0]);
      let result2 = this.AMparseSexpr(result[1]);
      if (result2[0]==null) return [createMmlNode("mo",
                             document.createTextNode(symbol.input)),str];
      AMremoveBrackets(result2[0]);
      if (['color', 'class', 'id'].indexOf(symbol.input) >= 0) {
  
        // Get the second argument
        if (str.charAt(0)=="{") i=str.indexOf("}");
        else if (str.charAt(0)=="(") i=str.indexOf(")");
        else if (str.charAt(0)=="[") i=str.indexOf("]");
        st = str.slice(1,i);
  
        // Make a mathml node
        node = createMmlNode(symbol.tag,result2[0]);
  
        // Set the correct attribute
        if (symbol.input === "color") node.setAttribute("mathcolor", st)
        else if (symbol.input === "class") node.setAttribute("class", st)
        else if (symbol.input === "id") node.setAttribute("id", st)
        return [node,result2[1]];
      }
      if (symbol.input=="root" || symbol.output=="stackrel")
        newFrag.appendChild(result2[0]);
      newFrag.appendChild(result[0]);
      if (symbol.input=="frac") newFrag.appendChild(result2[0]);
      return [createMmlNode(symbol.tag,newFrag),result2[1]];
    case TYPE.INFIX:
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      return [createMmlNode("mo",document.createTextNode(symbol.output)),str];
    case TYPE.SPACE:
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      node = createMmlNode("mspace", null);
      node.setAttribute("width","1ex");
      newFrag.appendChild(node);
      newFrag.appendChild(
        createMmlNode(symbol.tag,document.createTextNode(symbol.output)));
      node = createMmlNode("mspace", null);
      node.setAttribute("width","1ex");
      newFrag.appendChild(node);
      return [createMmlNode("mrow",newFrag),str];
    case TYPE.LEFTRIGHT:
  //    if (rightvert) return [null,str]; else rightvert = true;
      this.AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      result = this.AMparseExpr(str,false);
      this.AMnestingDepth--;
      st = "";
      if ((result[0].lastChild != null) && (result[0].lastChild.firstChild != null)) {
        st = result[0].lastChild.firstChild.nodeValue;
      }
      if (st == "|" && str.charAt(0)!==",") { // its an absolute value subterm
        node = createMmlNode("mo",document.createTextNode(symbol.output));
        node = createMmlNode("mrow",node);
        node.appendChild(result[0]);
        return [node,result[1]];
      } else { // the "|" is a \mid so use unicode 2223 (divides) for spacing
        node = createMmlNode("mo",document.createTextNode("\u2223"));
        node = createMmlNode("mrow",node);
        return [node,str];
      }
    default:
  //alert("default");
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
      return [createMmlNode(symbol.tag,        //its a constant
                               document.createTextNode(symbol.output)),str];
    }
  }

  refreshSymbols(){
    AMsymbols.sort(compareNames);
    for (let i=0; i<AMsymbols.length; i++) {
      this.AMnames[i] = AMsymbols[i].input;
    }
  }

  AMparseIexpr(str : string) : [Element, string] {
    let symbol, sym1, sym2, node, result, underover;
    str = AMremoveCharsAndBlanks(str,0);
    sym1 = this.AMgetSymbol(str);
    result = this.AMparseSexpr(str);
    node = result[0];
    str = result[1];
    symbol = this.AMgetSymbol(str);
    if (symbol.ttype == TYPE.INFIX && symbol.input != "/") {
      str = AMremoveCharsAndBlanks(str,symbol.input.length);
  //    if (symbol.input == "/") result = AMparseIexpr(str); else ...
      result = this.AMparseSexpr(str);
      if (result[0] == null) // show box in place of missing argument
        result[0] = createMmlNode("mo",document.createTextNode("\u25A1"));
      else AMremoveBrackets(result[0]);
      str = result[1];
  //    if (symbol.input == "/") AMremoveBrackets(node);
      underover = (sym1.ttype == TYPE.UNDEROVER || sym1.ttype == TYPE.UNARYUNDEROVER);
      if (symbol.input == "_") {
        sym2 = this.AMgetSymbol(str);
        if (sym2.input == "^") {
          str = AMremoveCharsAndBlanks(str,sym2.input.length);
          let res2 = this.AMparseSexpr(str);
          AMremoveBrackets(res2[0]);
          str = res2[1];
          node = createMmlNode((underover?"munderover":"msubsup"),node);
          node.appendChild(result[0]);
          node.appendChild(res2[0]);
          node = createMmlNode("mrow",node); // so sum does not stretch
        } else {
          node = createMmlNode((underover?"munder":"msub"),node);
          node.appendChild(result[0]);
        }
      } else if (symbol.input == "^" && underover) {
        node = createMmlNode("mover",node);
          node.appendChild(result[0]);
      } else {
        node = createMmlNode(symbol.tag,node);
        node.appendChild(result[0]);
      }
      if (typeof sym1.func != 'undefined' && sym1.func) {
        sym2 = this.AMgetSymbol(str);
        if (sym2.ttype != TYPE.INFIX && sym2.ttype != TYPE.RIGHTBRACKET &&
            (sym1.input.length>1 || sym2.ttype == TYPE.LEFTBRACKET)) {
          result = this.AMparseIexpr(str);
          node = createMmlNode("mrow",node);
          node.appendChild(result[0]);
          str = result[1];
        }
      }
    }
    return [node,str];
  }

  initSymbols() {
    let i;
    let symlen = AMsymbols.length;
    for (i=0; i<symlen; i++) {
      let tex = AMsymbols[i].tex;
      if (tex == null) continue;
      AMsymbols.push({input:tex, tex: tex,
        tag:AMsymbols[i].tag, output:AMsymbols[i].output, ttype:AMsymbols[i].ttype,
        acc:(AMsymbols[i].acc||false)});
    }
    this.refreshSymbols();
  }

  define(oldstr : string, newstr : string) {
    AMsymbols.push({input:oldstr, tag:"mo", output:newstr, tex:null, ttype:TYPE.DEFINITION});
    this.refreshSymbols(); // this may be a problem if many symbols are defined!
  }

  newsymbol(symbolobj : any) {
    AMsymbols.push(symbolobj);
    this.refreshSymbols();
  }

  newcommand(oldstr : string, newstr : string) {
    AMsymbols.push({input:oldstr, tag:"mo", output:newstr, tex:null, ttype:TYPE.DEFINITION});
    this.refreshSymbols();
  }

  processNodeR(n : Node, linebreaks : boolean, latex : string) {
    let mtch, str, arr, frg, i;
    if (n.childNodes.length == 0) {
      if (!n.parentNode) return -1;
      if (
        (n.nodeType!=8 || linebreaks)       &&
        (n.parentNode.nodeName!="form")     && (n.parentNode.nodeName!="FORM") &&
        (n.parentNode.nodeName!="textarea") && (n.parentNode.nodeName!="TEXTAREA")
      ) {
      str = n.nodeValue;
      if (!(str == null)) {
        str = str.replace(/\r\n\r\n/g,"\n\n");
        str = str.replace(/\x20+/g," ");
        str = str.replace(/\s*\r\n/g," ");
        if(latex) {
  // DELIMITERS:
          mtch = (str.indexOf("\$")==-1 ? false : true);
          str = str.replace(/([^\\])\$/g,"$1 \$");
          str = str.replace(/^\$/," \$");	// in case \$ at start of string
          arr = str.split(" \$");
          for (i=0; i<arr.length; i++)
      arr[i]=arr[i].replace(/\\\$/g,"\$");
        } else {
        mtch = false;
        str = str.replace(new RegExp(AMescape1, "g"),
                function(){mtch = true; return "AMescape1"});
        if (/\\?end{?a?math}?/i.test(str)){
          this.automathrecognize = false;
          mtch = true;
        }
        str = str.replace(/\\?end{?a?math}?/i, "");
        if (/amath\b|\\begin{a?math}/i.test(str)){
          this.automathrecognize = true;
          mtch = true;
        }
        str = str.replace(/amath\b|\\begin{a?math}/i, "");
        arr = str.split(AMdelimiter1);
        if (this.automathrecognize)
          for (i=0; i<arr.length; i++)
            if (i%2==0) arr[i] = AMautomathrec(arr[i]);
        str = arr.join(AMdelimiter1);
        arr = str.split(AMdelimiter1);
        for (i=0; i<arr.length; i++) // this is a problem ************
          arr[i]=arr[i].replace(/AMescape1/g,AMdelimiter1);
        }
        if (arr.length>1 || mtch) {
          if (this.mathML) {
            frg = this.strarr2docFrag(arr,n.nodeType==8);
            var len = frg.childNodes.length;
            n.parentNode.replaceChild(frg,n);
            return len-1;
          } else return 0;
        }
      }
     } else return 0;
    } else if (n.nodeName!="math") {
      for (i=0; i<n.childNodes.length; i++)
        i += this.processNodeR(n.childNodes[i], linebreaks,latex);
    }
    return 0;
  }

  AMparseExpr(str : string, rightbracket : boolean) : [DocumentFragment, string] {
    let symbol, node, result, i,
    newFrag = document.createDocumentFragment();
    do {
      str = AMremoveCharsAndBlanks(str,0);
      result = this.AMparseIexpr(str);
      node = result[0];
      str = result[1];
      symbol = this.AMgetSymbol(str);
      if (symbol.ttype == TYPE.INFIX && symbol.input == "/") {
        str = AMremoveCharsAndBlanks(str,symbol.input.length);
        result = this.AMparseIexpr(str);
        if (result[0] == null) // show box in place of missing argument
          result[0] = createMmlNode("mo",document.createTextNode("\u25A1"));
        else AMremoveBrackets(result[0]);
        str = result[1];
        AMremoveBrackets(node);
        node = createMmlNode(symbol.tag,node);
        node.appendChild(result[0]);
        newFrag.appendChild(node);
        symbol = this.AMgetSymbol(str);
      }
      else if (node) {
        newFrag.appendChild(node);
      }
    } while (
      (symbol.ttype != TYPE.RIGHTBRACKET && 
        (symbol.ttype != TYPE.LEFTRIGHT || rightbracket) ||
        this.AMnestingDepth == 0
      ) && 
      symbol != null && 
      symbol.output!=""
    );
    if (symbol.ttype != TYPE.RIGHTBRACKET && symbol.ttype != TYPE.LEFTRIGHT) {
      return [newFrag, str];
    }
    //    if (AMnestingDepth > 0) AMnestingDepth--;
    if (!newFrag.lastChild)           { return [newFrag,str]; }
    if (!newFrag.lastChild.lastChild) { return [newFrag,str]; }
    if (
      newFrag.lastChild.nodeName != "mrow" || 
      !newFrag.lastChild.lastChild.firstChild 
    ) {
      return [newFrag, str];
    }
       //matrix
          //removed to allow row vectors: //&& len>1 &&
          //newFrag.childNodes[len-2].nodeName == "mo" &&
          //newFrag.childNodes[len-2].firstChild.nodeValue == ","

    let right = newFrag.lastChild.lastChild.firstChild.nodeValue;
    if (right!=")" &&  right!="]") {
      return [newFrag, str];
    }
    if (!newFrag.lastChild.firstChild)            { return [newFrag, str]; }
    if (!newFrag.lastChild.firstChild.firstChild) { return [newFrag, str]; }
    let left = newFrag.lastChild.firstChild.firstChild.nodeValue;
    if (
      left=="(" && right==")" && 
      symbol.output != "}" ||
      left=="[" && 
      right=="]"
    ) {
      let pos : Array<Array<number>> = [[]]; // positions of commas
      let matrix = true;
      let m = newFrag.childNodes.length;
      for (i=0; matrix && i<m; i=i+2) {
        pos[i] = [];
        node = newFrag.childNodes[i];
        if (!node.firstChild)            { continue; }
        if (!node.nextSibling)           { continue; }
        if (!node.nextSibling.firstChild) { continue; }
        if (!node.lastChild)             { continue; }
        // if (!node) {
        //   matrix = false;
        // }
        if (matrix) {
          matrix = (
            node.nodeName=="mrow" &&
            (
              (i == (m - 1)) || 
              (node.nextSibling.nodeName=="mo") &&
              (node.nextSibling.firstChild.nodeValue==",")
            ) &&
            (node.firstChild.firstChild != null) &&
            (node.firstChild.firstChild.nodeValue==left) &&
            (node.lastChild.firstChild  != null) &&
            (node.lastChild.firstChild.nodeValue==right)
          );
        }
        if (matrix)
          for (var j=0; j<node.childNodes.length; j++){
            let child = node.childNodes[j];
            if (!child)            { continue; }
            if (!child.firstChild) { continue; }
            if (child.firstChild.nodeValue==","){
              pos[i][pos[i].length]=j;
            }
          }
        if (matrix && i>1) matrix = pos[i].length == pos[i-2].length;
      }
      matrix = matrix && (pos.length>1 || pos[0].length>0);
      var columnlines = [];
      if (matrix) {
        var row, frag, n, k, table = document.createDocumentFragment();
        for (i=0; i<m; i=i+2) {
          row = document.createDocumentFragment();
          frag = document.createDocumentFragment();
          node = newFrag.firstChild; // <mrow>(-,-,...,-,-)</mrow>
          if (!node) { continue; }
          n = node.childNodes.length;
          k = 0;
          if (!node.firstChild) { continue; }
          node.removeChild(node.firstChild); //remove (
          for (j=1; j<n-1; j++) {
            if (typeof pos[i][k] != "undefined" && j==pos[i][k]){
              node.removeChild(node.firstChild); //remove ,
              if (
                node.firstChild.nodeName=="mrow" && 
                node.firstChild.childNodes.length==1 &&
                node.firstChild.firstChild &&
                node.firstChild.firstChild.firstChild &&
                node.firstChild.firstChild.firstChild.nodeValue=="\u2223"
              ) {
            //is columnline marker - skip it
            if (i==0) { columnlines.push("solid"); }
              node.removeChild(node.firstChild); //remove mrow
              node.removeChild(node.firstChild); //remove ,
              j+=2;
              k++;
            } else if (i==0) { columnlines.push("none"); }
              row.appendChild(createMmlNode("mtd",frag));
              k++;
            } else frag.appendChild(node.firstChild);
          }
          row.appendChild(createMmlNode("mtd",frag));
          if (i==0) { columnlines.push("none"); }
          if (newFrag.firstChild) { newFrag.removeChild(newFrag.firstChild); } //remove <mrow>)</mrow>
          if (newFrag.firstChild) { newFrag.removeChild(newFrag.firstChild); } //remove <mo>,</mo>
          table.appendChild(createMmlNode("mtr",row));
        }
        node = createMmlNode("mtable",table);
        node.setAttribute("columnlines", columnlines.join(" "));
        if (typeof symbol.invisible == "boolean" && symbol.invisible) node.setAttribute("columnalign","left");
        if (newFrag.firstChild){
          newFrag.replaceChild(node,newFrag.firstChild);
        }
      }
    }
    str = AMremoveCharsAndBlanks(str,symbol.input.length);
    if (typeof symbol.invisible != "boolean" || !symbol.invisible) {
      node = createMmlNode("mo",document.createTextNode(symbol.output));
      newFrag.appendChild(node);
    }
    return [newFrag,str];
  }

  AMprocessNode(n : Element, linebreaks : boolean, spanclassAM : HTMLSpanElement) {
    var frag,st;
    if (spanclassAM!=null) {
      frag = document.getElementsByTagName("span")
      for (let i = 0; i < frag.length; i++) {
        if (frag[i].className == "AM") {
          this.processNodeR(frag[i],linebreaks, "");
        }
      }
    } else {
      try {
        st = n.innerHTML; // look for AMdelimiter on page
      } catch(err) {}
  //alert(st)
      if (st==null || /amath\b|\\begin{a?math}/i.test(st) ||
        st.indexOf(AMdelimiter1+" ")!=-1 || st.slice(-1)==AMdelimiter1 ||
        st.indexOf(AMdelimiter1+"<")!=-1 || st.indexOf(AMdelimiter1+"\n")!=-1) {
        this.processNodeR(n,linebreaks,"");
      }
    }
  }

  strarr2docFrag(arr : string[], linebreaks : boolean) {
    var newFrag=document.createDocumentFragment();
    var expr = false;
    for (var i=0; i<arr.length; i++) {
      if (expr) newFrag.appendChild(this.parseMath(arr[i]));
      else {
        var arri = (linebreaks ? arr[i].split("\n\n") : [arr[i]]);
        newFrag.appendChild(createElementXHTML("span").
        appendChild(document.createTextNode(arri[0])));
        for (var j=1; j<arri.length; j++) {
          newFrag.appendChild(createElementXHTML("p"));
          newFrag.appendChild(createElementXHTML("span").
          appendChild(document.createTextNode(arri[j])));
        }
      }
      expr = !expr;
    }
    return newFrag;
  }
}

function createElementXHTML(t : string) {
  return document.createElementNS("http://www.w3.org/1999/xhtml",t);
}

// function AMcreateElementMathML(t : string) {
//   return document.createElementNS(AMmathml,t);
// }

function createMmlNode(t : string, frag : Text | Element | DocumentFragment | null) {
  let node = document.createElementNS(AMmathml,t);
  if (frag) node.appendChild(frag);
  return node;
}

// character lists for Mozilla/Netscape fonts

var AMquote = {input:"\"",   tag:"mtext", output:"mbox", tex:null, ttype:TYPE.TEXT};

function compareNames(s1 : AMsymbol, s2 : AMsymbol) {
  if (s1.input > s2.input) return 1
  else return -1;
}

function AMremoveCharsAndBlanks(str : string, n : number) : string {
//remove n characters and any following blanks
  let st;
  if (str.charAt(n)=="\\" && str.charAt(n+1)!="\\" && str.charAt(n+1)!=" ")
    st = str.slice(n+1);
  else st = str.slice(n);
  for (var i=0; i<st.length && st.charCodeAt(i)<=32; i=i+1);
  return st.slice(i);
}

function position(arr : Array<any>, str : string, n : number) : number {
// return position >=n where str appears or would be inserted
// assumes arr is sorted
  if (n==0) {
    let h,m;
    n = -1;
    h = arr.length;
    while (n+1<h) {
      m = (n+h) >> 1;
      if (arr[m]<str) n = m; else h = m;
    }
    return h;
  }
  let i = n;
  while ((i < arr.length) && (arr[i] < str)) { i++; }
  return i; // i=arr.length || arr[i]>=str
}

function AMremoveBrackets(node : Node) {
  var st;
  if (!node) return;
  if (!node.firstChild) return;
  if (node.firstChild.firstChild && (node.nodeName=="mrow" || node.nodeName=="M:MROW")) {
    if (node.firstChild.nextSibling && node.firstChild.nextSibling.nodeName=="mtable") { return; }
    st = node.firstChild.firstChild.nodeValue;
    if (st=="(" || st=="[" || st=="{") node.removeChild(node.firstChild);
  }
  if (!node.lastChild) return;
  if (node.lastChild.firstChild && (node.nodeName=="mrow" || node.nodeName=="M:MROW")) {
    st = node.lastChild.firstChild.nodeValue;
    if (st==")" || st=="]" || st=="}") node.removeChild(node.lastChild);
  }
}

/*Parsing ASCII math expressions with the following grammar
v ::= [A-Za-z] | greek letters | numbers | other constant symbols
u ::= sqrt | text | bb | other unary symbols for font commands
b ::= frac | root | stackrel         binary symbols
l ::= ( | [ | { | (: | {:            left brackets
r ::= ) | ] | } | :) | :}            right brackets
S ::= v | lEr | uS | bSS             Simple expression
I ::= S_S | S^S | S_S^S | S          Intermediate expression
E ::= IE | I/I                       Expression
Each terminal symbol is translated into a corresponding mathml node.*/

function AMautomathrec(str : string) : string {
//formula is a space (or start of str) followed by a maximal sequence of *two* or more tokens, possibly separated by runs of digits and/or space.
//tokens are single letters (except a, A, I) and ASCIIMathML tokens
  var texcommand = "\\\\[a-zA-Z]+|\\\\\\s|";
  var ambigAMtoken = "\\b(?:oo|lim|ln|int|oint|del|grad|aleph|prod|prop|sinh|cosh|tanh|cos|sec|pi|tt|fr|sf|sube|supe|sub|sup|det|mod|gcd|lcm|min|max|vec|ddot|ul|chi|eta|nu|mu)(?![a-z])|";
  var englishAMtoken = "\\b(?:sum|ox|log|sin|tan|dim|hat|bar|dot)(?![a-z])|";
  var secondenglishAMtoken = "|\\bI\\b|\\bin\\b|\\btext\\b"; // took if and or not out
  var simpleAMtoken = "NN|ZZ|QQ|RR|CC|TT|AA|EE|sqrt|dx|dy|dz|dt|xx|vv|uu|nn|bb|cc|csc|cot|alpha|beta|delta|Delta|epsilon|gamma|Gamma|kappa|lambda|Lambda|omega|phi|Phi|Pi|psi|Psi|rho|sigma|Sigma|tau|theta|Theta|xi|Xi|zeta"; // uuu nnn?
  var letter = "[a-zA-HJ-Z](?=(?:[^a-zA-Z]|$|"+ambigAMtoken+englishAMtoken+simpleAMtoken+"))|";
  var token = letter+texcommand+"\\d+|[-()[\\]{}+=*&^_%\\\@/<>,\\|!:;'~]|\\.(?!(?:\x20|$))|"+ambigAMtoken+englishAMtoken+simpleAMtoken;
  var re = new RegExp("(^|\\s)((("+token+")\\s?)(("+token+secondenglishAMtoken+")\\s?)+)([,.?]?(?=\\s|$))","g");
  str = str.replace(re," `$2`$7");
  var arr = str.split(AMdelimiter1);
  var re1 = new RegExp("(^|\\s)([b-zB-HJ-Z+*<>]|"+texcommand+ambigAMtoken+simpleAMtoken+")(\\s|\\n|$)","g");
  var re2 = new RegExp("(^|\\s)([a-z]|"+texcommand+ambigAMtoken+simpleAMtoken+")([,.])","g"); // removed |\d+ for now
  for (let i = 0; i < arr.length; i++) {  //single nonenglish tokens
    if (i % 2 == 0) {
      arr[i] = arr[i].replace(re1," `$2`$3");
      arr[i] = arr[i].replace(re2," `$2`$3");
      arr[i] = arr[i].replace(/([{}[\]])/,"`$1`");
    }
  }
  str = arr.join(AMdelimiter1);
  str = str.replace(/((^|\s)\([a-zA-Z]{2,}.*?)\)`/g,"$1`)");  //fix parentheses
  str = str.replace(/`(\((a\s|in\s))(.*?[a-zA-Z]{2,}\))/g,"$1`$3");  //fix parentheses
  str = str.replace(/\sin`/g,"` in");
  str = str.replace(/`(\(\w\)[,.]?(\s|\n|$))/g,"$1`");
  str = str.replace(/`([0-9.]+|e.g|i.e)`(\.?)/gi,"$1$2");
  str = str.replace(/`([0-9.]+:)`/g,"$1");
  return str;
}

//setup onload function
// if(typeof window.addEventListener != 'undefined'){
//   //.. gecko, safari, konqueror and standard
//   window.addEventListener('load', generic, false);
// }
// else if(typeof document.addEventListener != 'undefined'){
//   //.. opera 7
//   document.addEventListener('load', generic, false);
// }else{
//   //.. mac/ie5 and anything else that gets this far
//   //if there's an existing onload function
//   if(typeof window.onload == 'function'){
//     //store it
//     var existing = onload;
//     //add new onload handler
//     window.onload = function(){
//       //call existing onload function
//       existing();
//       //call generic onload function
//       generic();
//     };
//   }else{
//     window.onload = generic;
//   }
// }
