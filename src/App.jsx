import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./index.css";

const Home = lazy(() => import("./pages/HomePage"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route path="/u/:userId" element={<PublicProfile />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}