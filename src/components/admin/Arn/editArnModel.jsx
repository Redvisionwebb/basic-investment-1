'use client';
import axios from 'axios';
import { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditArnModal = ({ onClose, arnData }) => {
  const [formData, setFormData] = useState({
    id: arnData._id,
    arn: arnData.arn,
    registrationDate: arnData.registrationDate?.slice(0, 10) || '',
    expiryDate: arnData.expiryDate?.slice(0, 10) || '',
    euins: arnData.euins || [],
  });
  const [loading, setLoading] = useState(false);

  const handleEuinChange = (index, field, value) => {
    const euins = [...formData.euins];
    euins[index][field] = value;
    setFormData({ ...formData, euins });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`, formData);
      toast.success('ARN updated successfully ✅');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update ARN ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-4 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit ARN</h3>
          <button className="text-red-500 text-2xl" onClick={onClose}>
            <IoCloseSharp />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* ARN Details */}
          <div>
            <label className="block font-medium mb-1 text-sm">ARN Number</label>
            <input
              type="text"
              value={formData.arn}
              onChange={(e) => setFormData({ ...formData, arn: e.target.value })}
              className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Registration Date</label>
              <input
                type="date"
                value={formData.registrationDate}
                onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                required
                className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
                className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
              />
            </div>
          </div>

          {/* EUIN List */}
          {formData.euins.map((euin, index) => (
            <div key={index} className="border rounded-md p-3 bg-gray-50">
              <label className="block font-medium mb-1 text-sm">EUIN</label>
              <input
                type="text"
                value={euin.euin}
                onChange={(e) => handleEuinChange(index, 'euin', e.target.value)}
                className="border border-gray-400 w-full rounded-md p-2 text-sm mb-2 focus:ring-2 focus:ring-[#2367f8]"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-sm">Registration Date</label>
                  <input
                    type="date"
                    value={euin.registrationDate?.slice(0, 10) || ''}
                    onChange={(e) => handleEuinChange(index, 'registrationDate', e.target.value)}
                    className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm">Expiry Date</label>
                  <input
                    type="date"
                    value={euin.expiryDate?.slice(0, 10) || ''}
                    onChange={(e) => handleEuinChange(index, 'expiryDate', e.target.value)}
                    className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArnModal;
