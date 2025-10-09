import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ Lazy-load all route pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const ReferAndEarn = lazy(() => import("./pages/ReferAndEarn"));
const Services = lazy(() => import("./pages/Services"));
const Faqs = lazy(() => import("./pages/Faqs"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));

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

      {/* Main Page Routes */}
      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Suspense shows fallback while component chunks are loading */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/booking" element={<Booking language={language} />} />
            <Route path="/contact" element={<Contact language={language} />} />
            <Route
              path="/refer"
              element={<ReferAndEarn language={language} />}
            />
            <Route
              path="/services"
              element={<Services language={language} />}
            />
            <Route path="/faqs" element={<Faqs language={language} />} />
            <Route path="/terms" element={<PolicyPage language={language} />} />
            <Route
              path="/privacy"
              element={<PolicyPage language={language} />}
            />
            <Route
              path="/refunds"
              element={<PolicyPage language={language} />}
            />
          </Routes>
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer language={language} />
    </Router>
  );
}

export default App;
