
export interface TerminalResponse {
  question: string;
  answer: string;
  sources?: string[];
}

export interface TerminalCommand {
  name: string;
  description: string;
  execute: (args: string[]) => string | Promise<string>;
}
