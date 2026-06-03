import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CodeExample } from '../../../core/models/architecture-pattern.model';

export interface Token {
  type:
    | 'keyword'
    | 'string'
    | 'comment'
    | 'number'
    | 'type'
    | 'function'
    | 'operator'
    | 'punctuation'
    | 'plain';
  value: string;
}

const TS_KEYWORDS = new Set([
  'abstract', 'as', 'async', 'await', 'break', 'case', 'catch', 'class',
  'const', 'constructor', 'continue', 'debugger', 'declare', 'default',
  'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally',
  'for', 'from', 'function', 'get', 'if', 'implements', 'import', 'in',
  'instanceof', 'interface', 'let', 'module', 'namespace', 'new', 'null',
  'of', 'override', 'private', 'protected', 'public', 'readonly', 'return',
  'set', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'type',
  'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
]);

const TS_TYPES = new Set([
  'any', 'boolean', 'never', 'number', 'object', 'string', 'symbol',
  'unknown', 'Promise', 'Array', 'Record', 'Partial', 'Required',
  'Readonly', 'Pick', 'Omit', 'Exclude', 'Extract', 'NonNullable',
  'ReturnType', 'InstanceType', 'Parameters',
]);

export function tokenize(code: string): Token[][] {
  const lines = code.split('\n');
  let inBlockComment = false;
  return lines.map(line => {
    const [tokens, nextState] = tokenizeLine(line, inBlockComment);
    inBlockComment = nextState;
    return tokens;
  });
}

function tokenizeLine(line: string, inBlockComment: boolean): [Token[], boolean] {
  const tokens: Token[] = [];
  let i = 0;

  // If we're already inside a block comment, consume until */ or end of line
  if (inBlockComment) {
    const closeIdx = line.indexOf('*/', i);
    if (closeIdx === -1) {
      // Entire line is still inside the block comment
      tokens.push({ type: 'comment', value: line });
      return [tokens, true];
    } else {
      // Found the closing */; emit up to and including */
      tokens.push({ type: 'comment', value: line.slice(0, closeIdx + 2) });
      i = closeIdx + 2;
      inBlockComment = false;
      // Fall through to continue tokenizing the rest of the line
    }
  }

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // Block comment open
    if (line[i] === '/' && line[i + 1] === '*') {
      const closeIdx = line.indexOf('*/', i + 2);
      if (closeIdx === -1) {
        // Block comment extends past this line
        tokens.push({ type: 'comment', value: line.slice(i) });
        return [tokens, true];
      } else {
        // Block comment closes on same line
        tokens.push({ type: 'comment', value: line.slice(i, closeIdx + 2) });
        i = closeIdx + 2;
        continue;
      }
    }

    // String: single quote, double quote, backtick
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let j = i + 1;
      // Backtick strings can span lines; for single-line we just consume to end or closing backtick
      while (j < line.length) {
        if (line[j] === '\\') { j += 2; continue; }
        if (line[j] === quote) { j++; break; }
        j++;
      }
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(line[i]) && (i === 0 || !/[a-zA-Z_$]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9._xboXBO]/.test(line[j])) j++;
      tokens.push({ type: 'number', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);

      if (TS_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (TS_TYPES.has(word)) {
        tokens.push({ type: 'type', value: word });
      } else if (j < line.length && line[j] === '(') {
        tokens.push({ type: 'function', value: word });
      } else {
        tokens.push({ type: 'plain', value: word });
      }
      i = j;
      continue;
    }

    // Operator-ish characters
    if (/[=!<>+\-*/%&|^~?]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[=!<>+\-*/%&|^~?]/.test(line[j])) j++;
      tokens.push({ type: 'operator', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Punctuation
    if (/[{}()[\].,;:]/.test(line[i])) {
      tokens.push({ type: 'punctuation', value: line[i] });
      i++;
      continue;
    }

    // Whitespace and everything else — plain
    let j = i;
    while (
      j < line.length &&
      !/[a-zA-Z_$0-9"'`/=!<>+\-*/%&|^~?{}()[\].,;:]/.test(line[j])
    ) j++;
    if (j === i) j++; // consume at least one char to avoid infinite loop
    tokens.push({ type: 'plain', value: line.slice(i, j) });
    i = j;
  }

  return [tokens, false];
}

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.css',
})
export class CodeViewerComponent {
  readonly code = input.required<CodeExample>();

  readonly copied = signal(false);

  readonly tokenizedLines = computed(() =>
    tokenize(this.code().code)
  );

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code().code)
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => {
        // fallback: clipboard API unavailable (e.g. non-HTTPS or permissions denied)
        // The button visually resets after timeout; no state change needed here
      });
  }
}
