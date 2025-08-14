'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddSocialModal = ({ onClose, onSuccess, editData }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [id, setId] = useState('');
  console.log(editData)

  useEffect(() => {
    if (editData) {
        setId(editData._id)
      setTitle(editData.title);
      setUrl(editData.url);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        // Update request
        const res = await axios.post(`/api/admin/SocialMedia`, { id,title, url });
        if (res.status === 200) {
          toast.success('Social media updated successfully');
        }
      } else {
        // Create request
        const res = await axios.post('/api/admin/SocialMedia', { title, url });
        if (res.status === 201) {
          toast.success('Social media added successfully');
        }
      }

      onSuccess(); // refresh data
      onClose(); // close modal
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d2d476e] bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editData ? 'Edit' : 'Add'} Social Media</h3>
          <button className="text-red-500 text-xl" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {editData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSocialModal;
