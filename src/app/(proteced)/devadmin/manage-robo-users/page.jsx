"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/admin/devadmin/Layouts/DefaultLaout";
import Loader from "@/components/admin/common/Loader";

export default function SelectSectionsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deskOptions, setDeskOptions] = useState([]);
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    type: null,
    userId: null,
    currentValue: null,
  });
  const [localUserData, setLocalUserData] = useState({}); // store local changes

  // Fetch Robo user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`);
        const json = await res.json();
        if (json.success) {
          setUsers(json.data);
          // Initialize localUserData
          const localData = {};
          json.data.forEach(u => {
            localData[u._id] = {
              arnId: u.arnId || "",
              arnNumber: u.arnNumber || "",
              deskType: u.deskType || "",
            };
          });
          setLocalUserData(localData);
        }
      } catch (err) {
        console.error("Error fetching Robo data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch desk options and map IFA -> ADVISOR
  useEffect(() => {
    const fetchDeskOptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login/login-desk`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const options = json.data[0].loginitems.map(item => {
            let desk = item.login_desk.toLowerCase();
            if (desk === "ifa") desk = "advisor"; // map IFA -> ADVISOR
            return desk;
          });
          setDeskOptions(options);
        }
      } catch (err) {
        console.error("Error fetching desk options:", err);
      }
    };
    fetchDeskOptions();
  }, []);

  // Automatically set first desk type for all Robo Users
  useEffect(() => {
    if (deskOptions.length > 0 && users.length > 0) {
      const firstDesk = deskOptions[0] === "ifa" ? "advisor" : deskOptions[0];
      const updatedLocal = { ...localUserData };
      users.filter(u => u.roboUser).forEach(u => {
        updatedLocal[u._id] = {
          ...updatedLocal[u._id],
          deskType: firstDesk
        };
      });
      setLocalUserData(updatedLocal);
    }
  }, [deskOptions, users]);

  // Toggle Software/Robo user
  const handleToggle = (userId, type, currentValue) => {
    if (type === "roboUser" && !users.find((u) => u._id === userId).softwareUser) {
      alert("Enable Software User first to activate Robo User");
      return;
    }
    setConfirmPopup({
      open: true,
      type,
      userId,
      currentValue,
    });
  };

  // Confirm toggle
  const confirmToggle = async () => {
    const { userId, type, currentValue } = confirmPopup;
    const newValue = !currentValue;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          [type]: newValue,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? json.data : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmPopup({ open: false, type: null, userId: null, currentValue: null });
    }
  };

  // Handle local input change (ARN ID / ARN Number)
  const handleLocalChange = (userId, field, value) => {
    setLocalUserData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  // Save changes to API
  const handleSave = async (userId) => {
    const { arnId, arnNumber, deskType } = localUserData[userId];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          arnId,
          arnNumber,
          deskType
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev =>
          prev.map(u => (u._id === userId ? json.data : u))
        );
        alert("Saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save data");
    }
  };

  if (loading) return <DefaultLayout><Loader /></DefaultLayout>;

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl text-center font-bold mb-6">Robo Setup</h1>

        {/* Main table for toggles */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-300 bg-white mb-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#2367f8] text-white text-base uppercase">
              <tr>
                <th className="px-6 py-3 text-center">Software User</th>
                <th className="px-6 py-3 text-center">Robo User</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-300 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggle(user._id, "softwareUser", user.softwareUser)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${user.softwareUser ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${user.softwareUser ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => user.softwareUser && handleToggle(user._id, "roboUser", user.roboUser)}
                      disabled={!user.softwareUser}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${user.roboUser ? "bg-green-500" : "bg-gray-300"} ${!user.softwareUser ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${user.roboUser ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Separate section for ARN & Desk Type */}
        {users.filter(u => u.roboUser).map((user) => (
          <div key={`details-${user._id}`} className="bg-white rounded-lg shadow border border-gray-300 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Robo User Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">ARN ID</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.arnId || ""}
                  onChange={(e) => handleLocalChange(user._id, "arnId", e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">ARN Number</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.arnNumber || ""}
                  onChange={(e) => handleLocalChange(user._id, "arnNumber", e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Desk Type</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.deskType || ""}
                  readOnly
                  className="border px-2 py-1 rounded w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => handleSave(user._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        ))}

        {/* Confirmation Popup */}
        {confirmPopup.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-center">
                {confirmPopup.type === "softwareUser"
                  ? "Are you sure you want to toggle Software User?"
                  : "Are you sure you want to toggle Robo User?"}
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmToggle}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    setConfirmPopup({ open: false, type: null, userId: null, currentValue: null })
                  }
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DefaultLayout>
  );
}
