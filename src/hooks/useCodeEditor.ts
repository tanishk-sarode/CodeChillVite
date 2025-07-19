import { useState, useEffect } from 'react';
import socket from '../socketClient';
import type { Language, UseCodeEditorProps, UseCodeEditorReturn, SocketData } from '../types';

export const languages: Language[] = [
  { id: 54, name: 'C++ (GCC 9.2.0)' },
  { id: 50, name: 'C (GCC 9.2.0)' },
  { id: 71, name: 'Python (3.8.1)' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
];

// Default sample code for each language
const defaultCode: Record<number, string> = {
  54: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  50: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  71: `print("Hello, World!")`,
  62: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  63: `console.log("Hello, World!");`
};

const useCodeEditor = ({ roomId }: UseCodeEditorProps): UseCodeEditorReturn => {
  const [language, setLanguage] = useState(54); // Default to C++
  const [code, setCode] = useState(defaultCode[54]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const isCollaborative = roomId !== 'local';

  useEffect(() => {
    // Only set up socket listeners for collaborative rooms
    if (!isCollaborative) return;

    socket.on('code-update', (data: SocketData) => {
      if (data.roomId === roomId) {
        setCode(data.code || '');
        setLanguage(data.language || 54);
      }
    });

    socket.on('language-change', (data: SocketData) => {
      if (data.roomId === roomId) {
        setLanguage(data.language || 54);
      }
    });

    socket.on('input-update', (data: SocketData) => {
      if (data.roomId === roomId) {
        setInput(data.input || '');
      }
    });

    socket.on('output-update', (data: SocketData) => {
      if (data.roomId === roomId) {
        setOutput(data.output || '');
        setLoading(false);
      }
    });

    return () => {
      socket.off('code-update');
      socket.off('language-change');
      socket.off('input-update');
      socket.off('output-update');
    };
  }, [roomId, isCollaborative]);

  const handleLangChange = (langId: number) => {
    setLanguage(langId);
    // Set default code for the new language
    setCode(defaultCode[langId] || '');
    if (isCollaborative) {
      socket.emit('language-change', { roomId, language: langId });
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (isCollaborative) {
      socket.emit('code-change', { roomId, code: newCode });
    }
  };

  const handleInputChange = (newInput: string) => {
    setInput(newInput);
    if (isCollaborative) {
      socket.emit('input-change', { roomId, input: newInput });
    }
  };

  const clearOutput = () => {
    setOutput('');
    if (isCollaborative) {
      socket.emit('output-update', { roomId, output: '' });
    }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('Running code...');

    try {
      const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
      
      console.log('RapidAPI Key exists:', !!rapidApiKey);
      console.log('Language ID:', language);
      console.log('Code:', code);
      console.log('Input:', input);
      
      if (!rapidApiKey) {
        setOutput('Error: VITE_RAPIDAPI_KEY not found in environment variables. Please check your .env file.');
        setLoading(false);
        return;
      }

      // Create submission
      const createResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: language,
          source_code: code,
          stdin: input
        })
      });

      console.log('Create submission response status:', createResponse.status);
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Create submission error:', errorText);
        setOutput(`Error creating submission: ${createResponse.status} - ${errorText}`);
        setLoading(false);
        return;
      }

      const createData = await createResponse.json();
      console.log('Create submission response:', createData);
      
      if (!createData.token) {
        setOutput('Error: No token received from Judge0 API');
        setLoading(false);
        return;
      }

      // Poll for results
      let attempts = 0;
      const maxAttempts = 20; // Increased timeout
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Poll every 1.5 seconds
        
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for token: ${createData.token}`);
        
        const getResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${createData.token}?base64_encoded=false`, {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });

        if (!getResponse.ok) {
          const errorText = await getResponse.text();
          console.error('Get submission error:', errorText);
          setOutput(`Error getting submission: ${getResponse.status} - ${errorText}`);
          setLoading(false);
          return;
        }

        const getData = await getResponse.json();
        console.log('Get submission response:', getData);
        
        if (getData.status?.id > 2) { // Status > 2 means processing is complete
          let resultOutput = '';
          if (getData.status?.id === 3) { // Accepted
            resultOutput = getData.stdout || 'Program executed successfully (no output)';
          } else if (getData.status?.id === 4) { // Wrong Answer
            resultOutput = `Wrong Answer\nExpected: ${getData.expected_output}\nGot: ${getData.stdout}`;
          } else if (getData.status?.id === 5) { // Time Limit Exceeded
            resultOutput = 'Time Limit Exceeded';
          } else if (getData.status?.id === 6) { // Compilation Error
            resultOutput = `Compilation Error:\n${getData.compile_output}`;
          } else if (getData.status?.id === 7) { // Runtime Error
            resultOutput = `Runtime Error:\n${getData.stderr}`;
          } else {
            resultOutput = `Error: ${getData.status?.description || 'Unknown error'}`;
          }
          
          setOutput(resultOutput);
          
          // Sync output to other users in collaborative mode
          if (isCollaborative) {
            socket.emit('output-update', { roomId, output: resultOutput });
          }
          break;
        }
        
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        const timeoutMessage = 'Error: Timeout waiting for code execution. Please try again.';
        setOutput(timeoutMessage);
        if (isCollaborative) {
          socket.emit('output-update', { roomId, output: timeoutMessage });
        }
      }

    } catch (error) {
      console.error('Error running code:', error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
      setOutput(errorMessage);
      if (isCollaborative) {
        socket.emit('output-update', { roomId, output: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setLanguage(54);
    setCode(defaultCode[54]);
    setInput('');
    setOutput('');
    if (isCollaborative) {
      socket.emit('language-change', { roomId, language: 54 });
      socket.emit('code-change', { roomId, code: defaultCode[54] });
      socket.emit('input-change', { roomId, input: '' });
      socket.emit('output-update', { roomId, output: '' });
    }
  };

  return {
    language,
    code,
    input,
    output,
    loading,
    handleLangChange,
    runCode,
    handleCodeChange,
    setInput: handleInputChange,
    clearOutput,
    resetAll,
  };
};

export default useCodeEditor; 