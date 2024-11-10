/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = Cookies.get('userId');
    const userEmail = Cookies.get('userEmail');

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    };

    const titleStyle = {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    };

    const buttonStyle = {
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#0d6efd',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const buttonHoverStyle = {
        backgroundColor: '#084298',
        transform: 'scale(1.05)',
    };

   const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Logout failed: ' + response.statusText);
        }

        navigate('/login'); // Redirect to login page after successful logout
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Logout failed. Please try again.');
    }
};


    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Welcome to Your Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-3xl">
                <button
                    onClick={() => navigate('/problems')}
                    className="w-full p-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                >
                    Coding Problems
                </button>
                <button
                    onClick={() => navigate('/competitions')}
                    className="w-full p-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                >
                    Competitions
                </button>
                <button
                    onClick={() => navigate('/compiler')}
                    className="w-full p-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                    Code Compiler
                </button>
                <button
                    style={buttonStyle}
                    onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...buttonHoverStyle })}
                    onMouseLeave={(e) => (e.target.style = buttonStyle)}
                    onClick={handleLogout}
                    className="w-full p-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                
                >
                    Logout
                </button>
            </div>
            
            
        </div>
    );
};

export default Dashboard;
*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = Cookies.get('userId');
    const userEmail = Cookies.get('userEmail');

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '10px', // Adjust gap between buttons
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#0d6efd',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Logout failed: ' + response.statusText);
            }
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <header style={headerStyle}>
                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={() => navigate('/problems')}>Coding Problems</button>
                    <button style={buttonStyle} onClick={() => navigate('/competitions')}>Competitions</button>
                    <button style={buttonStyle} onClick={() => navigate('/compiler')}>Code Compiler</button>
                </div>
                <button style={{ ...buttonStyle, backgroundColor: '#f56565' }} onClick={handleLogout}>Logout</button>
            </header>
            <main className="flex justify-center items-center min-h-screen">
                <h2 className="text-3xl font-semibold text-indigo-600">Welcome to Your Dashboard, {userEmail}!</h2>
            </main>
        </div>
    );
};

export default Dashboard;
