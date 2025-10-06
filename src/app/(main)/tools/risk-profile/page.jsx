"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form, FormControl, FormField, FormItem, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { footerData } from "@/data/footer";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";


const RiskProfile = () => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswerText, setSelectedAnswerText] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [userdata, setUserData] = useState([]);
    const [sitedata, setSitedata] = useState([]);
    const [captchaError, setCaptchaError] = useState("");

    const fetchSiteData = async () => {
        try {
            const res = await axios.get('/api/admin/site-settings');
            if (res.status === 200) {
                setSitedata(res.data[0])
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchSiteData(), fetchQuestions() }, [])
    const FormSchema = z.object({
        username: z.string().min(2, { message: "Username must be at least 2 characters." }),
        mobile: z.string().nonempty({ message: "Mobile number is required." }),
        email: z.string().email({ message: "Invalid email address." }),
        message: z.string().optional(),
    });

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`/api/risk-questions`);
            if (response.status == 200) {
                setQuestions(response.data)
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect(() => { fetchQuestions() }, [])

    const InquiryForm = () => {
        const [hcaptchaToken, setHcaptchaToken] = useState(null);
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
            setLoading(true)
            setHcaptchaToken(null);
            setUserData(data)
            setIsModalOpen(false)
            setLoading(false)
        };

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded  py-3 px-6 bg-white">
                    <div className="flex justify-between items-center">
                        <h1 className="font-medium text-xl">Please Fill Your Detail Carefully...</h1>
                        <Link href="/" className="text-right text-blue-500 font-medium">Back</Link>
                    </div>
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="User Name" {...field} aria-label="User Name" className="border border-gray-500" />
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
                                    <Input placeholder="Mobile" {...field} aria-label="Mobile Number" className="border border-gray-500" />
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
                                    <Input type="email" placeholder="Email" {...field} aria-label="Email" className="border border-gray-500" />
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
                                    <textarea placeholder="Message" {...field} className="w-full border border-gray-500 p-1 rounded" aria-label="Message" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* hCaptcha */}
                    <div>
                        <HCaptcha
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onVerify={(token) => setHcaptchaToken(token)}
                        />
                        {captchaError && (
                            <p className="text-red-500 text-sm mt-2">{captchaError}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button className="text-white bg-[var(--rv-secondary)]" type="submit">{!loading ? "Submit" : "Loading..."}</Button>
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
            selectedAnswerText: selectedAnswerText,
            selectedAnswerMarks: selectedAnswer,
        };

        // Update score
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
        let riskprofile;
        const totalScore = answers.reduce((acc, curr) => acc + curr.selectedAnswerMarks, 0);

        if (totalScore >= 10 && totalScore < 20) {
            riskprofile = "Conservative";
        } else if (totalScore >= 20 && totalScore <= 26) {
            riskprofile = "Moderately Conservative";
        } else if (totalScore >= 27 && totalScore <= 33) {
            riskprofile = "Moderate";
        } else if (totalScore >= 34 && totalScore <= 39) {
            riskprofile = "Moderately Aggressive";
        } else if (totalScore >= 40 && totalScore <= 50) {
            riskprofile = "Aggressive";
        }

        const payload = {
            user: userdata,
            score: totalScore,
            answers: answers,
            riskprofile: riskprofile
        };

        // Prepare the email content with selected questions and answers
        const emailContent = answers.map(answer => {
            return `<p><strong>Question:</strong> ${answer.question}</p>
                    <p><strong>Answer:</strong> ${answer.selectedAnswerText}</p>`;
        }).join('');

        const emaildata = {
            user: userdata?.username,
            to: userdata?.email,
            subject: 'Thank You for Your Enquiry!\n',
            html: `Dear ${userdata?.username}\n,
    We sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.\n
    
    Your score is ${totalScore}\n
    
    Here are the answers you provided:\n
    
    ${emailContent},`
        };
        const senderdata = {
            user: sitedata?.title,
            to: sitedata?.email,
            subject: 'New Enquiry',
            html: `New Enquiry from Risk profile\n
User Name : ${userdata?.username}, \n
Email : ${userdata?.email} \n
Mobile number : ${userdata?.mobile} \n
Message : ${userdata?.message}\n
User score is ${totalScore}

Here are the answers you provided:
    
    ${emailContent},`,
        }
        try {
            const response = await axios.post("/api/riskcalculator/", payload);
            await axios.post('/api/email/', emaildata);
            const sender = await axios.post('/api/email/', senderdata);

            if (response.status === 201) {
                toast({
                    description: "Your message has been sent.",
                });
            } else {
                alert(response.statusText);
            }
        } catch (error) {
            console.error("Error sending data or email", error);
        }
    };

    const handleAnswerSelect = (item) => {
        setSelectedAnswerText(item.text);
        setSelectedAnswer(item.marks);
    };

    const getResultMessage = () => {
        if (score >= 10 && score < 20) return { message: "Conservative", color: "text-green-300" };
        if (score >= 20 && score <= 26) return { message: "Moderately Conservative", color: "text-green-600" };
        if (score >= 27 && score <= 33) return { message: "Moderate", color: "text-yellow-300" };
        if (score >= 34 && score <= 39) return { message: "Moderately Aggressive", color: "text-yellow-600" };
        if (score >= 40 && score <= 50) return { message: "Aggressive", color: "text-red-500" };
        return { message: "High Risk Profile", color: "text-red-500" };
    };

    return (
        <>
            <InnerBanner title={'Risk Profile'} />
            <div className="px-4">
                <div className="max-w-7xl mx-auto section">
                    <Toaster />
                    {isModalOpen && (
                        <div className="fixed  inset-0 bg-[#000000a3] bg-opacity-60 z-[5000] items-center flex justify-center ">
                            <div className="p-3 rounded-lg shadow-lg w-[30rem] bg-white  mb-2 max-h-[500px]">
                                <InquiryForm onClose={() => {
                                    setIsModalOpen(false);
                                    setIsFormVisible(true); // Show quiz after form is filled
                                }} />
                            </div>
                        </div>
                    )}
                    {isQuizCompleted ? (
                        <div className="flex flex-col gap-3 items-center text-center">
                            <h2 className="font-bold mb-4 text-[var(--rv-secondary)]">Your Total Score: {score}</h2>
                            <div className={`text-4xl font-semibold  ${getResultMessage().color} `}>
                                {getResultMessage().message}
                            </div>
                            <div className="p-4">
                                <p className="text-lg">Here’s what your score means:</p>
                                <ul className="mt-2 text-left">
                                    <li className="mb-3"><span className="text-lg font-bold">Conservative: </span> Conservative investors are investors who want stability and are more concerned with protecting their current investments than increasing the real value of their investments.</li>
                                    <li className="mb-3"><span className="text-lg font-bold">Moderately Conservative: </span>M Moderately conservative investors are investors who want to protect their capital, and achieve some real increase in the value of their investments.</li>
                                    <li className="mb-3"><span className="text-lg font-bold">Moderate: </span>Moderate investors are long-term investors who want reasonable but relatively stable growth. Some fluctuations are tolerable, but investors want less risk than that attribute to a fully equity based investment.</li>
                                    <li className="mb-3"><span className="text-lg font-bold">Moderately Aggressive: </span>Moderately Aggressive investors are long-term investors who want good real growth in their capital. A fair amount of risk is acceptable.</li>
                                    <li className="mb-3"><span className="text-lg font-bold">Aggressive:</span> Aggressive investors are long-term investors who want high capital growth. Substantial year-to-year fluctuations in value are acceptable in exchange for a potentially high long-term return.</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => {
                                    // Reset the quiz
                                    setCurrentQuestionIndex(0);
                                    setScore(0);
                                    setIsQuizCompleted(false);
                                    setSelectedAnswer(null);
                                    router.push("/")
                                }}
                                className="mt-6 bg-[var(--rv-secondary)] text-white px-4 py-2 rounded-lg "
                            >
                                Back Home
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{questions[currentQuestionIndex]?.question}</h2>
                            <div className="mb-4 ">
                                {questions[currentQuestionIndex]?.answers?.map((answer, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id={`answer - ${index} `}
                                            name="answer"
                                            value={answer.marks}
                                            checked={selectedAnswer === answer.marks}
                                            onChange={() => handleAnswerSelect(answer)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`answer - ${index} `} className="text-lg text-gray-800">{answer.text}</label>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={() => handleNextClick(questions[currentQuestionIndex]?.question)}
                                className="text-white border px-4 py-2 rounded-lg w-1/4 bg-[var(--rv-secondary)] "
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

export default RiskProfile;