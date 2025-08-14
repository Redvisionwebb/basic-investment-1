'use client';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddArnModal = ({ onClose }) => {
  const [arn, setArn] = useState('');
  const [euins, setEuins] = useState([
    { euin: '', registrationDate: '', expiryDate: '' }
  ]);

  const handleAddEuin = () => {
    setEuins([
      ...euins,
      { euin: '', registrationDate: '', expiryDate: '' }
    ]);
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
    console.log({ arn, euins });

    const res = await axios.post('/api/admin/arn', {
        arn,
        euins
      });
  
    if (res.status === 201) {
        toast({
            variant: '',
            title: "ARN created successfully",
            // description: "There was a problem with your request.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0d2d476e] bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add ARN & EUIN</h3>
          <button className="text-red-500 text-xl" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">ARN Number</label>
            <input
              type="text"
              value={arn}
              onChange={(e) => setArn(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {euins.map((euinData, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">EUIN</label>
                <input
                  type="text"
                  value={euinData.euin}
                  onChange={(e) => handleEuinChange(index, 'euin', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Registration Date</label>
                  <input
                    type="date"
                    value={euinData.registrationDate}
                    onChange={(e) => handleEuinChange(index, 'registrationDate', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={euinData.expiryDate}
                    onChange={(e) => handleEuinChange(index, 'expiryDate', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>

              {/* Remove EUIN */}
              {euins.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEuin(index)}
                  className="text-red-500"
                >
                  Remove EUIN
                </button>
              )}
            </div>
          ))}

          {/* Add EUIN */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleAddEuin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Another EUIN
            </button>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArnModal;
