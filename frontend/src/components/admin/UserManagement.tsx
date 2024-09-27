// src/components/UserManagement.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blockUser, fetchUsers, unblockUser } from "../../store/slices/adminSlice"; // Import the action
import { RootState } from "../../store/index"; // Import RootState
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();

  // Access users and loading/error state from the Redux store
  const { userInfo: users, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.admin);

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // State for filtered users
  const [page, setPage] = useState(1); // State for current page

  useEffect(() => {
    dispatch(fetchUsers({ page }) as any); // Dispatch the action to fetch users with pagination
  }, [dispatch, page]);

  // Update filtered users based on search term
  useEffect(() => {
    if (Array.isArray(users)) {
      if (searchTerm.trim() === "") {
        setFilteredUsers(users);
      } else {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = users.filter((user: any) =>
          (user.name && user.name.toLowerCase().includes(lowercasedTerm)) ||
          (user.email && user.email.toLowerCase().includes(lowercasedTerm)) ||
          (user.phone && user.phone.toLowerCase().includes(lowercasedTerm))
        );
        setFilteredUsers(filtered);
      }
    }
  }, [searchTerm, users]);

  const handleBlock = (userId: string) => {
    dispatch(blockUser(userId) as any);
  };

  const handleUnblock = (userId: string) => {
    dispatch(unblockUser(userId) as any);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Search bar at the utmost top of the screen */}
      <div className="my-4 flex justify-center">
        <div className="relative w-2/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="px-10 py-2 w-full border border-gray-100 rounded-lg shadow-gray-800 shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-950"></div>
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200">Sl. No.</th>
                <th className="py-2 px-4 bg-blue-200">Name</th>
                <th className="py-2 px-4 bg-blue-200">Email</th>
                <th className="py-2 px-4 bg-blue-200">Phone No.</th>
                <th className="py-2 px-4 bg-blue-200">Status</th>
                <th className="py-2 px-4 bg-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                filteredUsers.map((user: any, index: number) => (
                  <tr key={user._id} className="text-center">
                    <td className="border px-5 py-3">{index + 1 + (page - 1) * 8}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.phone}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-5 py-1 rounded-full shadow-sm shadow-black text-white ${user.isVerified ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {user.isVerified ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-8 py-1 rounded shadow-md shadow-gray-800 text-white ${user.isBlocked ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {user.isBlocked ? (
                          <button
                            onClick={() => handleUnblock(user._id)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(user._id)}
                          >
                            Block
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-between my-9">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
