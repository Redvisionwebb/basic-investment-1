'use client';
import axios from 'axios';
import { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddArnModal = ({ onClose }) => {
  const [arn, setArn] = useState('');
  const [loading, setLoading] = useState(false);
  const [euins, setEuins] = useState([
    { euin: '', registrationDate: '', expiryDate: '' }
  ]);

  const handleAddEuin = () => {
    setEuins([...euins, { euin: '', registrationDate: '', expiryDate: '' }]);
  };

  const handleRemoveEuin = (index) => {
    const newEuins = [...euins];
    newEuins.splice(index, 1);
    setEuins(newEuins);
  };

  const handleEuinChange = (index, field, value) => {
    const newEuins = [...euins];
    newEuins[index][field] = value;
    setEuins(newEuins);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`,
        { arn, euins }
      );

      if (res.status === 201) {
        toast.success('ARN created successfully ✅');
        onClose();
      } else {
        toast.error('Something went wrong ❌');
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
          {/* ARN Input */}
          <div>
            <label className="block font-medium mb-1 text-sm">ARN Number</label>
            <input
              type="text"
              value={arn}
              onChange={(e) => setArn(e.target.value)}
              className="border p-2 border-gray-400 flex h-10 w-full bg-transparent rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rv-admin-bg-color)]"
              required
            />
          </div>

          {/* EUINS */}
          {euins.map((euinData, index) => (
            <div key={index} >
              <div>
                <label className="block font-medium mb-1 text-sm">EUIN</label>
                <input
                  type="text"
                  value={euinData.euin}
                  onChange={(e) => handleEuinChange(index, 'euin', e.target.value)}
                  className="border p-2 border-gray-400 flex h-10 w-full rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rv-admin-bg-color)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-sm">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    value={euinData.registrationDate}
                    onChange={(e) =>
                      handleEuinChange(index, 'registrationDate', e.target.value)
                    }
                    className="border p-2 border-gray-400 flex h-10 w-full rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rv-admin-bg-color)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={euinData.expiryDate}
                    onChange={(e) =>
                      handleEuinChange(index, 'expiryDate', e.target.value)
                    }
                    className="border p-2 border-gray-400 flex h-10 w-full rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rv-admin-bg-color)]"
                    required
                  />
                </div>
              </div>

              {euins.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEuin(index)}
                  className="text-sm px-4 py-2 mt-2 rounded-md bg-red-600 text-white"
                >
                  Remove EUIN
                </button>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="grid grid-cols-1 w-full gap-3">
            <button
              type="button"
              onClick={handleAddEuin}
              className="bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)] text-white px-4 py-2 rounded-md"
            >
              Add Another EUIN
            </button>

            <div className="grid grid-cols-2 w-full gap-3">
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
                className="bg-[var(--rv-admin-bg-color)] text-white hover:bg-[var(--rv-admin-bg-color)] rounded-md px-4 py-2 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArnModal;
