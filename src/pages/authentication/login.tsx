import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginResponse {
    // Define the login response interface as per your requirements.
    // I'm just using a generic `data` property here.
    data: unknown;
}

interface ErrorResponse {
    error: string;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken'); // get the CSRF token from your cookies

        setError('');

        const LOGIN_URL = 'http://localhost:8000/quiz/login/';

        // Log the form input values before sending them
        console.log('Form input values:', { username, password });

        try {
            const response: Response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken !== null ? csrftoken : '',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            // If the response is not OK, throw an error so that it will be caught by the catch block
            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                throw new Error(errorData.error);
            }

            const data: LoginResponse = await response.json();

            // Log the data object
            console.log("Server response:", data);

            // You can handle the successful login here.
            router.push('/factory');

        } catch (error: any) {
            if (error instanceof Response) {
                const statusCode = error.status;
                const errorResponse: ErrorResponse = await error.json();
                const errorMessage = errorResponse?.error ?? 'Unknown error';

                console.log('Error response:', error);
                console.log('Error message:', errorMessage);

                if (statusCode === 401) {
                    setError('Username or password is incorrect');
                } else {
                    setError(`Error: ${errorMessage} (Status: ${statusCode})`);
                }
            } 
            
            if (error instanceof SyntaxError) {
                setError('Invalid JSON data received from the server.');
                console.log('Invalid JSON data:', error);
            }

            else {
                setError('An unknown error occurred.');
            }

        }
    };

    // function to get the CSRF token from the cookies
    const getCookie = (name: string) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === `${name}=`) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    return (
        <React.Fragment>
            <main className='grid'>
                <form onSubmit={handleLogin} className="w-96 mx-auto mt-8 bg-gray-200 rounded-lg p-6">
                    {error && <div className="bg-red-100 text-red-900 py-1 px-2 rounded mb-4">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="cursor-pointer opacity-75 absolute right-2 top-2 p-1" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-700">Login</button>

                    <div className='my-5 text-xs justify-center flex gap-x-2' >Don't have an account?<Link className='opacity-65 hover:no-underline underline underline-offset-2 duration-300' href='/authentication/signup'>Create one!</Link></div>
                </form>
            </main>
        </React.Fragment>
    );
};

export default Login;