"use client";
import React, { useEffect, useState } from "react";
import WelcomePage from "./welcome";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import TopSuggestedFund from "@/components/topSuggestedFuns";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { MdCancel } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const FormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  mobile: z.string().nonempty({ message: "Mobile number is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().optional(),
  captcha: z.string().nonempty({ message: "Captcha is required." }),
});

const FinancialHealthPage = () => {
  const [isStart, setIsStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [roboUser, setRoboUser] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sitedata, setSitedata] = useState([]);
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [performanceData, setPerformanceData] = useState({});
  const [userdata, setUserData] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [schemeName, setSchemeName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const generateCaptchaText = () => {
    return Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
  };

  const createCaptchaSVG = (text) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="120">
            <rect width="100%" height="100%" fill="#f8d7c3"/>
            <text x="10" y="28" font-size="24" fill="#a30a00" font-family="monospace">${text}</text>
          </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptchaText();
    setCaptcha(newCaptcha);
    setCaptchaImage(createCaptchaSVG(newCaptcha));
    setUserCaptcha("");
  };

  const fetchSiteData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
      );
      if (res.status === 200) {
        setSitedata(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  useEffect(() => {
    const fetchRoboUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo`
        );
        if (res.data.success) {
          setRoboUser(res.data.data);
        } else {
          console.warn("No Robo User found.");
        }
      } catch (error) {
        console.error("Error fetching Robo User:", error);
      }
    };
    fetchRoboUser();
  }, []);

  // performance data will be fetched only when user chooses to view funds (after dialog)
  useEffect(() => {
    if (isQuizCompleted) {
      const suggestedFunds = getSuggestedFunds();
      if (suggestedFunds.length > 0) {
        fetchPerformanceData(suggestedFunds);
      }
    }
  }, [isQuizCompleted]);

  const fetchPerformanceData = async (categories) => {
    setIsModalOpen(true);
    setLoading(true);
    try {
      // Join all categories into one string with commas
      const queryString = categories
        .map((cat) => encodeURIComponent(cat))
        .join(",");
      setSchemeName(queryString);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/fund-performance/fp-data?categorySchemes=${queryString}`
      );

      console.log("API Response:", response.data);

      if (response.status === 200) {
        const { data } = response.data;
        setPerformanceData(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth`
      );
      if (response.status === 200) setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerSelect = async (mark) => {
    // Save or replace answer at current index
    setSelectedAnswer(mark);
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = {
        question: questions[currentQuestionIndex].question,
        selectedAnswerMarks: mark,
      };
      // update cumulative score based on updated answers
      const newScore = updated.reduce(
        (acc, a) => acc + Number(a?.selectedAnswerMarks || 0),
        0
      );
      setScore(newScore);
      return updated;
    });

    setTimeout(async () => {
      const nextQuestionIndex = currentQuestionIndex + 1;

      if (nextQuestionIndex >= questions.length) {
        // ✅ Quiz is completed
        setIsQuizCompleted(true);
        setShowResultDialog(true);

        // ✅ Automatically submit answers if user data is available
        if (userdata?.username) {
          setLoading(true);
          try {
            await sendAllAnswersToAPI(userdata);
            setIsModalOpen(false);
          } catch (error) {
            console.error("Error submitting answers:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setCurrentQuestionIndex(nextQuestionIndex);
        const nextAnswer = answers[nextQuestionIndex];
        setSelectedAnswer(nextAnswer?.selectedAnswerMarks ?? null);
      }
    }, 300);
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex === 0) return;

    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);

    // Restore previous answer
    const prevAnswer = answers[prevIndex];
    setSelectedAnswer(prevAnswer?.selectedAnswerMarks ?? null);
  };

  const sendAllAnswersToAPI = async (data) => {
    let healthprofile;
    const totalScore = answers.reduce(
      (acc, curr) => acc + curr.selectedAnswerMarks,
      0
    );
    if (totalScore >= 0 && totalScore <= 3) {
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
      user: data,
      score: totalScore,
      answers: answers,
      healthprofile: healthprofile,
    };
    const emailContent = answers
      .map((answer) => {
        const answerText =
          answer.selectedAnswerMarks === 1
            ? "Yes"
            : answer.selectedAnswerMarks === 0
              ? "No"
              : answer.selectedAnswerMarks;
        return `<p><strong>Question:</strong> ${answer.question}</p>
            <p><strong>Answer:</strong> ${answerText}</p>`;
      })
      .join("");

    const emaildata = {
      user: data?.username,
      to: data?.email,
      subject: "Thank You for Your Enquiry!",
      html: `Dear ${data?.username},
    We sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.
   
    Your score is ${totalScore}
   
    Here are the answers you provided:
   
    ${emailContent},`,
    };
    const senderdata = {
      user: data?.title,
      to: sitedata?.email,
      subject: "New Enquiry",
      html: `New Enquiry from Risk profile\n
User Name : ${data?.username}, \n
Email : ${data?.email} \n
Mobile number : ${data?.mobile} \n
Message : ${data?.message}\n
User score is ${totalScore}
 
Here are the answers you provided:
   
${emailContent},`,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth`,
      payload
    );
    await axios.post(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email/`,
      emaildata
    );
    await axios.post(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email/`,
      senderdata
    );
    if (response.status === 201) {
      toast({
        description: "Your message has been sent.",
      });
    } else {
      alert(response.statusText);
    }
  };
  const InquiryForm = () => {
    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: "",
        mobile: "",
        email: "",
        message: "",
        captcha: "",
      },
    });

    // Handle form submission
    const onSubmit = async (data) => {
      if (
        captcha.trim().toUpperCase() !== data?.captcha?.trim().toUpperCase()
      ) {
        alert("Captcha doesn't match. Please try again.");
        refreshCaptcha();
        return;
      }
      setUserData(data);
      // setLoading(true);
      // sendAllAnswersToAPI(data);
      // setIsModalOpen(false);
      // setLoading(false);
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded"
        >
          <div className="flex justify-between items-center">
            <h1 className="font-medium text-xl text-white">
              Please Fill Your Detail Carefully...
            </h1>
            <Link
              href="/"
              className="w-10 text-white h-8 flex items-center justify-center text-2xl text-[var(--rv-black)]"
            >
              <MdCancel />
            </Link>
          </div>
          {/* Username Field */}
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
                    className="border border-gray-500 focus-visible:ring-neutral-300 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Field */}
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
                    className="border border-gray-500 focus-visible:ring-neutral-300 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
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
                    className="border border-gray-500 focus-visible:ring-neutral-300 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Message"
                    {...field}
                    className="file:border-0 bg-white  file:bg-transparent w-full bg-transparent file:text-sm file:font-medium 
                placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
                focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 
                dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none 
                transition duration-400 border border-gray-500 p-3 rounded-md"
                    aria-label="Message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* hCaptcha */}
          <div className="flex items-center gap-2">
            {captchaImage && (
              <Image
                width={100}
                height={100}
                src={captchaImage}
                alt="Captcha"
                className="h-10 w-[120px] border rounded shadow-sm"
              />
            )}
            <FormField
              control={form.control}
              name="captcha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Captcha"
                      {...field}
                      aria-label="Email"
                      className="w-full  p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="button"
              className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
              onClick={refreshCaptcha}
            >
              Refresh
            </button>
          </div>

          {/* Submit Button */}
          <Button
            className=" bg-[var(--rv-primary-dark)] hover:bg-[--rv-secondary-dark] text-white  "
            type="submit"
            disabled={loading}
          >
            {!loading ? "Submit" : "Loading..."}
          </Button>
        </form>
      </Form>
    );
  };

  const getResultMessage = () => {
    if (score >= 0 && score <= 3)
      return { message: "Critical", color: "text-red-500" };
    if (score >= 4 && score <= 5)
      return { message: "Weak", color: "text-yellow-600" };
    if (score >= 6 && score <= 7)
      return { message: "Border Line", color: "text-yellow-400" };
    if (score >= 8 && score <= 9)
      return { message: "Fit", color: "text-green-400" };
    return { message: "Excellent", color: "text-green-500" };
  };

  const getSuggestedFunds = () => {
    switch (getResultMessage().message) {
      case "Critical":
        return [
          "Liquid Fund",
          "Ultra Short Duration Fund",
          "Balanced Hybrid Fund",
        ];
      case "Weak":
        return [
          "Conservative Hybrid Fund",
          "Equity Savings Fund",
          "Multi Asset Allocation Fund",
        ];
      case "Border Line":
        return [
          "Aggressive Hybrid Fund",
          "Large & Mid Cap Fund",
          "Index Funds/ETFs",
        ];
      case "Fit":
        return ["Flexi Cap Fund", "Mid Cap Fund", "Focused Fund"];
      case "Excellent":
        return ["ELSS Fund", "International Fund", "Thematic Fund"];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [isStart]);

  return (
    <div>
      <InnerBanner title={"Financial Health"} />

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl py-16 px-12 bg-[#eff6ff]" hideClose>
          <DialogTitle className="sr-only">Health Check Result</DialogTitle>
          <DialogHeader>
            <DialogDescription className="text-center">
              <div className="flex flex-col items-center space-y-6">
                {/* ✅ Health Check Title */}
                <div className="">
                  <h2 className="text-xl font-semibold text-black">
                    Your Health checkup is
                  </h2>
                  <div
                    className={`mt-3 text-5xl font-extrabold text-[var(--rv-primary)]`}
                  >
                    {getResultMessage().message}
                  </div>
                </div>

                {/* ✅ Description */}
                <p className="text-[var(--rv-black)] text-lg max-w-md text-center">
                  {getResultMessage().message === "Critical" &&
                    "Your financial health is in danger. You’re exposed to risks. Start investing, even a small start today can protect your future. Don’t wait for a crisis to act."}

                  {getResultMessage().message === "Weak" &&
                    "Your financial base is fragile. Right now, your money isn't growing. Begin with disciplined investing to build strength and security step by step."}

                  {getResultMessage().message === "Border Line" &&
                    "You’ve made a start, but it’s not enough. With focused investing, you can reduce stress and grow more confidently. Take the next step today."}

                  {getResultMessage().message === "Fit" &&
                    "You're doing well. Keep going with smarter strategies. Long-term investing can help you grow potential wealth and give you peace of mind in future."}

                  {getResultMessage().message === "Excellent" &&
                    "You've built a strong foundation. Now’s the time to grow faster, diversify more, invest with purpose, and build long-term potential wealth."}
                </p>

                {/* ✅ Next Button */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    className="bg-[var(--rv-primary)] text-white py-2.5 px-8 font-semibold rounded-full"
                    onClick={() => setShowResultDialog(false)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col bg-cover w-full bg-[var(--rv-bg-black1)] bg-center bg relative">
        {/* <div className="absolute inset-0 bg-black"></div> */}
        {!userdata.username && isStart && (
          <div className="fixed inset-0 bg-[#000000a3] bg-opacity-60 z-[5000] flex items-center justify-center">
            <div
              className="p-5 rounded-lg shadow-lg w-[30rem] max-h-[500px]   backdrop-blur-xl"
              style={{ background: "var(--rv-gradient)" }}
            >
              <InquiryForm />
            </div>
          </div>
        )}

        <div className="flex flex-col  items-center justify-center  text-center  py-20 space-y-5">
          <div className="bg-white/10 backdrop-blur-xl px-10 py-7 rounded-2xl shadow-xl border border-white/20 max-w-screen-xl w-full mx-auto">
            {isStart && loadingQuestions ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3 mx-auto" />
                <Skeleton className="h-8 w-2/3 mx-auto" />
                <div className="flex justify-center gap-4 mt-6">
                  <Skeleton className="h-12 w-40 rounded-xl" />
                  <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
              </div>
            ) : !isStart ? (
              <WelcomePage onStatus={setIsStart} />
            ) : isQuizCompleted ? (
              <div className="">
                <div
                  id="showfunds"
                  className=" max-w-screen-xl"
                >
                  <div className="text-left mt-6">
                    <div className="text-center mb-5">
                      <h3 className="text-lg md:text-2xl font-bold  mb-4">
                        Suggested Funds for You
                      </h3>
                      <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        The suggested funds are provided based on general
                        categories and historical performance data. These are
                        not investment recommendations or personalized financial
                        advice. Please consult your financial advisor and read
                        all scheme-related documents carefully before investing.
                        Mutual Fund investments are subject to market risks.
                        Read all scheme related documents carefully.
                      </p>
                    </div>

                    {loading && (
                      <p className="text-white">
                        ⏳ Loading fund suggestions...
                      </p>
                    )}

                    {!loading && performanceData.length > 0 && (
                      <TopSuggestedFund
                        performanceData={performanceData}
                        schemeName={schemeName}
                        roboUser={roboUser}
                      />
                    )}
                    <div className=" flex justify-center items-center mt-4">
                      <Link href="/performance/fund-performance" className="btn btn-primary">
                                    Explore more
                                  </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* ✅ Question */}
                <div className=" text-right mb-4  text-lg font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <h4 className="font-semibold mb-4 text-start">
                  {currentQuestionIndex + 1}.{" "}
                  {questions[currentQuestionIndex]?.question}
                </h4>

                {/* ✅ Answer Buttons */}
                <div className="flex justify-between gap-4 md:w-1/2">
                  <button
                    className={`py-2 w-full cursor-pointer rounded-xl border font-bold text-lg transition ${selectedAnswer === 1
                      ? "bg-[var(--rv-primary)] text-white"
                      : "bg-[var(--rv-secondary)] text-white"
                      }`}
                    onClick={() => handleAnswerSelect(1)}
                  >
                    Yes
                  </button>

                  <button
                    className={`py-2 w-full cursor-pointer rounded-xl border font-bold text-lg transition ${selectedAnswer === 0
                      ? "bg-[var(--rv-primary)] text-white"
                      : "bg-[var(--rv-secondary)] text-white"
                      }`}
                    onClick={() => handleAnswerSelect(0)}
                  >
                    No
                  </button>

                  {/* ✅ Previous Button */}

                </div>

                {currentQuestionIndex > 0 && (
                  <button
                    className="mt-4 py-3 w-1/6 md:w-1/12 cursor-pointer items-center flex justify-center rounded-xl border font-bold text-xl bg-[var(--rv-primary)] text-white hover:bg-[var(--rv-secondary)] transition"
                    onClick={handlePreviousClick}
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthPage;
