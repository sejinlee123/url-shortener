import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import RedirectHandler from "./pages/RedirectHandler";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats/:code" element={<Stats />} />
        <Route path="/r/:code" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}
