import InnerBanner from "@/components/innerBanner/InnerBanner";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const ThankYou = async () => {
  return (
    <>
      <InnerBanner title={"Thankyou"} />
      <section className="section">
        <div className="max-w-screen-xl mx-auto px-4 text-center flex flex-col items-center space-y-3">
          <Image src={"/images/thankyou.gif"} width={300} height={100} alt="thankyou" />
          <h1 className="font-extrabold text-[var(--rv-primary)]">Thank You!</h1>
          <h4>
            We sincerely appreciate your interest and the time you took to fill
            out our enquiry form. We have received your details, and our team will
            be in touch with you soon.
          </h4>
          <Link href={"/"}>
            <FaArrowLeft
              size={30}
              className="text-[var(--rv-primary)] cursor-pointer"
            />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ThankYou;
