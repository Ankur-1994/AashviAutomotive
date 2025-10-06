import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Helmet } from "react-helmet";

interface AboutContent {
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
}

interface AboutProps {
  language: "en" | "hi";
}

const About = ({ language }: AboutProps) => {
  const [about, setAbout] = useState<AboutContent | null>(null);

  // Fetch About content
  useEffect(() => {
    const fetchAbout = async () => {
      const docRef = doc(db, "content", "about");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAbout(docSnap.data() as AboutContent);
    };
    fetchAbout();
  }, []);

  if (!about) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="font-sans">
      <Helmet>
        <title>
          {language === "en"
            ? "About Us | Aashvi Automotive"
            : "हमारे बारे में | आश्वी ऑटोमोटिव"}
        </title>
        <meta
          name="description"
          content={
            language === "en"
              ? "Learn more about Aashvi Automotive, the best multibrand 2-wheeler workshop in Rajnagar, Madhubani."
              : "आश्वी ऑटोमोटिव के बारे में जानें, राजनगर, मधुबनी में सबसे अच्छा मल्टीब्रांड 2-व्हीलर कार्यशाला।"
          }
        />
      </Helmet>

      {/* About Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-16 bg-gradient-to-r from-primary via-blue-700 to-primary text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {language === "en" ? about.title_en : about.title_hi}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-center drop-shadow">
          {language === "en" ? about.desc_en : about.desc_hi}
        </p>
      </section>
    </div>
  );
};

export default About;
