class Lexer {
  // Инициализирует лексер входной строкой.
  constructor(input) {
      this.input = input;
      this.position = 0; // текущая позиция
      this.readPosition = 0; // позиция следующего символа
      this.ch = '';
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
// Основная функция. Проходит по вводу, пропуская пробелы и получая токены, пока не будет достигнут конец ввода. Возвращает массив токенов.
  tokenize() {
      while (this.ch !== null) {
          this.skipWhitespace();
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

      if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = this.lookupIdent(literal);
          return { type, literal };
      }

      if (this.isDigit(this.ch)) {
          return { type: 'NUMBER', literal: this.readNumber() };
      }

      switch (this.ch) {
          case '=':
              return { type: 'ASSIGN', literal: '=' };
          case ';':
              return { type: 'SEMICOLON', literal: ';' };
          case '(':
              return { type: 'LPAREN', literal: '(' };
          case ')':
              return { type: 'RPAREN', literal: ')' };
          case '{':
              return { type: 'LBRACE', literal: '{' };
          case '}':
              return { type: 'RBRACE', literal: '}' };
          case '[':
              return { type: 'LBRACKET', literal: '[' };
          case ']':
              return { type: 'RBRACKET', literal: ']' };
          case ',':
              return { type: 'COMMA', literal: ',' };
          default:
              return { type: 'ILLEGAL', literal: this.ch };
      }
  }
// Считывает идентификатор (например, имена переменных, ключевые слова). Перемещает позицию, пока символы являются допустимыми символами идентификатора (буквы, подчеркивания).
  readIdentifier() {
      const start = this.position;
      while (this.isLetter(this.ch)) {
          this.readChar();
      }
      return this.input.slice(start, this.position);
  }
// Считывает число. Перемещает позицию, пока символы являются цифрами.
  readNumber() {
      const start = this.position;
      while (this.isDigit(this.ch)) {
          this.readChar();
      }
      return this.input.slice(start, this.position);
  }
// Проверяет, является ли символ буквой (a-z, A-z) или подчеркиванием. Используется для определения допустимых символов для идентификаторов.
  isLetter(ch) {
      return /[a-zA-Z_]/.test(ch);
  }
// Проверяет, является ли символ цифрой (0–9). Используется для определения допустимых символов для чисел.
  isDigit(ch) {
      return /[0-9]/.test(ch);
  }
// Ищет тип идентификатора на основе предопределенных ключевых слов. Возвращает тип токена для ключевых слов или IDENT для обычных идентификаторов.
  lookupIdent(ident) {
      const keywords = {
          'let': 'LET',
          'int': 'INT',
          'float': 'FLOAT',
          'str': 'STR',
          'bool': 'BOOL',
          'char': 'CHAR',
          'arr': 'ARR',
          'list': 'LIST',
          'dict': 'DICT',
          'struct': 'STRUCT',
          'loop': 'LOOP',
          'repeat': 'REPEAT',
          'while': 'WHILE',
          'for': 'FOR',
          'in': 'IN',
          'function': 'FUNCTION',
      };
      return keywords[ident] || 'IDENT';
  }
}

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
const input = `
let x = 5; // x
let y: int = 10; / y
`;

const lexer = new Lexer(input);
const tokens = lexer.tokenize();
console.log(tokens);


