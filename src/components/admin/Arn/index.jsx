'use client';

import { useState, useEffect } from 'react';
import AddArnModal from './arnModel';
import axios from 'axios';

const ArnList = () => {
  const [arnData, setArnData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchArnData = async () => {
    try {
      const res = await axios.get('/api/admin/arn');
      setArnData(res.data.data || []);
    } catch (err) {
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
    fetchArnData(); // Refresh list after modal closes
  };

  const handleDelete = async (ARN) => {
    const confirm = window.confirm(`Are you sure you want to delete ARN?`);
    if (!confirm) return;
    try {
      await axios.delete('/api/admin/arn', {
        data: { id: ARN },
      });
      fetchArnData(); // Refresh list after deletion
    } catch (err) {
      console.error('Failed to delete EUIN:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All ARN List</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          Add ARN AUIN Number
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full border text-left table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">SR No.</th>
                <th className="border px-4 py-2">ARN NO.</th>
                <th className="border px-4 py-2">EUIN NO.</th>
                <th className="border px-4 py-2">Registration Date</th>
                <th className="border px-4 py-2">Expiry Date</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {arnData.map((item, arnIndex) =>
                item.euins.map((euinEntry, euinIndex) => (
                  <tr key={`${item.arn}-${euinEntry.euin}`}>
                    <td className="border px-4 py-2">
                      {euinIndex === 0 ? arnIndex + 1 : ''}
                    </td>
                    <td className="border px-4 py-2">
                      {euinIndex === 0 ? item.arn : ''}
                    </td>
                    <td className="border px-4 py-2">{euinEntry.euin}</td>
                    <td className="border px-4 py-2">{new Date(euinEntry.registrationDate).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{new Date(euinEntry.expiryDate).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && <AddArnModal onClose={handleClose} />}
    </div>
  );
};

export default ArnList;
