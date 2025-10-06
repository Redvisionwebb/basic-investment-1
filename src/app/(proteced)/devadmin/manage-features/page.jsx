"use client";
import { useState, useEffect } from "react";
import { menuGroups } from "@/data/menu";
import DefaultLayout from "@/components/admin/devadmin/Layouts/DefaultLaout";
import Loader from "@/components/admin/common/Loader";

export default function SelectSectionsPage() {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch permissions from DB
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch("/api/permissions");
        const data = await res.json();
        const enabledPermissions = data
          .filter((p) => p.enabled)
          .map((p) => p.permission);
        setSelectedPermissions(enabledPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchPermissions();
  }, []);

  const togglePermission = async (permission) => {
    const newSelected = selectedPermissions.includes(permission)
      ? selectedPermissions.filter((p) => p !== permission)
      : [...selectedPermissions, permission];

    setSelectedPermissions(newSelected);

    await fetch("/api/permissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        permission,
        enabled: !selectedPermissions.includes(permission),
      }),
    });
  };

  if (loading) {
    return (
      <DefaultLayout>
          <Loader />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div>
        <h1 className="text-2xl text-center font-bold mb-6">Select Features</h1>

        {menuGroups.map((group) => (
          <div key={group.name} className="mb-8">
            <div className="overflow-x-auto rounded-lg shadow border border-gray-300 bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--rv-admin-bg-color)] text-white text-base uppercase">
                  <tr>
                    <th className="px-6 py-3">Menu Name</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.menuItems.map((item) => {
                    const isActive = selectedPermissions.includes(item.permission);
                    return (
                      <tr
                        key={item.permission}
                        className="border-t border-gray-300 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => togglePermission(item.permission)}
                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                              isActive ? "bg-[var(--rv-admin-bg-color)]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                                isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}
