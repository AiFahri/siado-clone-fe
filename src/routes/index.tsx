import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { PublicRoutes } from "./public";
// import { ProtectedRoutes } from "./protected";
import Home from "../Pages/Home";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
