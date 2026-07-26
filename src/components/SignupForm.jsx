import { useState } from 'react'
import { FaEye, FaEyeSlash, FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.jsx';
import { register } from '../services/AuthService.js';

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await register(email, password);

            result.status == "error"
                ? alert("error")
                : navigate("/login")

        } catch (error) {
            alert(error)

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='relative w-[400px] text-white shadow-2xl bg-white/10 p-8 border border-white/20 rounded-2xl backdrop-blur-xl'>
            <h2 className='relative text-3xl text-center mb-6 font-bold'>Create an account</h2>

            <div className='flex justify-evenly'>
                <button className='w-full py-3 flex gap-3 bg-white items-center justify-center border rounded-xl text-medium text-gray-600'>
                    <FcGoogle size={20} />
                    Google
                </button>
                <div className='w-5'></div>
                <button className='w-full py-3 flex gap-3 bg-white items-center justify-center border rounded-xl text-medium text-gray-600'>
                    <FaFacebook className='text-blue-600' />
                    Facebook
                </button>
            </div>

            <div className="text-center text-md text-white text-bold mt-2 mb-4">
                Or
            </div>

            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                    <label className="text-medium text-white">Email</label>
                    <input
                        type="email"
                        placeholder="username@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full mt-1 px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-medium text-white">Password</label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 pr-10 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            disabled={isLoading}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        w-full py-2 mt-7 rounded-md 
                        bg-[#003465] hover:bg-blue-800 
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none 
                        transition duration-300 mb-6 
                        text-white font-medium
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <LoadingSpinner size="h-5 w-5" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        'Create an account'
                    )}
                </button>
            </form>

            <div className="text-sm text-center text-gray-300">
                Already Have an Account?{" "}
                <Link
                    to='/login'
                    className="text-white font-medium hover:underline"
                >
                    Log in
                </Link>
            </div>
        </div>
    )
}