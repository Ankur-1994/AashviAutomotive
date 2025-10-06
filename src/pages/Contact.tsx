import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Helmet } from "react-helmet";

interface ContactContent {
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapEmbedUrl: string;
}

interface ContactProps {
  language: "en" | "hi";
}

const Contact = ({ language }: ContactProps) => {
  const [contactContent, setContactContent] = useState<ContactContent | null>(
    null
  );

  useEffect(() => {
    const fetchContactContent = async () => {
      const docRef = doc(db, "content", "contact");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setContactContent(docSnap.data() as ContactContent);
    };
    fetchContactContent();
  }, []);

  if (!contactContent)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 md:px-20 py-16">
      <Helmet>
        <title>
          {language === "en"
            ? "Contact Us | Aashvi Automotive"
            : "संपर्क करें | आश्वी ऑटोमोटिव"}
        </title>
        <meta
          name="description"
          content={
            language === "en"
              ? "Get in touch with Aashvi Automotive, your trusted multibrand 2-wheeler service center in Rajnagar, Madhubani."
              : "आश्वी ऑटोमोटिव से संपर्क करें, राजनगर, मधुबनी में आपका भरोसेमंद मल्टीब्रांड 2-व्हीलर सर्विस सेंटर।"
          }
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-primary mb-4">
        {language === "en" ? contactContent.title_en : contactContent.title_hi}
      </h1>
      <p className="text-gray-700 text-center max-w-2xl mb-8">
        {language === "en" ? contactContent.desc_en : contactContent.desc_hi}
      </p>

      {/* Contact Info */}
      <div className="flex flex-col md:flex-row md:space-x-12 items-center mb-8">
        <a
          href={`tel:${contactContent.phone}`}
          className="text-primary font-semibold hover:underline mb-4 md:mb-0"
        >
          {language === "en" ? "Phone:" : "फोन:"} {contactContent.phone}
        </a>
        <a
          href={`https://wa.me/${contactContent.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 font-semibold hover:underline mb-4 md:mb-0"
        >
          {language === "en" ? "WhatsApp:" : "व्हाट्सएप:"}{" "}
          {contactContent.whatsapp}
        </a>
        <a
          href={`mailto:${contactContent.email}`}
          className="text-primary font-semibold hover:underline"
        >
          {language === "en" ? "Email:" : "ईमेल:"} {contactContent.email}
        </a>
      </div>

      {/* Google Map */}
      <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={contactContent.mapEmbedUrl}
          width="100%"
          height="100%"
          loading="lazy"
          className="border-0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
