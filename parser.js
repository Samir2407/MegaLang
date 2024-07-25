class Program {
  constructor(body) {
    this.type = "Program";
    this.body = body;
  }
}

class VariableDeclaration {
  constructor(identifier, initializer) {
    this.type = "VariableDeclaration";
    this.identifier = identifier;
    this.initializer = initializer;
  }
}

class Identifier {
  constructor(name) {
    this.type = "Identifier";
    this.name = name;
  }
}

class Literal {
  constructor(value) {
    this.type = "Literal";
    this.value = value;
  }
}

class AssignmentExpression {
  constructor(left, right) {
    this.type = "AssignmentExpression";
    this.left = left;
    this.right = right;
  }
}

class BlockStatement {
  constructor(body) {
    this.type = "BlockStatement";
    this.body = body;
  }
}

class LoopStatement {
  constructor(body) {
    this.type = "LoopStatement";
    this.body = body;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    let body = [];
    while (!this.isAtEnd()) {
      body.push(this.declaration());
    }
    return new Program(body);
  }

  declaration() {
    if (this.match("LET")) {
      return this.variableDeclaration();
    }

    if (this.match("LOOP")) {
      return this.loopStatement();
    }

    throw new Error(`Unexpected token ${this.peek() ? this.peek()[0] : "EOF"}`);
  }

  variableDeclaration() {
    let name = this.consume("IDENT", "Expected variable name");
    this.consume("ASSIGN", 'Expected "=" after variable name');
    let initializer = this.expression();
    this.consume("SEMICOLON", 'Expected ";" after variable declaration');

    return new VariableDeclaration(new Identifier(name[1]), initializer);
  }

  expression() {
    if (this.match("STRING")) {
      return new Literal(this.previous()[1]);
    }

    throw new Error(`Unexpected token ${this.peek() ? this.peek()[0] : "EOF"}`);
  }

  block() {
    let body = [];
    this.consume("LBRACE", 'Expected "{" at the start of block');
    while (!this.check("RBRACE") && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    this.consume("RBRACE", 'Expected "}" at the end of block');
    return new BlockStatement(body);
  }

  loopStatement() {
    this.consume("LOOP", 'Expected "loop"');
    let body = this.block();
    return new LoopStatement(body);
  }

  match(...types) {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) {
      return this.advance();
    }

    throw new Error(message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek()[0] === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }
  

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

export default Parser;
