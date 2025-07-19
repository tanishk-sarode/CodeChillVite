// Editor.jsx
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';

import useCodeEditor, { languages } from './hooks/useCodeEditor';

const extensionsMap = {
  54: cpp,
  50: cpp,
  71: python,
  62: java,
  63: javascript,
};

const Editor = ({ roomId }) => {
  const {
    language,
    code,
    input,
    output,
    loading,
    handleLangChange,
    runCode,
    handleCodeChange,
    setInput,
  } = useCodeEditor({ roomId });

  return (
    <div>
      <div className="top-bar">
        <select
          value={language}
          onChange={(e) => handleLangChange(parseInt(e.target.value))}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <button onClick={runCode}>{loading ? 'Running...' : 'Run'}</button>
      </div>

      <CodeMirror
        value={code}
        height="80vh"
        theme={dracula}
        extensions={[extensionsMap[language]()]}
        onChange={(val) => handleCodeChange(val)}
      />

      <div>
        <strong>Input:</strong>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="3"
        />

        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
