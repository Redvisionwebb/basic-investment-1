"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const RiskQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editedQuestion, setEditedQuestion] = useState({});
  const [editedAnswers, setEditedAnswers] = useState({});

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/risk-questions");
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
      await axios.put("/api/risk-questions/status", { status: newStatus });
      setIsEnabled(newStatus);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleUpdate = async (question) => {
    try {
      await axios.put(`/api/risk-questions/${question._id}`, {
        question: editedQuestion[question._id],
        answers: editedAnswers[question._id],
      });

      setEditMode((prev) => ({ ...prev, [question._id]: false }));
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update question and answers", err);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Risk Questions</h1>
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
            const answers = editedAnswers[question._id] ?? question.answers;

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
                      setEditedAnswers((prev) => ({
                        ...prev,
                        [question._id]: [...question.answers],
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {answers.map((answer, idx) => (
                    <div key={idx} className="border p-3 rounded">
                      <label className="text-sm font-medium text-gray-600">
                        Answer {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={answer.text}
                        onChange={(e) =>
                          setEditedAnswers((prev) => {
                            const updated = [...answers];
                            updated[idx] = {
                              ...updated[idx],
                              text: e.target.value,
                            };
                            return {
                              ...prev,
                              [question._id]: updated,
                            };
                          })
                        }
                        className="w-full p-2 mt-1 border rounded"
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>

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
            Risk questions are currently disabled.
          </p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default RiskQuestions;
