import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const HomePage = lazy(() => import("./page/homePage"));

function App() {
  return (
    <Router basename="/lp">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path=":lpName" element={<HomePage />} /> {/* Remove leading "/" */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
