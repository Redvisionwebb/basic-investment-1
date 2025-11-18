'use client';
import axios from 'axios';
import { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddArnModal = ({ onClose }) => {
  const [arn, setArn] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [euins, setEuins] = useState([{ euin: '', registrationDate: '', expiryDate: '' }]);

  const handleAddEuin = () => setEuins([...euins, { euin: '', registrationDate: '', expiryDate: '' }]);
  const handleRemoveEuin = (index) => setEuins(euins.filter((_, i) => i !== index));

  const handleEuinChange = (index, field, value) => {
    const newEuins = [...euins];
    newEuins[index][field] = value;
    setEuins(newEuins);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`, {
        arn,
        registrationDate,
        expiryDate,
        euins,
      });

      if (res.status === 201) {
        toast.success('ARN created successfully ✅');
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create ARN ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-4 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add ARN & EUIN</h3>
          <button className="text-red-500 text-2xl" onClick={onClose}>
            <IoCloseSharp />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* ARN Number */}
          <div>
            <label className="block font-medium mb-1 text-sm">ARN Number</label>
            <input
              type="text"
              value={arn}
              onChange={(e) => setArn(e.target.value)}
              required
              className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
            />
          </div>

          {/* ARN Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Registration Date</label>
              <input
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                required
                className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
              />
            </div>
          </div>

          {/* EUIN Fields */}
          {euins.map((euinData, index) => (
            <div key={index} className="border rounded-md p-3 bg-gray-50">
              <label className="block font-medium mb-1 text-sm">EUIN</label>
              <input
                type="text"
                value={euinData.euin}
                onChange={(e) => handleEuinChange(index, 'euin', e.target.value)}
                className="border border-gray-400 w-full rounded-md p-2 text-sm mb-2 focus:ring-2 focus:ring-[#2367f8]"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-sm">Registration Date</label>
                  <input
                    type="date"
                    value={euinData.registrationDate}
                    onChange={(e) => handleEuinChange(index, 'registrationDate', e.target.value)}
                    className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm">Expiry Date</label>
                  <input
                    type="date"
                    value={euinData.expiryDate}
                    onChange={(e) => handleEuinChange(index, 'expiryDate', e.target.value)}
                    className="border border-gray-400 w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-[#2367f8]"
                    required
                  />
                </div>
              </div>

              {euins.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEuin(index)}
                  className="text-sm mt-2 bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove EUIN
                </button>
              )}
            </div>
          ))}

          {/* Actions */}
          <button
            type="button"
            onClick={handleAddEuin}
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
          >
            + Add Another EUIN
          </button>

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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArnModal;
