import React from "react";
import {  Route, Routes } from "react-router-dom";
import Solve from "pages/solve/Solve";
import Questions from "pages/question/Questions";
import Dashboard from "pages/dashboard/Dashboard";
import SelectSolve from "pages/solve/SelectSolve";
import Card from "pages/solve/Card";
import CardResult from "pages/solve/CardResult";
import SolveResult from "pages/solve/SolveResult";




const Router = () => {
  return (
      <Routes>
       {}
        <Route path="/" element={<Dashboard />} />
        <Route path="/solve" element={<Solve />} />
        <Route path="/solve/result" element={<SolveResult />} />
        <Route path="/card" element={<Card />} />
        <Route path="/select" element={<SelectSolve/>} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/card/result" element={<CardResult />} />
        
      </Routes>
  );
};

export default Router;