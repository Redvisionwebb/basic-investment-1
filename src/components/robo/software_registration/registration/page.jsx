"use client";
import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ChevronDownIcon } from "lucide-react";
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/lib/fullSchema"; // path as per your project
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderCircle from "@/components/Loader/LoaderCircle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Registration = ({ roboUser,sitedata, login }) => {
  console.log(roboUser)
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showBSEPopup, setShowBSEPopup] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [provider, setProvider] = useState({ username: "", password: "" });
  const [timer, setTimer] = useState(120) // 2 minutes in seconds
  const [resendEnabled, setResendEnabled] = useState(false);
  const [desk, setDesk] = useState(login?.name || login?.loginitems[0].login_desk); // IFA ya ARN

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email_id: "",
      mobile_number: "",
      pan_number: "",
      dob: undefined,
      otp: "",
      arn_no: "",
      pcode: [],
      amount: [],
    },
  });


  useEffect(() => {
    try {
      const storedData = localStorage.getItem("investmentData");
      if (storedData) {
        const parsed = JSON.parse(storedData);

        // make sure funds exist before mapping
        if (Array.isArray(parsed.funds)) {
          const pcodeArray = parsed.funds.map((f) => f.pcode);
          const amountArray = parsed.funds.map((f) => f.allocationAmount);

          setProvider((prev) => ({
            ...prev,
            arn_no: parsed.arnnumber || roboUser?.arnNumber ||"",
            pcode: pcodeArray,
            amount: amountArray,
          }));
        }
      }
    } catch (error) {
      console.error("Error parsing investmentData from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    try {
      const encryptedName = localStorage.getItem("client_name");
      const encryptedPan = localStorage.getItem("client_pan");
      const encryptedDob = localStorage.getItem("client_dob");
      if (encryptedName && encryptedPan && encryptedDob) {
        const name = CryptoJS.AES.decrypt(encryptedName, secretKey).toString(CryptoJS.enc.Utf8);
        const pan = CryptoJS.AES.decrypt(encryptedPan, secretKey).toString(CryptoJS.enc.Utf8);
        const dobStr = CryptoJS.AES.decrypt(encryptedDob, secretKey).toString(CryptoJS.enc.Utf8);

        // ✅ Parse DOB string to Date object
        const parsedDob = new Date(dobStr);
        const isValidDate = !isNaN(parsedDob);
        setValue("name", name);
        setValue("pan_number", pan);
        if (isValidDate) {
          setValue("dob", parsedDob);
        }
      }
      else if (encryptedPan) {
        const panNew = CryptoJS.AES.decrypt(encryptedPan, secretKey).toString(CryptoJS.enc.Utf8);
        setValue("pan_number", panNew)
      }
    } catch (error) {
      console.error("Decryption error:", error);
    }
  }, [setValue]);

  useEffect(() => {
    if (timer <= 0) {
      setResendEnabled(true)
      return
    }

    setResendEnabled(false)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setResendEnabled(true) // enable button when timer ends
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("client_name") // remove when page closes or reloads
      localStorage.removeItem("client_dob") // remove when page closes or reloads
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      localStorage.removeItem("client_name") // remove when component unmounts (navigation)
      localStorage.removeItem("client_dob") // remove when component unmounts (navigation)
    }
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const onGenerateOtp = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/check-account`, {
        ...data, arn_id: roboUser.arnId, arn_no: roboUser.arnNumber,
      });
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      const encryptedUser = CryptoJS.AES.encrypt(res.data.userName, secretKey).toString();
      const encryptedPass = CryptoJS.AES.encrypt(res.data.Password, secretKey).toString();

      localStorage.setItem("client_user", encryptedUser);
      localStorage.setItem("client_pass", encryptedPass);

      const msg = res.data?.msg || "";
      if (msg.includes("account is already created")) {
        setLoading(false);
        setShowBSEPopup(true);
        setSuccessText("It seems that your account is already created. Credential shared on your registered email and mobile number.");
      } else if (msg.includes("OTP sent") && res.data.status) {
        setLoading(false);
        setShowOtpModal(true) // open OTP modal
        setOtpSend(true);
        toast.success(msg);
      } else if (msg.includes("This Email ID is already registered")) {
        setLoading(false);
        setSuccessText("It seems that your account is already created. Credential shared on your registered email and mobile number.");
        toast.warn(msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onVerifyOtp = async (data) => {
    setLoading(true);
    setErrorMessage(""); // Clear any previous error
  // close modal after success
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/verify-o-t-p`, {
        arnId: roboUser.arnId,
        // arn_no: roboUser.arnNumber,
        // arnId: data.arn_id,
        name: data.name,
        emailId: data.email_id,
        mobileNumber: data.mobile_number,
        panNumber: data.pan_number,
        dob: data.dob?.toISOString().split("T")[0],
        otpNumber: data.otp,
        source: 'WebRobo',
      });
      const msg = res.data?.msg || "";
      const apiResponse = res.data;
      const softwareData = {
        username: apiResponse.username,
        password: apiResponse.password,
        loginFor: 'CLIENT',
        callbackUrl: sitedata?.callbackurl,
        siteUrl: "",
        pcode: provider.pcode || [],
        amount: provider.amount || [],
        arn_no: provider.arn_no || "",
      };
        if (apiResponse.status === false && msg.includes("This is Wrong OTP or OTP not Verified")) {
        setErrorMessage(msg);
        setLoading(false)
        setShowOtpModal(true)
      }
      if (msg.includes("Login Credentials sent")) {
        const endpoint =
          desk === "ARN"
            ? "/api/login/arn-login"
            : "/api/login/ifa-login";
        const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${endpoint}`, softwareData);
        if (res.data.status === true) {
          setProvider((prev) => ({ ...prev, username: "", password: "" }));
          router.push(`${res.data.url}`);
            setShowOtpModal(false) 
        } else {
          alert(res.data.msg);
        }
      } else {
        setErrorMessage(msg);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setErrorMessage("Something went wrong. Please try again later.");
        setShowOtpModal(false) 
    }
  };

  // Resend OTP button click
  const handleResendOtp = () => {
    const formData = getValues() // get existing form values
    onGenerateOtp(formData) // call the same function
    setTimer(120)             // reset timer to 2 minutes
    setResendEnabled(false)   // disable resend button
  }

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div
        onClick={onClick} // must call this to open calendar
        ref={ref}
        className="flex items-center border-none rounded px-2 py-1 w-[394px] cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
      >
        <input
          value={value}
          onChange={() => { }}
          className="flex-1 outline-none bg-transparent"
          placeholder="Select DOB"
          readOnly
        />
        <CalendarIcon className="ml-2 h-5 w-5" />
      </div>
    );
  });

  CustomDateInput.displayName = "CustomDateInput";
  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80">
          <LoaderCircle loadingText="Signing up..." />
        </div>
      )}
      <div className=" flex items-center justify-center " >
        <Card className="w-full max-w-md border-none shadow-none" style={{ background: 'var(--rv-gredient)' }} >
          <CardHeader>
            {/* <h1 className="text-2xl font-bold text-center">Register Now</h1> */}
            <h2 className="font-bold">Register Now</h2>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onGenerateOtp)} className="space-y-4">
              <label className="block text-sm font-medium ">
                      Name
                    </label>
              <input {...register("name")} placeholder="Name" className="w-full outline-none rounded px-3 py-3 text-sm bg-white" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

<label className="block text-sm font-medium ">
                      PAN NO
                    </label>
              <input {...register("pan_number")} placeholder="PAN" className="w-full outline-none rounded px-3 py-3 text-sm bg-white" />
              {errors.pan_number && <p className="text-sm text-red-500">{errors.pan_number.message}</p>}

<label className="block text-sm font-medium ">
                      DOB
                    </label>
              {/* DOB with calendar */}
            <div className="bg-white">
                <Popover open={open} onOpenChange={setOpen}>
                <DatePicker
                  selected={getValues("dob")}
                  onChange={(date) => setValue("dob", date)}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Select DOB"
                  customInput={<CustomDateInput />}
                />
              </Popover>
            </div>

              {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}

<label className="block text-sm font-medium ">
                      Email
                    </label>
              <input {...register("email_id")} placeholder="Email" className="w-full outline-none rounded px-3 py-3 text-sm bg-white" />
              {errors.email_id && <p className="text-sm text-red-500">{errors.email_id.message}</p>}

              <label className="block text-sm font-medium ">
                      Mobile Number
                    </label>
              <input {...register("mobile_number")} placeholder="Mobile" maxLength={10} className="w-full outline-none rounded px-3 py-3 text-sm bg-white" />
              {errors.mobile_number && <p className="text-sm text-red-500">{errors.mobile_number.message}</p>}

              <button type="submit" className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded disabled:opacity-60" disabled={loading}>
                {loading ? "Sending OTP..." : "Generate OTP"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

    <div className="bg-white">
        <Dialog open={showOtpModal} onOpenChange={setShowOtpModal} >
        <DialogContent className="bg-white" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <Input {...register("otp")} placeholder="Enter OTP" />
            {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            <p className="text-sm text-gray-500">
              {resendEnabled ? "You can resend OTP now." : `Resend OTP in ${formatTime(timer)}`}
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded disabled:opacity-60"
              disabled={!resendEnabled || loading}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>

            <DialogFooter>
              <button type="submit" className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded disabled:opacity-60" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

      {/* Modal for BSE Redirect */}
      <Dialog open={showBSEPopup} onOpenChange={setShowBSEPopup} style={{ background: 'var(--rv-bg-gradient)' }}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          Dear user, {successText} Please proceed to Login to your account.
          <DialogFooter>
            <Button className="hover:bg-[var(--rv-secondary)]" onClick={() => router.push("/login")}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Registration;
