import Lexer from "./lexer.js";
import Parser from "./parser.js";

// Example usage
const input1 = `
  let x = 5;
  let y: int = 10;
  let z: list = [100, 2, 3];
  let roro: str = "Hello, world!";
  loop {
    let i = 0;
    while (i < 10) {
        i = i + 1;
    }
  }
  function myFunc() {
    // function body
  }
  `;
const input = `// тывтсылв
  let x = "Hello, world!";
            
  `;

const lexer = new Lexer(input);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
console.log(tokens);

