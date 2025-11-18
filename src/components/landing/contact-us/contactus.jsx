import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import styles from "./ContactForm.module.css";
import ContactReusableForm from "../contactSectionPage/Contactreusableform";

export function ContactUs({ sitedata,services }) {
  return (
    <section className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[450px] overflow-hidden">
        {/* Left Side */}
        <div className="col-span-12 md:col-span-5 bg-[--rv-primary] text-white p-8 flex flex-col justify-between rounded-tr-[200px]">
          <div>
            <h2 className={styles.heading}>
              Take The <br />
               First Step
            </h2>
            <p className="mt-2">
              Together, let's make your unique financial goals and dreams achievable. 
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex flex-col gap-2">
              <h4>Send Us Email</h4>
              <div className="flex gap-2 items-center">
                <Mail size={20} />
                <span className="break-all">
                  {sitedata?.email || "webhelp@redvisiontech.com"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>Call for Inquiry</h4>
              <div className="flex gap-2 items-center">
                <Phone size={20} />
                <span>{sitedata?.mobile || "+91 81090 60608"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>WhatsApp</h4>
              <div className="flex gap-2 items-center">
                <MessageSquare size={20} />
                <span>{sitedata?.whatsAppNo || "+91 81090 60608"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>Visit Us</h4>
              <div className="flex gap-2 items-center">
                <MapPin size={20} />
                <span>{sitedata?.address || "Indore"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="col-span-12 md:col-span-7 bg-white p-6 md:p-10">
          <h3 className="font-semibold text-center mb-6">Send us a message</h3>

<ContactReusableForm services={services} sitedata={sitedata} />
      
        </div>
      </div>

    </section>
  );
}
