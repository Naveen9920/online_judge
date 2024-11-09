import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';
//import 'prismjs/components/prism-java';
import '../App.css';

function Compiler() {
  /*const [code, setCode] = useState(`
    import java.util.*;
    public class Main { 
      public static void main(String[] args) { 
        Scanner sc = new Scanner(System.in);
        int c = sc.nextInt();
        int d = sc.nextInt();
        System.out.println(c + d);
      }
    }
    `);

  const [input, setInput] = useState(''); // State for user input
  const [output, setOutput] = useState('');

  const handleSubmit = async () => {
    const payload = {
      language: 'java',
      code,
      input // Pass input along with the code to the backend
    }; */
    const [code, setCode] = useState(`#include <iostream> 
      using namespace std;
      // Define the main function
      int main() { 
          // Declare variables
          int num1, num2, sum;
          // Prompt user for input
          cin >> num1 >> num2;  
          // Calculate the sum
          sum = num1 + num2;  
          // Output the result
          cout << "The sum of the two numbers is: " << sum;  
          // Return 0 to indicate successful execution
          return 0;  
      }`);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
  
    const handleSubmit = async () => {
      const payload = {
        language: 'cpp',
        code,
        input
      };

     try {
    const { data } = await axios.post('http://localhost:8080/run', payload);
    setOutput(data.output || '');  // Handle undefined output
  } catch (error) {
    if (error.response && error.response.data.error) {
      setOutput(`Error: ${error.response.data.error}`);
    } else {
      setOutput('Error executing code');
    }
  }
};

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4"> Online Code Compiler</h1>
      <select className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500">
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        <option value='java'>Java</option>
      </select>
      <div className="flex flex-row w-full max-w-5xl space-x-4" style={{ display: 'flex' }}>
        {/* Left side: Code Editor */}
        <div className="flex-1 bg-gray-100 shadow-md" style={{ height: '400px', overflowY: 'auto' }}>
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            //highlight={(code) => highlight(code, languages.java)}
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

        {/* Right side: Input and Output sections */}
        <div className="flex flex-col w-1/3 space-y-4">
          {/* Input Field */}
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

          {/* Output Field */}
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

      {/* Run Button */}
      <button
        onClick={handleSubmit}
        type="button"
        className="mt-4 text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Run
      </button>
    </div>
  );
}

export default Compiler;  