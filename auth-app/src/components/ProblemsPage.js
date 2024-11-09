import React, { useState, useEffect } from 'react';

const ProblemsPage = () => {
    const [problems, setProblems] = useState([]); // State to hold all problems
    const [selectedProblem, setSelectedProblem] = useState(null); // State to track the selected problem

    // Fetch problems from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:8080/problems')
            .then((response) => response.json())
            .then((data) => setProblems(data))
            .catch((error) => console.error('Error fetching problems:', error));
    }, []);

    // Handle click on a problem title to show its description
    const handleProblemClick = (problem) => {
        setSelectedProblem(problem); // Set the clicked problem as the selected one
    };

    return (
        <div>
            <h2>Problems List</h2>
            <ul>
                {/* Display list of problem titles */}
                {problems.map((problem) => (
                    <li key={problem._id} onClick={() => handleProblemClick(problem)} style={{ cursor: 'pointer' }}>
                        {problem.title}
                    </li>
                ))}
            </ul>

            {/* Display the description of the selected problem if any */}
            {selectedProblem && (
                <div>
                    <h3>{selectedProblem.title}</h3>
                    <p>{selectedProblem.description}</p>
                </div>
            )}
        </div>
    );
};

export default ProblemsPage;
