// Editor.jsx
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import type { Extension } from '@codemirror/state';

import useCodeEditor, { languages } from './hooks/useCodeEditor';
import type { EditorProps } from './types';

const extensionsMap: Record<number, () => Extension> = {
  54: cpp,
  50: cpp,
  71: python,
  62: java,
  63: javascript,
};

const Editor: React.FC<EditorProps> = ({ roomId }) => {
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
    clearOutput,
    resetAll,
  } = useCodeEditor({ roomId });

  const isCollaborative = roomId !== 'local';

  // Track last run timestamp
  const [lastRun, setLastRun] = useState<string | null>(null);

  // When runCode is called, update lastRun
  const handleRunCode = async () => {
    setLastRun(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    await runCode();
  };

  // Clear output and timestamp
  const handleClearOutput = () => {
    setLastRun(null);
    clearOutput();
  };

  // Reset all (code, input, output, language)
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all code, input, and output? This cannot be undone.')) {
      setLastRun(null);
      resetAll();
    }
  };

  const testApiKey = () => {
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    console.log('API Key exists:', !!rapidApiKey);
    console.log('API Key length:', rapidApiKey?.length);
    alert(`API Key exists: ${!!rapidApiKey}\nLength: ${rapidApiKey?.length || 0}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', width: '100%' }}>
      <div className="top-bar">
        <select
          value={language}
          onChange={(e) => handleLangChange(parseInt(e.target.value))}
          style={{ padding: '8px', borderRadius: '4px', marginRight: '10px' }}
        >
          {languages.map((lang: any) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <button 
          onClick={handleRunCode}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '4px',
            backgroundColor: loading ? '#666' : '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
        <button 
          onClick={testApiKey}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '4px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Test API Key
        </button>
        {isCollaborative && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '14px',
            color: '#4CAF50'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50'
            }}></div>
            <span>Collaborative Mode</span>
          </div>
        )}
      </div>

      <div className="ide-body" style={{ width: '100%' }}>
        <div className="editor-wrapper" style={{ width: '100%' }}>
          <div className="editor" style={{ height: '100%', width: '100%' }}>
            <CodeMirror
              value={code}
              height="100%"
              theme={dracula}
              extensions={[extensionsMap[language]()]}
              onChange={(val) => handleCodeChange(val)}
              style={{ height: '100%', width: '100%', fontSize: '14px' }}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
            />
          </div>
        </div>

        <div className="output-wrapper">
          <div>
            <strong>Input:</strong>
            <textarea
              className="custom-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
            />
          </div>
          
          <div>
            <strong>Output:</strong>
            <div className="output-box">
              {output || 'Output will appear here...'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              {lastRun && (
                <span style={{ fontSize: '12px', color: 'var(--text-color)', opacity: 0.7 }}>
                  Last run at: {lastRun}
                </span>
              )}
              <button
                onClick={handleClearOutput}
                style={{
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: '1px solid #f44336',
                  background: '#f44336',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                Clear Output
              </button>
             <button
               onClick={handleResetAll}
               style={{
                 padding: '4px 10px',
                 borderRadius: '3px',
                 border: '1px solid #ff9800',
                 background: '#ff9800',
                 color: '#fff',
                 fontWeight: 600,
                 fontSize: '12px',
                 cursor: 'pointer',
               }}
             >
               Reset All
             </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
