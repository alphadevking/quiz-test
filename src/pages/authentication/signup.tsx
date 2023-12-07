import { useState, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface RegisterResponse {
    // Define the register response interface as per your requirements.
    // I'm just using a generic  `data`  property here.
    data: unknown;
}

interface ErrorResponse {
    error: string;
}

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const router = useRouter()

    const REGISTER_URL = 'http://localhost:8000/quiz/register/';

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const csrftoken = getCookie('csrftoken'); // get the CSRF token from your cookies

        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken !== null ? csrftoken : '',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                throw new Error(errorData.error);
            }

            const data: RegisterResponse = await response.json();
            // You can handle the successful registration here.
            console.log('Registration successful:', data);
            router.push('/authentication/login')

        } catch (error: any) {
            setError(error.message ?? 'Unknown error');
            console.error('Error:', error);

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
        <div className="flex justify-center items-center h-full">
            <div className="bg-gray-100 p-10 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-center text-2xl font-medium mb-4">Create your account!</h2>
                <form onSubmit={handleRegister}>
                    {error && <div className="bg-red-100 p-2 mb-4 text-red-500">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full border border-gray-400 rounded py-2 px-4 appearance-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full border border-gray-400 rounded py-2 px-4 appearance-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full border border-gray-400 rounded py-2 px-4 appearance-none"
                                required
                            />
                            <div className="cursor-pointer opacity-75 absolute right-2 top-2 p-1" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full border border-gray-400 rounded py-2 px-4 appearance-none"
                                required
                            />
                            <div className="cursor-pointer opacity-75 absolute right-2 top-2 p-1" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                        Register
                    </button>
                    <div className='my-5 text-xs justify-center flex gap-x-2' >Already have an account?<Link className='opacity-65 hover:no-underline underline underline-offset-2 duration-300' href='/authentication/login'>Login your account!</Link></div>
                </form>
            </div>
        </div>
    );
};
export default Signup;