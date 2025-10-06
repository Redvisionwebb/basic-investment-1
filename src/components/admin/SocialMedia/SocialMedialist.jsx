'use client';
import { useEffect, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import AddSocialModal from './AddSocialMedia';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

const SocialMediaTable = () => {
  const [socials, setSocials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // delete confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`);
    setSocials(res.data);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`, {
        data: { id: deleteId },
      });
      toast.success('Deleted successfully');
      fetchSocials();
    } catch (err) {
      toast.error('Error deleting Social Media');
      console.error(err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (id, isHidden) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`, { id, isHidden: !isHidden });
    fetchSocials();
  };

  return (
    <div className="overflow-x-auto flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
      <div className="flex justify-between items-center gap-5 w-full">
        <h3 className="text-xl font-semibold">Social Media Links</h3>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="text-sm text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)] px-5 py-2 rounded-lg"
        >
          Add Social Media
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border border-gray-300 text-left table-auto whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-black/90 font-semibold">Sr No</th>
              <th className="px-4 py-2 border border-gray-300 text-black/90 font-semibold">Title</th>
              <th className="px-4 py-2 border border-gray-300 text-black/90 font-semibold">URL</th>
              <th className="px-4 py-2 border border-gray-300 text-black/90 font-semibold">Status</th>
              <th className="px-4 py-2 border border-gray-300 text-black/90 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {socials.map((item, index) => (
              <tr key={item._id}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link href={item.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className={`px-2 py-1 text-lg rounded ${item.isHidden ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    onClick={() => handleToggleStatus(item._id, item.isHidden)}
                  >
                    {item.isHidden ? <FaEyeSlash /> : <IoEyeSharp />}
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditData(item);
                      setShowModal(true);
                    }}
                    className="text-[var(--rv-admin-bg-color)] border border-[var(--rv-admin-bg-color)] rounded-md p-2"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item._id);
                      setShowConfirm(true);
                    }}
                    className="text-red-600 border border-red-600 rounded-md p-2"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddSocialModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchSocials}
          editData={editData}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <p className="">Are you sure you want to delete this Social Media?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-600"
              >
                {loading ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaTable;
