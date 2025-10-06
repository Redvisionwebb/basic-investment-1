'use client';

import { useState, useEffect } from 'react';
import AddArnModal from './arnModel';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import Loader from '../common/Loader';

const ArnList = () => {
  const [arnData, setArnData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // 🔹 For delete confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchArnData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`);
      setArnData(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch ARN data');
      console.error('Failed to fetch ARN data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArnData();
  }, []);

  const handleAddClick = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    fetchArnData(); // Refresh after modal closes
  };

  // 🔹 Trigger confirm modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // 🔹 Perform delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`, {
        data: { id: deleteId },
      });
      toast.success('ARN deleted successfully');
      fetchArnData();
    } catch (err) {
      toast.error('Failed to delete ARN');
      console.error('Failed to delete ARN:', err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
      <div className="flex justify-between items-center gap-5 w-full">
        <h3 className="text-xl font-bold">All ARN List</h3>
        <button
          className="text-sm text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)] px-5 py-2 rounded-lg"
          onClick={handleAddClick}
        >
          Add ARN AUIN Number
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        {loading ? (
          <div className="">
            <Loader  />
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full border border-gray-300 text-left table-auto whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 font-semibold">SR No.</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">ARN NO.</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">EUIN NO.</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Registration Date</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Expiry Date</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {arnData.map((item, arnIndex) =>
                  item.euins.map((euinEntry, euinIndex) => (
                    <tr key={`${item.arn}-${euinEntry.euin}`}>
                      <td className="border border-gray-300 px-4 py-2">
                        {euinIndex === 0 ? arnIndex + 1 : ''}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {euinIndex === 0 ? item.arn : ''}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{euinEntry.euin}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(euinEntry.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(euinEntry.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => confirmDelete(item._id)}
                          className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <AddArnModal onClose={handleClose} />}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <p className="font-medium">Are you sure you want to delete this ARN?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                {deleting && <FaSpinner className="animate-spin h-4 w-4" />}
                {deleting ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ArnList;
