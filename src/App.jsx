import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import PublicProfile from "./pages/PublicProfile";
import FaceVerify from "./pages/FaceVerify";

import "./index.css";


export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/face-verify" element={<FaceVerify />} />
        <Route path="/u/:userId" element={<PublicProfile />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </HashRouter>
  );
}
