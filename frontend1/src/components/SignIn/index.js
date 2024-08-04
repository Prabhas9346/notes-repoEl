import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';
import { getJwtToken } from '../utils/auth';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (getJwtToken()) {
            navigate('/Notes/');
        }
    }, [navigate]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === 'username') setUsername(value);
        if (id === 'password') setPassword(value);
    };

    const fetchUser = async (event) => {
        event.preventDefault();
        const data = { username, password };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(
                'https://aposanabackendnotes.onrender.com/SignIn/',
                options
            );

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage(errorText);
                console.log('Error:', errorText);
                return;
            }

            const receivedData = await response.json();
            const { jwtToken } = receivedData;
            console.log(jwtToken);

            if (jwtToken) {
                Cookies.set('jwtToken', jwtToken, { expires: 30 });
                navigate('/Notes/');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="containerBox">
            <form className="form-Group" onSubmit={fetchUser}>
                <label htmlFor="username">Username</label>
                <input
                    className="SignIninput"
                    id="username"
                    type="text"
                    placeholder="Enter the Username"
                    onChange={handleInputChange}
                />
                <label htmlFor="password">Password</label>
                <input
                    className="SignIninput"
                    id="password"
                    type="password"
                    placeholder="Enter the Password"
                    onChange={handleInputChange}
                />
                <button className="signInBtn" type="submit">
                    Sign In
                </button>

                <p>
                    Don't have an account?{' '}
                    <Link to="/SignUp">Create a new account</Link>
                </p>
                {errorMessage && (
                    <div className="responseElF">{errorMessage}</div>
                )}
            </form>
        </div>
    );
};

export default SignIn;
