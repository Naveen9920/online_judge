import React, { useEffect, useState } from 'react';

const CompetitionsPage = () => {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/competitions')
            .then((response) => response.json())
            .then((data) => setCompetitions(data))
            .catch((error) => console.error('Error fetching competitions:', error));
    }, []);

    return (
        <div>
            <h2>Competitions List</h2>
            <ul>
            {competitions.map((competition) => (
  <li key={competition.id}>{competition.title}</li> // provide  unique id, title we get grom backend  
))}
            </ul>
        </div>
    );
};

export default CompetitionsPage;
