'use client';
import { useEffect, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import AddSocialModal from './AddSocialMedia';

const SocialMediaTable = () => {
  const [socials, setSocials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    const res = await axios.get('/api/admin/SocialMedia');
    setSocials(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/SocialMedia`, {
      data: { id },
    });
    toast.success('Deleted successfully');
    fetchSocials();
  };

  const handleToggleStatus = async (id, isHidden) => {
    await axios.patch(`/api/admin/SocialMedia`, { id, isHidden: !isHidden });
    fetchSocials();
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Social Media Links</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Social Media
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Sr No</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">URL</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {socials.map((item, index) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.title}</td>
                <td className="border px-4 py-2">
                  <a href={item.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </td>
                <td className="border px-4 py-2">
                  <button
                    className={`px-2 py-1 text-lg rounded ${
                      item.isHidden ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}
                    onClick={() => handleToggleStatus(item._id, item.isHidden)}
                  >
                    {item.isHidden ? <FaEyeSlash /> : <IoEyeSharp />}
                  </button>
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditData(item);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly cards */}
      <div className="block md:hidden space-y-4">
        {socials.map((item, index) => (
          <div key={item._id} className="border rounded-lg p-4 shadow-sm">
            <div className="mb-2"><strong>Sr No:</strong> {index + 1}</div>
            <div className="mb-2"><strong>Title:</strong> {item.title}</div>
            <div className="mb-2">
              <strong>URL:</strong>{' '}
              <a href={item.url} className="text-blue-500 break-all" target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </div>
            <div className="mb-2 flex items-center">
              <strong className="mr-2">Status:</strong>
              <button
                className={`px-2 py-1 text-lg rounded ${
                  item.isHidden ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
                onClick={() => handleToggleStatus(item._id, item.isHidden)}
              >
                {item.isHidden ? <FaEyeSlash /> : <IoEyeSharp />}
              </button>
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setEditData(item);
                  setShowModal(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded w-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddSocialModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchSocials}
          editData={editData}
        />
      )}
    </div>
  );
};

export default SocialMediaTable;
  