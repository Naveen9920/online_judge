import React, { useState, useEffect } from 'react';
import Compiler from './Compiler';

const ProblemsPage = () => {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/problems')
            .then((response) => response.json())
            .then((data) => setProblems(data))
            .catch((error) => console.error('Error fetching problems:', error));
    }, []);

    const handleProblemClick = (problem) => {
        setSelectedProblem(problem);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold my-4">Problems List</h2>
            <ul className="w-full max-w-lg">
                {problems.map((problem) => (
                    <li
                        key={problem._id}
                        onClick={() => handleProblemClick(problem)}
                        className="cursor-pointer bg-gray-200 p-2 my-2 rounded hover:bg-gray-300"
                    >
                        {problem.title}
                    </li>
                ))}
            </ul>
            {selectedProblem && (
                <div className="w-full max-w-4xl mt-6">
                    <h3 className="text-xl font-semibold">{selectedProblem.title}</h3>
                    <p>{selectedProblem.description}</p>

                    {/* Displaying Test Cases */}
                    <div className="my-4">
                        <h4 className="text-lg font-semibold mb-2">Test Cases</h4>
                        <ul className="space-y-2">
                            {selectedProblem.testCases.map((testCase, index) => (
                                <li key={index} className="bg-gray-100 p-2 rounded-md">
                                    <p><strong>Input:</strong> {testCase.input}</p>
                                    <p><strong>Expected Output:</strong> {testCase.output}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compiler Component */}
                    <Compiler problemId={selectedProblem._id} />
                </div>
            )}
        </div>
    );
};

export default ProblemsPage;
