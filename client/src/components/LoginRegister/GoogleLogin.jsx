import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/loaderSlice';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

const GoogleLogin = ({btnContent}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const responseGoogle = async (authResult) => {
        dispatch(setLoading(true))
        try {
            if (authResult?.code) {
                const response = await authService.googleLogin(authResult.code);
                dispatch(login({
                              user: response.user,
                              token: response.token
                            }));
                toast.success('Google login successful!');
                navigate('/',  { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google login failed');
            console.error('Error during Google Login:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => {
            toast.error('Google login failed');
            console.error('Login Failed:', error);
        },
        flow: 'auth-code',
    });
    
    return (
        <button
            onClick={googleLogin}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:bg-gray-900 bg-white dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-400 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2  focus:ring-gray-300  cursor-pointer"
        >
            <img
                src="https://www.material-tailwind.com/logos/logo-google.png"
                alt="Google"
                className="h-6 w-6"
            />
            {btnContent}
        </button>
    )
}

export default GoogleLogin
