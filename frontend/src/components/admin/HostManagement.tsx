import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blockHost, fetchHosts, unblockHost, approveHost, rejectHost } from "../../store/slices/adminSlice";
import { RootState } from "../../store/index";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  const iconMap = {
    success: <FaCheckCircle className="mr-2" />,
    error: <FaTimesCircle className="mr-2" />,
    warning: <FaExclamationCircle className="mr-2" />
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center ${bgColorMap[type]} text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out`}
    >
      {iconMap[type]}
      {message}
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmButtonClass = "bg-blue-500"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${confirmButtonClass}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const HostManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { hostInfo: hosts, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHosts, setFilteredHosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  // Modal states
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Toast states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    dispatch(fetchHosts({ page }) as any);
  }, [dispatch, page]);

  useEffect(() => {
    if (Array.isArray(hosts)) {
      if (searchTerm.trim() === "") {
        setFilteredHosts(hosts);
      } else {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = hosts.filter((host: any) =>
          (host.name && host.name.toLowerCase().includes(lowercasedTerm)) ||
          (host.email && host.email.toLowerCase().includes(lowercasedTerm)) ||
          (host.phone && host.phone.toLowerCase().includes(lowercasedTerm))
        );
        setFilteredHosts(filtered);
      }
    }
  }, [searchTerm, hosts]);

  const handleBlock = (hostId: string) => {
    dispatch(blockHost(hostId) as any);
    setToast({ message: `Host blocked successfully`, type: 'success' });
  };

  const handleUnblock = (hostId: string) => {
    dispatch(unblockHost(hostId) as any);
    setToast({ message: `Host unblocked successfully`, type: 'success' });
  };

  const handleApproveClick = (host: any) => {
    setSelectedHost(host);
    setShowApproveModal(true);
  };

  const handleRejectClick = (host: any) => {
    setSelectedHost(host);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = () => {
    if (selectedHost?._id) {
      dispatch(approveHost({ hostId: selectedHost._id }) as any);
      setToast({ message: `Host ${selectedHost.name} approved successfully`, type: 'success' });
    }
  };

  const handleRejectConfirm = () => {
    if (selectedHost?._id) {
      dispatch(rejectHost(selectedHost._id) as any);
      setToast({ message: `Host ${selectedHost.name} rejected successfully`, type: 'error' });
    }
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
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
                <th className="py-2 px-4 bg-blue-200">Registration Date</th>
                <th className="py-2 px-4 bg-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredHosts) && filteredHosts.length > 0 ? (
                filteredHosts.map((host: any, index: number) => (
                  <tr key={host._id} className={`text-center ${!host.approved && !host.verified ? 'bg-yellow-50' : ''}`}>
                    <td className="border px-5 py-3">{index + 1 + (page - 1) * 5}</td>
                    <td className="border px-4 py-2">{host.name}</td>
                    <td className="border px-4 py-2">{host.email}</td>
                    <td className="border px-4 py-2">{host.phone}</td>
                    <td className="border px-4 py-2">
                      <span className={`px-5 py-1 rounded-full shadow-sm shadow-black text-white 
  ${host.approved ? "bg-green-500" :
                          host.rejected ? "bg-red-500" :
                            host.verified ? "bg-yellow-500" : "bg-gray-500"}`}>
                        {host.approved ? "Approved" :
                          host.rejected ? "Rejected" :
                            host.verified ? "Pending" : "New"}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(host.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      {!host.approved && (
                        <>
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded shadow-md shadow-gray-800 hover:bg-green-600"
                            onClick={() => handleApproveClick(host)}
                          >
                            Approve Host
                          </button>

                          <button
                            onClick={() => handleRejectClick(host)}
                            className="px-4 py-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
                          >
                            <FaTimesCircle className="inline mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className={`px-4 py-1 rounded shadow-md text-white 
                          ${host.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                        onClick={() => host.isBlocked ? handleUnblock(host._id) : handleBlock(host._id)}
                      >
                        {host.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No Hosts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between my-9">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Host"
        message={`Are you sure you want to approve ${selectedHost?.name}?`}
        confirmText="Approve"
        confirmButtonClass="bg-green-500 hover:bg-green-600"
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Host"
        message={`Are you sure you want to reject ${selectedHost?.name}?`}
        confirmText="Reject"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
}

export default HostManagement;