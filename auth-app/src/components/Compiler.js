import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';

function Compiler({ problemId }) {
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\nint main() {\nint a, b;\ncin >> a >> b;\ncout << a + b;\nreturn 0;\n}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([])

  // Fetch test cases when the component mounts or problemId changes
  useEffect(() => {
    if (problemId) {
      axios.get(`http://localhost:8080/problems/${problemId}`)
        .then((response) => {
          setTestCases(response.data.testCases);
        })
        .catch((error) => console.error('Error fetching test cases:', error));
    }
  }, [problemId]);

  const handleSubmit = async () => {
    const payload = {
      language: 'cpp',
      code,
      input
    };

    try {
      const { data } = await axios.post('http://localhost:8080/run', payload);
      setOutput(data.output || '');
    } catch (error) {
      if (error.response && error.response.data.error) {
        setOutput(`Error: ${error.response.data.error}`);
      } else {
        setOutput('Error executing code');
      }
    }
  };

  const runTestCases = async () => {
    const testCaseResults = [];

    for (const testCase of testCases) {
      const payload = {
        language: 'cpp',
        code,
        input: testCase.input
      };

      try {
        const { data } = await axios.post('http://localhost:8080/run', payload);
        const result = {
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: data.output.trim(),
          passed: data.output.trim() === testCase.output.trim()
        };
        testCaseResults.push(result);
      } catch (error) {
        testCaseResults.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: 'Error executing code',
          passed: false
        });
      }
    }
    setTestResults(testCaseResults);
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Online Code Compiler</h1>
      <select className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500">
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        <option value='java'>Java</option>
      </select>
      <div className="flex flex-row w-full max-w-5xl space-x-4" style={{ display: 'flex' }}>
        <div className="flex-1 bg-gray-100 shadow-md" style={{ height: '400px', overflowY: 'auto' }}>
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: 'none',
              border: 'none',
              backgroundColor: '#f7fafc',
              height: '100%',
              overflowY: 'auto',
            }}
          />
        </div>

        <div className="flex flex-col w-1/3 space-y-4">
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="font-semibold mb-2">Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="5"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter input here..."
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="font-semibold mb-2">Output</h2>
            <div className="outputbox p-2 bg-white border border-gray-300 rounded-md">
              <p style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}>{output}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="mt-4 text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Run
      </button>

      <button
        onClick={runTestCases}
        type="button"
        className="mt-4 text-center inline-flex items-center text-white bg-gradient-to-br from-green-500 to-blue-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Run Test Cases
      </button>

      <div className="mt-6 w-full max-w-3xl">
        <h3 className="text-xl font-semibold">Test Case Results</h3>
        <ul className="space-y-4">
          {testResults.map((result, index) => (
            <li key={index} className={`p-4 rounded-md shadow-md ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              <p><strong>Input:</strong> {result.input}</p>
              <p><strong>Expected Output:</strong> {result.expectedOutput}</p>
              <p><strong>Actual Output:</strong> {result.actualOutput}</p>
              <p><strong>Status:</strong> {result.passed ? 'Passed' : 'Failed'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Compiler;
