import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Optional: you can add a scroll-to-top effect when route changes
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <Router>
      <ScrollToTop />
      {/* Global Navbar */}
      <Navbar language={language} setLanguage={setLanguage} />

      {/* Page Routes */}
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/about" element={<About language={language} />} />
          <Route path="/booking" element={<Booking language={language} />} />
          <Route path="/contact" element={<Contact language={language} />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer language={language} />
    </Router>
  );
}

export default App;
