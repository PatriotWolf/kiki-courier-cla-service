import { ParsedInput } from '../StdinParser';

export interface IParser {
  parse(lines: string[]): ParsedInput;
}
