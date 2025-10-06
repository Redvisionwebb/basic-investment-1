'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoCloseSharp } from 'react-icons/io5';

const AddSocialModal = ({ onClose, onSuccess, editData }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [id, setId] = useState('');

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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`, { id, title, url });
        if (res.status === 200) {
          toast.success('Social media updated successfully');
        }
      } else {
        // Create request
        const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/SocialMedia`, { title, url });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editData ? 'Edit' : 'Add'} Social Media</h3>
          <button className="text-red-500 text-2xl" onClick={onClose}><IoCloseSharp /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block font-medium mb-1 text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 border-gray-400 flex h-10 w-full  bg-transparent shadow-input rounded-md px-3 py-2 text-sm 
           file:border-0 file:bg-transparent file:text-sm file:font-medium 
           placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
           focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none 
           transition duration-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-2 border-gray-400 flex h-10 w-full  bg-transparent shadow-input rounded-md px-3 py-2 text-sm 
           file:border-0 file:bg-transparent file:text-sm file:font-medium 
           placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
           focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none 
           transition duration-400"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[var(--rv-admin-bg-color)] text-white hover:bg-[var(--rv-admin-bg-color)] rounded-md px-4 py-2">
              {editData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSocialModal;
