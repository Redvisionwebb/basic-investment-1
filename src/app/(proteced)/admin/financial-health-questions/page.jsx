
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const FinancialHealthQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editedQuestion, setEditedQuestion] = useState({});

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/financialhealth");
      setQuestions(res.data);
      const anyEnabled = res.data.some((q) => q.status === true);
      setIsEnabled(anyEnabled);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleToggle = async () => {
    try {
      const newStatus = !isEnabled;
      await axios.put("/api/financialhealth/status", { status: newStatus });
      setIsEnabled(newStatus);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleUpdate = async (question) => {
    try {
      await axios.put(`/api/financialhealth/${question._id}`, {
        question: editedQuestion[question._id],
      });

      setEditMode((prev) => ({ ...prev, [question._id]: false }));
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update question", err);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Health Questions</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Toggle</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={handleToggle}
              />
              <div
                className={`w-14 h-7 rounded-full peer transition-colors duration-300 ${
                  isEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  isEnabled ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </label>
            <span
              className={`text-sm font-semibold ${
                isEnabled ? "text-green-600" : "text-red-600"
              }`}
            >
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {isEnabled ? (
          questions.map((question, index) => {
            const isEditing = editMode[question._id] || false;
            const questionText =
              editedQuestion[question._id] ?? question.question;

            return (
              <div
                key={question._id}
                className="mb-6 p-4 border rounded shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold">Question {index + 1}</label>
                  <button
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    onClick={() => {
                      setEditMode((prev) => ({
                        ...prev,
                        [question._id]: !isEditing,
                      }));
                      setEditedQuestion((prev) => ({
                        ...prev,
                        [question._id]: question.question,
                      }));
                    }}
                  >
                    ✏️ Edit
                  </button>
                </div>

                <input
                  type="text"
                  value={questionText}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({
                      ...prev,
                      [question._id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 mt-1 mb-2 border rounded"
                  disabled={!isEditing}
                />

             

                {isEditing && (
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleUpdate(question)}
                  >
                    Update
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 mt-6">
            Financial Health questions are currently disabled.
          </p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default FinancialHealthQuestions;
