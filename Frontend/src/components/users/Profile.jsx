import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit, LogOut, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axios';
import { toast } from 'sonner';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const rawToken = localStorage.getItem('token');

            if (!rawToken) {
                toast.error('No token found. Please login again.');
                navigate('/login');
                return;
            }

            try {
                const response = await axiosInstance.get('/profile', {
                    headers: {
                        'Authorization': `Bearer ${rawToken}`
                    },
                    withCredentials: true
                });

                setUser(response.data);
                setEditedName(response.data.fullName);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to fetch profile');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    // Function to get user initials
    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Logout',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    };

    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const handleNameSave = async () => {
        if (!editedName.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        try {
            const response = await axiosInstance.patch('/profile', {
                fullName: editedName
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            });

            setUser({ ...user, fullName: editedName });
            setIsEditingName(false);
            toast.success('Name updated successfully!');
        } catch (error) {
            console.error('Error updating name:', error);
            toast.error('Failed to update name');
            setEditedName(user.fullName);
            setIsEditingName(false);
        }
    };

    const handleNameCancel = () => {
        setEditedName(user.fullName);
        setIsEditingName(false);
    };

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 text-center relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto bg-green-500 flex items-center justify-center text-white text-4xl font-bold">
                            {getInitials(isEditingName ? editedName : user.fullName)}
                        </div>

                        <div className="mt-4">
                            {isEditingName ? (
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="relative w-full max-w-xs">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full text-3xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleNameSave}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                                            title="Save"
                                        >
                                            <Check className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            onClick={handleNameCancel}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                                            title="Cancel"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
                                    <button
                                        onClick={handleNameEdit}
                                        className="mt-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                                        title="Edit name"
                                    >
                                        <Edit className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {user.isAdmin && (
                            <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold bg-green-800 text-white rounded-full">
                                Admin
                            </span>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="p-8">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                    <User className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h2 className="text-lg font-medium text-gray-900">Full Name</h2>
                                    {isEditingName ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-600">{user.fullName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-lg font-medium text-gray-900">Email Address</h2>
                                    <p className="mt-1 text-gray-600">{user.email}</p>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;