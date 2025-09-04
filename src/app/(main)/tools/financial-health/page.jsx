"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

const FinancialHealth = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [sitedata, setSitedata] = useState([]);

  const fetchSiteData = async () => {
    try {
      const res = await axios.get("/api/admin/site-settings");
      if (res.status === 200) {
        setSitedata(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FormSchema = z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    mobile: z.string().nonempty({ message: "Mobile number is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    message: z.string().optional(),
  });

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/health-questions?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status == 200) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSiteData();
    fetchQuestions();
  }, []);

  const InquiryForm = () => {
    const [hcaptchaToken, setHcaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState("");

    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: "",
        mobile: "",
        email: "",
        message: "",
      },
    });

    // Handle form submission
    const onSubmit = async (data) => {
      if (!hcaptchaToken) {
        setCaptchaError("Please complete the CAPTCHA verification.");
        return;
      }

      setCaptchaError("");
      setLoading(true);
      setUserData(data);
      setIsModalOpen(false);
      setLoading(false);
      setHcaptchaToken(null);
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-xl overflow-hidden"
        >
          <div className="flex justify-between bg-[var(--rv-bg-primary)] p-5 gap-20 items-center text-white">
            <h1 className="font-medium text-2xl">
              Please fill Your Details <br /> Carefully
            </h1>
            <Link href="/" className="text-right font-medium">
              Back
            </Link>
          </div>
          <div className="w-full  p-5 bg-white flex flex-col gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="User Name"
                      {...field}
                      aria-label="User Name"
                      className="border border-[var(--rv-bg-primary)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Mobile"
                      {...field}
                      aria-label="Mobile Number"
                      className="border border-[var(--rv-bg-primary)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      aria-label="Email"
                      className="border border-[var(--rv-bg-primary)] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      placeholder="Message"
                      {...field}
                      className="w-full border border-[var(--rv-bg-primary)] outline-none p-1 rounded"
                      aria-label="Message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onVerify={(token) => setHcaptchaToken(token)}
              />
              {captchaError && (
                <p className="text-red-500 text-sm mt-2">{captchaError}</p>
              )}
            </div>
            <div>
              <Button className="text-white" type="submit" disabled={loading}>
                {!loading ? "Submit" : "Loading..."}
              </Button>
            </div>
          </div>

        </form>
      </Form>
    );
  };

  const handleNextClick = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer before proceeding");
      return;
    }
    const newAnswer = {
      question: questions[currentQuestionIndex].question,
      selectedAnswerMarks: selectedAnswer,
    };

    setScore(score + selectedAnswer);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex >= questions.length) {
      const finalAnswers = [...answers, newAnswer];
      setAnswers(finalAnswers);
      sendAllAnswersToAPI(finalAnswers);
      setIsQuizCompleted(true);
    } else {
      setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null);
    }
  };

  const sendAllAnswersToAPI = async (answers) => {
    let healthprofile;
    const totalScore = answers.reduce(
      (acc, curr) => acc + curr.selectedAnswerMarks,
      0
    );
    if (totalScore >= 1 && totalScore <= 3) {
      healthprofile = "Critical";
    } else if (totalScore >= 4 && totalScore <= 5) {
      healthprofile = "Weak";
    } else if (totalScore >= 6 && totalScore <= 7) {
      healthprofile = "Border Line";
    } else if (totalScore >= 8 && totalScore <= 9) {
      healthprofile = "Fit";
    } else {
      healthprofile = "Excellent";
    }
    const payload = {
      user: userdata,
      score: totalScore,
      answers: answers,
      healthprofile: healthprofile,
    };
    const emailContent = answers
      .map((answer) => {
        return `<p><strong>Question:</strong> ${answer.question}</p>
                    <p><strong>Answer:</strong> ${answer.selectedAnswerText}</p>`;
      })
      .join("");

    const emaildata = {
      user: userdata?.username,
      to: userdata?.email,
      subject: "Thank You for Your Enquiry!\n",
      html: `Dear ${userdata?.username}\n,
    We sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.\n
    
    Your score is ${totalScore}\n
    
    Here are the answers you provided:\n
    
    ${emailContent},`,
    };
    const senderdata = {
      user: sitedata?.title,
      to: sitedata?.email,
      subject: "New Enquiry",
      html: `New Enquiry from Risk profile\n
User Name : ${userdata?.username}, \n
Email : ${userdata?.email} \n
Mobile number : ${userdata?.mobile} \n
Message : ${userdata?.message}\n
User score is ${totalScore}

Here are the answers you provided:
    
    ${emailContent},`,
    };
    const response = await axios.post("/api/financialhealth", payload);
    await axios.post("/api/email/", emaildata);
    const sender = await axios.post("/api/email/", senderdata);
    if (response.status === 201) {
      toast({
        description: "Your message has been sent.",
      });
    } else {
      alert(response.statusText);
    }
  };

  const handleAnswerSelect = (mark) => {
    setSelectedAnswer(mark);
  };

  const getResultMessage = () => {
    if (score >= 1 && score <= 3)
      return { message: "Critical", color: "text-red-500" };
    if (score >= 4 && score <= 5)
      return { message: "Weak", color: "text-yellow-600" };
    if (score >= 6 && score <= 7)
      return { message: "Border Line", color: "text-yellow-400" };
    if (score >= 8 && score <= 9)
      return { message: "Fit", color: "text-green-400" };
    return { message: "Excellent", color: "text-green-500" };
  };
  return (
    <>
      <InnerBanner title={'Financial Health'} />
      <div className=" section bg-white">
        <div className="max-w-6xl mx-auto p-6 bg-[var(--rv-bg-primary-light)]  shadow-lg rounded-lg">
          <Toaster />
          {isModalOpen && (
            <div className="fixed inset-0 bg-[#0e314da3] bg-opacity-60 z-[5000] flex items-center justify-center">
              <div className="">
                <InquiryForm />
              </div>
            </div>
          )}

          {isQuizCompleted ? (
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Your Total Score: {score}
              </h2>
              <div
                className={`text-4xl font-semibold mb-4 ${getResultMessage().color
                  }`}
              >
                {getResultMessage().message}
              </div>
              <div className="">
                <p className="text-lg">Here’s what your score means:</p>
                <ul className="mt-2 text-left">
                  <li className="mb-3 text-gray-600">
                    <span className="text-bold text-lg text-gray-900">
                      Critical:{" "}
                    </span>{" "}
                    Your financial situation is at a very critical level and you
                    need to get some professional help before its too late. We will
                    soon send you a thorough analysis of your financial health.
                  </li>
                  <li className="mb-3 text-gray-600">
                    <span className="text-bold text-lg text-gray-900">Weak: </span>
                    Your financial situation is weak. There are certain basic areas
                    that you have taken care of but a majority of them needs to be
                    worked upon. We will soon send you a thorough analysis of your
                    financial health.
                  </li>
                  <li className="mb-3 text-gray-600">
                    <span className="text-bold text-lg text-gray-900">
                      Border Line:{" "}
                    </span>
                    We can see that you have put in effort to plan your finances.
                    But at the same time there certain areas that have been
                    completely ignored. A correct direction along with proper risk
                    profiling and asset allocation is what you might need.
                  </li>
                  <li className="mb-3 text-gray-600">
                    <span className="text-bold text-lg text-gray-900">Fit: </span>
                    Good care has been taken in planning your financial life. A good
                    asset allocation and portfolio rebalancing may be required. It
                    will show help in maximising returns by minimizing the risk. We
                    will soon send you a thorough analysis of your financial health.
                  </li>
                  <li className="mb-3 text-gray-600">
                    <span className="text-bold text-lg text-gray-900">
                      Excellent:
                    </span>{" "}
                    We appreciate the effort you have put into financial planning.
                    You are in the correct direction. Make sure you rebalance your
                    portfolio regularly. We will soon send you a thorough analysis
                    of your financial health.
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  // Reset the quiz
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setIsQuizCompleted(false);
                  setSelectedAnswer(null);
                  router.push("/");
                }}
                className="hover:text-black border px-8 py-2 rounded-lg mt-10 hover:bg-[var(--rv-secondary)] bg-[var(--rv-primary)] text-white w-fit"
              >
                Back Home
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {currentQuestionIndex + 1}.{" "}
                {questions[currentQuestionIndex]?.question}
              </h2>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={"answer"}
                    name="answer"
                    value={1}
                    checked={selectedAnswer === 1}
                    onChange={() => handleAnswerSelect(1)}
                    className="mr-2"
                  />
                  <label htmlFor={"answer"} className="text-lg text-gray-800">
                    Yes
                  </label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={"no"}
                    name="no"
                    value={1}
                    checked={selectedAnswer === 0}
                    onChange={() => handleAnswerSelect(0)}
                    className="mr-2"
                  />
                  <label htmlFor={"no"} className="text-lg text-gray-800">
                    No
                  </label>
                </div>
              </div>
              <Button
                onClick={() =>
                  handleNextClick(questions[currentQuestionIndex]?.question)
                }
                className="hover:text-black border px-8 py-2 rounded-lg hover:bg-[var(--rv-secondary)] bg-[var(--rv-primary)] text-white w-fit"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FinancialHealth;