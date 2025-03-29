import { Eye, EyeOff, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Food1Image from '../../assets/food1.avif';
import { toast } from 'sonner'
import axiosInstance from '../../config/axios';

const LoginUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/')
        }
    }, [navigate])

    // Formik setup
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axiosInstance.post('/login', values, { withCredentials: true })
                localStorage.setItem('token', response.data.token);
                toast.success('Login Successful!');

                setTimeout(() => {
                    navigate('/')
                }, 500);
            } catch (error) {
                toast.error(error.response?.data?.message || "Login failed. Please try again.");
            } finally {
                setLoading(false);
            }
            console.log('Login Successful:', values);
        },
    });

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Left Side - Food Image */}
            <div className="md:w-1/2 bg-green-500 flex items-center justify-center p-8">
                <div className="max-w-md text-center text-white">
                    <img
                        src={Food1Image}
                        alt="Delicious food"
                        className="rounded-lg shadow-xl mb-6 w-full h-auto"
                    />
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-lg">
                        Sign in to access your recipes, saved favorites, and connect with our food community.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Login to Your Account</h1>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter Your Email"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                                placeholder="••••••••"
                                {...formik.getFieldProps('password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={loading}>
                                {loading ? <Loader size={20} className='animate-spin' /> : "Sign In"}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-green-500 hover:text-green-500 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;
