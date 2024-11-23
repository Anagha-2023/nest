import { Link, useLocation } from "react-router-dom"

const RegistrationPending: React.FC = () => {
  const location = useLocation();
  const message = location.state?.message || "Your Registration is pending Admin Approval.You w'll get an email once admin approved your request.";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-blue-500 to-blue-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Registration Pending</h2>
        <p className="text-lg text-center text-gray-600 mb-4">{message}</p>
        {/* <p className="text-md text-center text-gray-500">
          You will receive an email notification once your account is approved.
        </p> */}
        <div className="mt-8 text-center">
          <Link to="/host-login" className="text-blue-600 hover:text-blue-800">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPending;