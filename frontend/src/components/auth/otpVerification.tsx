import React, { useState, useEffect, ChangeEvent, KeyboardEvent, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../../store/slices/userSlice';
import { RootState } from '../../store/index';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [otpError, setOtpError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing user state directly
  const userState = useSelector((state: RootState) => state.user);
  console.log("User state:", userState);
  
  const { error: verifyError, userInfo, resendLoading, resendSuccess, resendError } = userState;

  const {email, name,phone, password} = userInfo.user || {};

  
  console.log("Name:", name);
  console.log("Phone:", phone);
  console.log("Password:", password);
  console.log("userInfo:",userInfo);
  console.log("Extracted email:", email);
  
  useEffect(() => {
    if (timerRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
      if (timer === 0) {
        setTimerRunning(false);
      }
    }

    return () => clearInterval(intervalRef.current!);
  }, [timer, timerRunning]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join('');

    console.log("Email:", email);
    console.log("Entered OTP:", enteredOtp);
    
    if(!enteredOtp.trim()){
      setOtpError('Please Enter OTP!');
      return;
    }

    setOtpError(null);

    if (email && enteredOtp.length === 6) {
      setLoading(true)
      console.log("Verify OTP Button Clicked");
      
      try {
        const result = await dispatch(verifyOtp({ email, otp: enteredOtp, name , phone, password }) as any);
        if(result.meta.requestStatus === 'fulfilled'){
          console.log('OTP verified successfully...');
          navigate('/login')
        }
        
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }finally{
        setLoading(false)
      }
    }
  };

  const handleResendOtp = () => {
    if (email) {
      dispatch(resendOtp(email) as any);
      setTimer(60);
      setTimerRunning(true);
      setOtp(Array(6).fill(''));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-blue-500 to-blue-50">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <div className="w-full max-w-lg rounded-lg ">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          OTP Verification
        </h2>
        <p className="flex justify-between items-center mb-6 font-semibold text-lg">
          <span>Verification code</span>
          <span className="text-blue-600 font-medium text-base">
            {timerRunning ? formatTime(timer) : '00:00'}
          </span>
          {!timerRunning && (
            <button
              type="button"
              onClick={handleResendOtp}
              className={`ml-4 text-blue-800 font-normal focus:outline-none ${
                resendLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={resendLoading}
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </p>

        {resendSuccess && (
          <p className="mt-2 text-green-500 text-center text-lg">
            {resendSuccess}
          </p>
        )}

        {resendError && (
          <p className="mt-2 text-red-500 text-center text-lg">
            {resendError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-16 h-16 border border-gray-300 rounded-xl text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg
                 shadow-black"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-3xl text-xl font-bold mt-8 hover:bg-blue-900 hover:shadow-md hover:shadow-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-slate-800"
              disabled={otp.join('').length !== 6}
            >
              Verify OTP
            </button>
          </div>
        </form>

        {verifyError && (
          <p className="mt-6 text-red-500 text-center text-lg">
            {verifyError === 'Invalid OTP' ? 'Incorrect OTP. Please try again.' : 
             verifyError === 'OTP expired' ? 'The OTP has expired. Please request a new one.' :
             'An unknown error occurred. Please try again.'}
          </p>
        )}

        {/* {userInfo && (
          <p className="mt-6 text-green-500 text-center text-lg">
            Registration successful!
          </p>
        )} */}
      </div>
    </div>
  );
};

export default VerifyOtp;
