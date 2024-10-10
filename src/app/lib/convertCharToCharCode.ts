export const convertCharToCharCode = (input: string) => {
  let charCode;

  switch (input.toUpperCase()) {
    case '':
      charCode = 0;
      break;
    case 'A':
      charCode = 1;
      break;
    case 'B':
      charCode = 2;
      break;
    case 'C':
      charCode = 3;
      break;
    case 'D':
      charCode = 4;
      break;
    case 'E':
      charCode = 5;
      break;
    case 'F':
      charCode = 6;
      break;
    case 'G':
      charCode = 7;
      break;
    case 'H':
      charCode = 8;
      break;
    case 'I':
      charCode = 9;
      break;
    case 'J':
      charCode = 10;
      break;
    case 'K':
      charCode = 11;
      break;
    case 'L':
      charCode = 12;
      break;
    case 'M':
      charCode = 13;
      break;
    case 'N':
      charCode = 14;
      break;
    case 'O':
      charCode = 15;
      break;
    case 'P':
      charCode = 16;
      break;
    case 'Q':
      charCode = 17;
      break;
    case 'R':
      charCode = 18;
      break;
    case 'S':
      charCode = 19;
      break;
    case 'T':
      charCode = 20;
      break;
    case 'U':
      charCode = 21;
      break;
    case 'V':
      charCode = 22;
      break;
    case 'W':
      charCode = 23;
      break;
    case 'X':
      charCode = 24;
      break;
    case 'Y':
      charCode = 25;
      break;
    case 'Z':
      charCode = 26;
      break;
    case '1':
      charCode = 27;
      break;
    case '2':
      charCode = 28;
      break;
    case '3':
      charCode = 29;
      break;
    case '4':
      charCode = 30;
      break;
    case '5':
      charCode = 31;
      break;
    case '6':
      charCode = 32;
      break;
    case '7':
      charCode = 33;
      break;
    case '8':
      charCode = 34;
      break;
    case '9':
      charCode = 35;
      break;
    case '0':
      charCode = 36;
      break;
    case '!':
      charCode = 37;
      break;
    case '@':
      charCode = 38;
      break;
    case '#':
      charCode = 39;
      break;
    case '$':
      charCode = 40;
      break;
    case '(':
      charCode = 41;
      break;
    case ')':
      charCode = 42;
      break;
    case '-':
      charCode = 44;
      break;
    case '+':
      charCode = 46;
      break;
    case '&':
      charCode = 47;
      break;
    case '=':
      charCode = 48;
      break;
    case ';':
      charCode = 49;
      break;
    case ':':
      charCode = 50;
      break;
    case "'":
      charCode = 52;
      break;
    case '"':
      charCode = 53;
      break;
    case '%':
      charCode = 54;
      break;
    case ',':
      charCode = 55;
      break;
    case '.':
      charCode = 56;
      break;
    case '/':
      charCode = 59;
      break;
    case '?':
      charCode = 60;
      break;
    case '°':
      charCode = 62;
      break;
    default:
      charCode = 0;
  }

  return charCode;
};
