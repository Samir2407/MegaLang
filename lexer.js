// Lexer
class Lexer {
  // Инициализирует лексер входной строкой.
  constructor(input) {
    this.input = input;
    this.position = 0; // текущая позиция
    this.readPosition = 0; // позиция следующего символа
    this.line = 1; // текущая строка
    this.column = 0; // текущий столбец в строке
    this.ch = "";
    this.tokens = [];
    this.readChar();
  }

  // Читает текущий символ, обновляя readPosition.
  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;

    if (this.ch === "\n") {
      this.line += 1;
      this.column = -1;
    } else {
      this.column += 1;
    }
  }

  backChar() {
    this.position -= 1;
    this.readPosition -= 1;
    if (this.ch === "\n") {
      this.line -= 1;
    } else {
      this.column -= 1;
    }

    this.ch = this.input[this.position];
  }

  // Возвращает следующий символ без перемещения указателей позиции. Полезно для операций просмотра вперед.
  peekChar() {
    if (this.readPosition >= this.input.length) {
      return null;
    } else {
      return this.input[this.readPosition];
    }
  }

  // Пропускает любые пробельные символы (пробелы, табуляции, новые строки)
  skipWhitespace() {
    while (this.ch !== null && /\s/.test(this.ch)) {
      this.readChar();
    }
  }

  // Пропускает комментарии (от // до конца строки)
  skipComment() {
    if (this.ch === "/" && this.peekChar() === "/") {
      while (this.ch !== null && this.ch !== "\n") {
        this.readChar();
      }
      this.readChar();
      return true;
    }
    return false;
  }

  // Основная функция.
  tokenize() {
    while (this.ch !== null) {
      this.skipWhitespace();
      if (this.skipComment()) {
        continue;
      }
      let token = this.getToken();
      if (token) {
        this.tokens.push(token);
      }
      this.readChar();
    }
    return this.tokens;
  }

  // Определяет токен. Обрабатывает различные символы и конструкции, проверяя определенные условия и используя вспомогательные функции.
  getToken() {
    if (this.ch === null) {
      return null;
    }
    let startColumn = this.column;
    if (this.isLetter(this.ch)) {
      const literal = this.readIdentifier();
      const type = this.lookupIdent(literal);
      return [type, literal, [this.line, startColumn]];
    }

    if (this.isDigit(this.ch)) {
      return ["NUMBER", this.readNumber(), [this.line, startColumn]];
    }

    if (this.ch === `"` || this.ch === `'`) {
      return ["STRING", this.readString(this.ch), [this.line, startColumn]];
    }

    switch (this.ch) {
      case "=":
        return ["ASSIGN", "=", [this.line, startColumn]];
      case ":":
        return ["COLON", ":", [this.line, startColumn]];
      case ";":
        return ["SEMICOLON", ";", [this.line, startColumn]];
      case "(":
        return ["LPAREN", "(", [this.line, startColumn]];
      case ")":
        return ["RPAREN", ")", [this.line, startColumn]];
      case "{":
        return ["LBRACE", "{", [this.line, startColumn]];
      case "}":
        return ["RBRACE", "}", [this.line, startColumn]];
      case "[":
        return ["LBRACKET", "[", [this.line, startColumn]];
      case "]":
        return ["RBRACKET", "]", [this.line, startColumn]];
      case ",":
        return ["COMMA", ",", [this.line, startColumn]];
      case ".":
        return ["DOT", ".", [this.line, startColumn]];
      case "+":
        return ["PLUS", "+", [this.line, startColumn]];
      case "-":
        return ["MINUS", "-", [this.line, startColumn]];
      case "*":
        return ["ASTERISK", "*", [this.line, startColumn]];
      case "/":
        return ["SLASH", "/", [this.line, startColumn]];
      case "!":
        return ["BANG", "!", [this.line, startColumn]];
      case "<":
        return ["LT", "<", [this.line, startColumn]];
      case ">":
        return ["GT", ">", [this.line, startColumn]];
      default:
        console.log(
          "Unexpected character: " +
            this.ch +
            ": " +
            this.input.slice(this.position - 10, this.position + 10)
        );
        return ["ILLEGAL", this.ch, [this.line, startColumn]];
    }
  }

  // Считывает идентификатор (например, имена переменных, ключевые слова). Перемещает позицию, пока символы являются допустимыми символами идентификатора (буквы, подчеркивания).
  readIdentifier() {
    const start = this.position;
    while (this.isAcceptable(this.ch)) {
      this.readChar();
    }
    let result = this.input.slice(start, this.position);
    if (!this.isLetter(this.ch)) {
      this.backChar();
    }
    return result;
  }

  // Считывает число. Перемещает позицию, пока символы являются цифрами.
  readNumber() {
    const start = this.position;
    while (this.isDigit(this.ch) || this.ch === ".") {
      this.readChar();
    }
    let result = this.input.slice(start, this.position);
    if (!this.isDigit(this.ch)) {
      this.backChar();
    }
    return result;
  }

  // Считывает строку. Перемещает позицию, пока символы являются допустимыми символами.
  readString(quoteType) {
    this.readChar(); // пропускаем открывающую кавычку
    const start = this.position;
    let ch = this.ch;
    while (ch !== null && ch !== quoteType) {
      this.readChar();
      ch = this.ch;
    }
    if (ch === null) {
      console.log("Unterminated string literal");
      return "";
    }
    const result = this.input.slice(start, this.position);
    return result;
  }

  // Проверяет, является ли символ буквой (a-z, A-z) или подчеркиванием. Используется для определения допустимых символов для идентификаторов.
  isLetter(ch) {
    return /[a-zA-Z_]/.test(ch);
  }

  // Проверяет, является ли символ цифрой (0–9). Используется для определения допустимых символов для чисел.
  isDigit(ch) {
    return /[0-9]/.test(ch);
  }

  // Проверяет, является ли символ допустимым для идентификатора (буквы, цифры, подчеркивания).
  isAcceptable(ch) {
    return /[a-zA-Z_0-9-]/.test(ch);
  }

  // Ищет тип идентификатора на основе предопределенных ключевых слов. Возвращает тип токена для ключевых слов или IDENT для обычных идентификаторов.
  lookupIdent(ident) {
    const keywords = {
      let: "LET",
      var: "VAR",
      int: "INT",
      float: "FLOAT",
      str: "STR",
      bool: "BOOL",
      char: "CHAR",
      arr: "ARR",
      list: "LIST",
      dict: "DICT",
      struct: "STRUCT",
      loop: "LOOP",
      repeat: "REPEAT",
      while: "WHILE",
      for: "FOR",
      in: "IN",
      fn: "FUNCTION",
    };
    return keywords[ident] || "IDENT";
  }
}

export default Lexer;
