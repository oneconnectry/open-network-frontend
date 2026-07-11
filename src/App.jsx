import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./index.css";

const Home = lazy(() => import("./pages/HomePage"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const SubscribeSuccess = lazy(() => import("./pages/SubscribeSuccess"));

// If ANY path is loaded with ?token=..., this is the WebView activation flow —
// redirect into /subscribe (client-side, no server round-trip) while
// keeping the token in the querystring. Skip if already on /subscribe to
// avoid a redirect loop. Otherwise render routes normally, same as /u/:userId
// always resolving to PublicProfile regardless of path.
function TokenGate({ children }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const alreadyOnSubscribe = window.location.pathname.startsWith("/subscribe");

  if (token && !alreadyOnSubscribe) {
    return <Navigate to={`/subscribe?token=${token}`} replace />;
  }
  return children;
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
        <TokenGate>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:userId" element={<PublicProfile />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscribe/success" element={<SubscribeSuccess />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </TokenGate>
      </Suspense>
    </BrowserRouter>
  );
}