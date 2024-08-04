import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/auth';
import './index.css';
import logo from '../Header/logo.png';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [response, setResponse] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const validateUsername = (event) => {
        const value = event.target.value.trim();
        if (!value) {
            setUsernameError('Username should not be empty');
        } else {
            setUsernameError('');
        }
    };

    const validateEmail = (event) => {
        const value = event.target.value.trim();
        // Add any email validation if needed
        if (!value) {
            setEmailError('Email should not be empty');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = (event) => {
        const value = event.target.value.trim();
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(value)) {
            setPasswordError(
                'Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
            );
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value.trim();
        setConfirmPassword(value);
        if (value !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === 'username') setUsername(value);
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const fetchUser = async (event) => {
        event.preventDefault();

        if (!username || !email || !password || password !== confirmPassword) {
            alert('Please correct the errors before submitting');
            return;
        }

        const data = { username, email, password };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(`${BASE_URL}/SignUp/`, options);

            if (!response.ok) {
                const errorText = await response.text();
                setResponse(errorText);
                setSuccess(false);
                console.log('Error:', errorText);
                return;
            }

            const responseText = await response.text();
            setResponse(responseText);
            setSuccess(true);
            console.log(responseText);

            // Redirect to Sign In page on successful signup
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="containerBox">
            <div className="keeplogoBox keeplogoBoxSign">
                <img className="keeplogo keeplogoSign" src={logo} alt="logo" />
                <p className="keeplogotxt keeplogotxtSign">Keep Notes</p>
            </div>
            {!success ? (
                <form className="form-Group" onSubmit={fetchUser}>
                    <label htmlFor="username">Username</label>
                    <input
                        className="SignIninput"
                        id="username"
                        type="text"
                        placeholder="Enter the Username"
                        onBlur={validateUsername}
                        onChange={handleInputChange}
                    />
                    {usernameError && (
                        <div className="error">{usernameError}</div>
                    )}

                    <label htmlFor="email">Email</label>
                    <input
                        className="SignIninput"
                        id="email"
                        type="text"
                        placeholder="Enter the Email"
                        onBlur={validateEmail}
                        onChange={handleInputChange}
                    />
                    {emailError && <div className="error">{emailError}</div>}

                    <label htmlFor="password">Password</label>
                    <input
                        className="SignIninput"
                        id="password"
                        type="password"
                        placeholder="Enter the Password"
                        onBlur={validatePassword}
                        onChange={(event) => {
                            handleInputChange(event);
                            validatePassword(event);
                        }}
                    />
                    {passwordError && (
                        <div className="error">{passwordError}</div>
                    )}

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className="SignIninput"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleConfirmPasswordChange}
                    />
                    {confirmPasswordError && (
                        <div className="error">{confirmPasswordError}</div>
                    )}

                    <button className="signInBtn" type="submit">
                        Sign Up
                    </button>
                    <p>
                        Already have an account? <Link to="/">Sign In</Link>
                    </p>
                    <p className={success ? 'responseEl' : 'responseElF'}>
                        {response}
                    </p>
                </form>
            ) : (
                <p className="responseEl">
                    {response}
                    <Link to="/"> Click Here to Sign In</Link>
                </p>
            )}
        </div>
    );
};

export default SignUp;
