import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/adminSlice'; // Assuming you have a Redux action to handle logout
import { userLogout } from '../store/slices/userSlice';

const useBlockChecker = (applyCheck: boolean) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!applyCheck) return; // Skip block checking if applyCheck is false

    const checkBlockStatus = async () => {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      if (!token) {
        console.error('No token found');
        return;
      }
    
      try {
        const response = await axios.get('/api/users/check-block-status', {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        })
        const isBlocked = response.data.isBlocked;
        console.log('Block Status:',isBlocked);

        if(isBlocked) {
          await dispatch(userLogout() as any).unwrap();
          navigate('/login')
        }
      } catch (error) {
        console.error('Error checking Block Stats:', error);
      }
    };
    

    const intervalId = setInterval(checkBlockStatus, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [applyCheck, dispatch, navigate]);
};

export default useBlockChecker;
