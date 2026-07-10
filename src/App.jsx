import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./index.css";

const Home = lazy(() => import("./pages/HomePage"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const SubscribeSuccess = lazy(() => import("./pages/SubscribeSuccess"));

// If root is loaded with ?token=..., this is the WebView activation flow —
// redirect into /subscribe (client-side, no server round-trip) while
// keeping the token in the querystring. Otherwise, show the normal Home page.
function RootRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <Navigate to={`/subscribe?token=${token}`} replace />;
  }
  return <Home />;
}

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
          <Route path="/" element={<RootRoute />} />
          <Route path="/u/:userId" element={<PublicProfile />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/subscribe/success" element={<SubscribeSuccess />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}