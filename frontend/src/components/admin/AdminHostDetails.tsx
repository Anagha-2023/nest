// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPendingHosts, approveHost, rejectHost } from '../../store/slices/adminSlice';
// import { RootState } from '../../store/index'; // Assuming your store is correctly set up

// const AdminHostDetails: React.FC = () => {
//   const dispatch = useDispatch();
//   const { pendingHosts, loading, error } = useSelector((state: RootState) => state.admin);

//   useEffect(() => {
//     dispatch(fetchPendingHosts() as any);
//   }, [dispatch]);

//   const handleApprove = (hostId: string) => {
//     dispatch(approveHost(hostId)as any);
//   };

//   const handleReject = (hostId: string) => {
//     dispatch(rejectHost(hostId)as any);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Pending Hosts for Verification</h1>
//       {pendingHosts.length === 0 ? (
//         <p>No hosts awaiting approval.</p>
//       ) : (
//         pendingHosts.map((host) => (
//           <div key={host._id} className="host-card">
//             <p>Name: {host.name}</p>
//             <p>Email: {host.email}</p>
//             <p>Phone: {host.phone}</p>
//             <button onClick={() => handleApprove(host._id)}>Approve</button>
//             <button onClick={() => handleReject(host._id)}>Reject</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdminHostDetails;
