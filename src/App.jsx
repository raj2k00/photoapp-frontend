import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Layout from "./Layout.jsx";
import Home from "./Home";
import Empty from "./Error";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<Empty />} />
        </Route>
      </Routes>
    </div>
  );
}
