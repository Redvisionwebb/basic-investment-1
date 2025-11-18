"use client";

import Loader from "@/components/admin/common/Loader";
import DefaultLayout from "@/components/admin/devadmin/Layouts/DefaultLaout";
import axios from "axios";
import React from "react";

const DeskSelector = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDesk, setSelectedDesk] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login`
        );

        if (res.status === 200 && res.data.data) {
          const initialData = res.data.data.map((group) => ({
            ...group,
            loginitems: group.loginitems.map((item) => ({
              ...item,
              isstatus: item.isstatus || false,
            })),
          }));

          // 1️⃣ Check localStorage for previous selection
          let storedDesk = localStorage.getItem("selectedDesk");
          let selected = null;

          if (storedDesk) {
            selected = storedDesk;
            // Mark stored desk as selected in data
            initialData.forEach((group) => {
              group.loginitems.forEach((item) => {
                item.isstatus = item.login_desk === storedDesk;
              });
            });
          } else {
            // 2️⃣ If no desk stored, auto-select first one
            outerLoop: for (const group of initialData) {
              for (const item of group.loginitems) {
                selected = item.login_desk;
                item.isstatus = true;
                break outerLoop;
              }
            }

            if (selected) {
              localStorage.setItem("selectedDesk", selected);
              updateStatusOnServer(selected);
            }
          }

          setSelectedDesk(selected);
          setData(initialData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const desks = React.useMemo(() => {
    const deskSet = new Set();
    data.forEach((group) => {
      group.loginitems.forEach((item) => {
        if (item.login_desk) deskSet.add(item.login_desk);
      });
    });
    return Array.from(deskSet);
  }, [data]);

  const updateStatusOnServer = async (desk) => {
    setUpdating(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login`,
        {
          selectedDesk: desk,
        }
      );
    } catch (error) {
      console.error("Error updating status on server:", error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleDeskSelect = (desk) => {
    if (selectedDesk === desk) {
      // Unselect
      setSelectedDesk(null);
      localStorage.removeItem("selectedDesk");
      setData((prev) =>
        prev.map((group) => ({
          ...group,
          loginitems: group.loginitems.map((item) => ({
            ...item,
            isstatus: false,
          })),
        }))
      );
      updateStatusOnServer(null);
    } else {
      // Select new desk
      setSelectedDesk(desk);
      localStorage.setItem("selectedDesk", desk);
      setData((prev) =>
        prev.map((group) => ({
          ...group,
          loginitems: group.loginitems.map((item) => ({
            ...item,
            isstatus: item.login_desk === desk,
          })),
        }))
      );
      updateStatusOnServer(desk);
    }
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
      <div className="">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Select a Login Desk
        </h1>

        {/* Desk selection buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {desks?.map((desk) => {
            const isSelected = selectedDesk === desk;
            return (
              <div
                key={desk}
                onClick={() => toggleDeskSelect(desk)}
                className={`cursor-pointer border border-gray-300 rounded-xl p-4 flex flex-col items-center transition ${
                  isSelected ? "bg-[#2367f8]" : "bg-white"
                }`}
              >
                <span
                  className={`text-lg font-semibold ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {desk}
                </span>
                <span
                  className={`text-sm mt-1 ${
                    isSelected
                      ? "text-white font-medium"
                      : "text-gray-800"
                  }`}
                >
                  {isSelected ? "Selected" : "Click to Select"}
                </span>
              </div>
            );
          })}
        </div>

        {updating && (
          <div className="mb-4 text-sm text-[#2367f8] animate-pulse">
            Updating status...
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Desk Status Overview</h2>
          <div className="overflow-x-auto rounded-lg bg-white border border-gray-300">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#2367f8] text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Group</th>
                  <th className="px-6 py-3">Login Name</th>
                  <th className="px-6 py-3">Desk</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((group) =>
                  group?.loginitems?.map((item) => (
                    <tr
                      key={item?._id}
                      className="border-t border-gray-300 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-700">
                        {group?.name}
                      </td>
                      <td className="px-6 py-3">{item?.login_name}</td>
                      <td className="px-6 py-3">{item?.login_desk}</td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item?.isstatus
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item?.isstatus ? "Selected" : "Not Selected"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DeskSelector;
