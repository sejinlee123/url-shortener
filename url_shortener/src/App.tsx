import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import RedirectHandler from "./pages/RedirectHandler";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stats/:code" element={<Stats />} />
        <Route path="/r/:code" element={<RedirectHandler />} />

        {/* Legal section */}
        <Route path="/app/terms" element={<Terms />} />
        <Route path="/app/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/app/cookies-policy" element={<CookiesPolicy />} />
        {/* Default /app/legal to terms */}
        <Route path="/app" element={<Navigate to="/app/terms" replace />} />
        <Route path="/app/*" element={<Navigate to="/app/terms" replace />} />

        {/* Static pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}


