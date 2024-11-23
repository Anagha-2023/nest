import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { hostLogin, hostgoogleLogin } from '../../store/slices/hostSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';
import Spinner from '../Spinner';

const HostLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowpassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false)


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hostInfo, loginError, loginLoading } = useSelector((state: RootState)=> state.host)
  const serverError = useSelector((state: RootState) => state.host.error);
  
  useEffect(()=>{
    if(hostInfo) {
      navigate('/host-home');
    }
  },[hostInfo, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(validateForm()){
      setLoading(true)
      try {
        const result = await dispatch(hostLogin({email, password}) as any);
        
        if(result.payload === 'Host is rejected, cannot log in to your account.') {
          setErrors({ email: 'Your host registration has been rejected. Please contact support.' });
        }
      } catch (error) {
        console.error("Login Error:", error); 
      }finally{
        setLoading(false)
      }
    }
  };

  //Google Login
  const handleGoogleLogin = async () => {
    setErrors({});
    setGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      const googleHostData = {
        email:user.email!,
        googleId: user.uid,
      };
      
      const dispatchResult = await dispatch(hostgoogleLogin(googleHostData) as any);
  
      if(dispatchResult.meta.requestStatus === 'fulfilled'){
        navigate('/host-home');
      }else if (dispatchResult.payload === 'You are blocked by Admin, cannot log in to your account.') {
        setErrors({ email: 'You are blocked by Admin, cannot log in to your account.' });
      }else if (dispatchResult.payload === 'Host is rejected, cannot log in to your account.') {
        setErrors({ email: 'Your host registration has been rejected. Please contact support.' });
      }else{
        setErrors({ email: 'Host not found, please register first.' });
      }
    } catch (error) {
      setErrors({ email: 'Something went wrong, please try again' })
    }finally{
      setGoogleLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};

    if(!email.trim()){
      newErrors.email = 'Email is required';
    }

    if(!password.trim()){
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }



  const togglePasswordVisibility = () => {
    setShowpassword(!showpassword)
  }

  return (
    <div className="relative h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      {/* Logo in the top left corner */}
      <img
        src='../src/assets/images/logo_black.png'
        alt='Logo'
        className='absolute top-5 left-5 w-20'
      />
      <div className='grid grid-cols-2 h-screen'>
        <div className='flex justify-center items-center bg-white'>
          <img
            src='../src/assets/images/host illu.avif'
            alt='signup'
            className='w-85 h-85 object-cover md:w-3/4 md:h-auto'
          />
        </div>
        <div className='flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-blue-500'>
          <form className='w-2/3' onSubmit={handleLogin}>
            <h2 className='flex justify-center text-2xl font-bold mb-7 font-serif'>
              Welcome Host!
            </h2>
            {loginError && <p className="text-red-600 text-sm font-semibold text-center mb-4">{loginError}</p>}

            {errors.email && <p className='text-red-500 text-sm font-semibold text-center mb-4'>{errors.email}</p>}
            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md hover:border-blue-300 hover:shadow-2xl focus:border-blue-500 focus:shadow-xl outline-none"
              />
            </div>
            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type={showpassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md hover:border-blue-300 hover:shadow-2xl focus:border-blue-500 focus:shadow-xl outline-none"
              />
              <button
                type='button' onClick={togglePasswordVisibility}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900  hover:text-lg'>
                {showpassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <p onClick={()=>navigate('/forgot-password')} className='flex justify-end  text-1xl font mb-4 text-blue-900 hover:text-white  transition duration-200 ease-in-out hover:scale-95 hover:cursor-pointer'>
              Forgot Password?
              </p>
            <p onClick={()=>navigate('/host-register')} className='flex justify-center mb-6 transition duration-150 ease-in-out text-gray-800 hover:text-blue-950 hover:font-semibold hover:cursor-pointer'>
              Don't have an account? Signup
              </p>
            <div className='flex justify-center'>
              <button
                type='submit'
                className='w-3/4 bg-gradient-to-t from-blue-500 to-indigo-900 text-white text-xl font-bold p-2 rounded-full transform transition duration-500 ease-in-out hover:shadow-lg  hover:from-indigo-900 hover:to-blue-500 active:transition-none active:scale-95'
              >
                Login
              </button>


            </div>
            <p className='flex justify-center mt-6 font-bold'>
              or
              </p>
            <div className='flex justify-center mt-4'>
              <button type='button' onClick={handleGoogleLogin} className='flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-md hover:scale-105 transition duration-300 ease-in-out'>
                <img src='../src/assets/images/google.png' alt='Google logo' className='w-6 h-6 mr-2' />
                {googleLoading ? (
                  <div className="border-4 border-t-transparent border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
                ) : (
                  <>

                    <span className='text-gray-700 font-semibold'>Login with Google</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;
