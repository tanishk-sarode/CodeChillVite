import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { dracula } from '@uiw/codemirror-theme-dracula';

export const CodeEditor = ({ code, onChange, language, theme }) => {
  const getLangExtension = () => {
    switch (parseInt(language)) {
      case 50:
      case 54:
        return cpp();
      case 63:
        return javascript();
      case 71:
        return python();
      case 62:
        return java();
      default:
        return cpp(); // default to C++
    }
  };

  return (
    <CodeMirror
      value={code}
      height="400px"
      extensions={[getLangExtension()]}
      theme={theme === 'light' ? 'light' : dracula}
      onChange={(val) => onChange(val)}
    />
  );
};
