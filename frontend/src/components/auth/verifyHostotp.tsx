import React, { useState, useEffect, ChangeEvent, KeyboardEvent, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyHostOtp, resendHostOtp } from '../../store/slices/hostSlice';
import { RootState } from '../../store/index';
import { useNavigate } from 'react-router-dom';

const VerifyHostOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [otpError, setOtpError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hostState = useSelector((state: RootState) => state.host);
  console.log('HostState:', hostState);
  
  
  const { error: verifyError, hostInfo, resendLoading, resendSuccess, resendError } = hostState;

  const { email, name, phone, password } = hostInfo.host || {} ;

  console.log("Name:", name);
  console.log("Phone:", phone);
  console.log("Password:", password);
  console.log("hostInfo:",hostInfo);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    
    if (!enteredOtp.trim()) {
        setOtpError("Please Enter OTP!");
        return;
    }
    
    setOtpError(null);
    
    if (email && enteredOtp.length === 6) {
        try {
            const result = await dispatch(verifyHostOtp({
                email,
                otp: enteredOtp,
                name,
                phone,
                password
            })as any);

            if (result.meta.requestStatus === 'fulfilled') { // Check if payload exists
                console.log("OTP verified Successfully");
                navigate("/registration-pending", {
                  state:{
                    message:'Your Registration is Pending admin Approval. You will recieve an amail once your account is approved.'
                  }
                });
            } else {
                console.error("OTP verification failed:", result.error.message);
                setOtpError(result.error.message || "An unknown error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setOtpError("An unknown error occurred. Please try again.");
        }
    }
};


  const handleResendOtp = () => {
    if (email) {
      dispatch(resendHostOtp( email ) as any);
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
      <div className="w-full max-w-lg rounded-lg">
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
              className={`ml-4 text-blue-800 font-normal focus:outline-none ${resendLoading ? 'cursor-not-allowed opacity-50' : ''}`}
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
        {otpError && <div className="error-message">{otpError}</div>}

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
                className="w-16 h-16 border border-gray-300 rounded-xl text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-black"
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
      </div>
    </div>
  );
};

export default VerifyHostOtp;
