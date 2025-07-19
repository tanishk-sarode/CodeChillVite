export interface User {
  id: string;
  username: string;
}

export interface SocketData {
  roomId: string;
  code?: string;
  language?: number;
  input?: string;
  output?: string;
  username?: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface CodeEditorProps {
  code: string;
  onChange: (_value: string) => void;
  language: number;
  theme: string;
}

export interface EditorProps {
  roomId: string;
}

export interface AppProps {
  theme?: string;
  setTheme?: (_theme: string) => void;
}

export interface UseCodeEditorProps {
  roomId: string;
}

export interface UseCodeEditorReturn {
  language: number;
  code: string;
  input: string;
  output: string;
  loading: boolean;
  handleLangChange: (_langId: number) => void;
  runCode: () => void;
  handleCodeChange: (_code: string) => void;
  setInput: (_input: string) => void;
  clearOutput: () => void;
  resetAll: () => void;
} 