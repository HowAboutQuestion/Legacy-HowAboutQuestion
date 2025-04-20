import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { allTagAtom, questionsAtom, appPathAtom } from "state/data";
import Router from "Router";
import Navbar from "pages/Navbar";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [questions, setQuestions] = useRecoilState(questionsAtom);
  const [allTag, setAlltag] = useRecoilState(allTagAtom);
  const [appPath, setAppPath] = useRecoilState(appPathAtom);

  // CSV 데이터를 비동기적으로 읽어오는 함수
  const readElectron = async () => {
    try {
      // 상태 업데이트 후 비동기적으로 CSV 데이터를 처리
      const result = await window.electronAPI.readQuestionsCSV();
      if (result.success) {
        setAlltag(result.allTag);   // 모든 태그 설정
        setQuestions(result.questions); // 질문 데이터 설정
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('CSV 읽기 실패:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트되면 CSV 데이터를 읽기
    readElectron();
  }, []);

  useEffect(() => {
    const tagSet = new Set();
    questions.map((question) => question.tag.map((item) => { tagSet.add(item) }));
    setAlltag([...tagSet]);


    const updateQuestionsAsync = async () => {
      try {
        // 상태 업데이트 후 비동기적으로 questions를 처리
        const result = await window.electronAPI.updateQuestions(questions);
      } catch (error) {
        console.error("[App.js] updateQuestionsAsync", error)
      }
    };

    if (questions.length > 0) {
      updateQuestionsAsync(); // 비동기로 호출
    }
  }, [questions]);

  useEffect(() => {
    const readAppPath = async () => {
      try {
        const result = await window.electronAPI.readAppPath();
        if (result && result.appPath) {
          setAppPath(`file:///${result.appPath.replace(/\\/g, "/")}/`);
        }
        console.log(result);
      } catch (error) {
        console.error("cannot read appPath :", error);
      }
    };

    readAppPath();
  }, []);




  return (
    <div>
      <HashRouter>
        <Navbar />
        <Router />
      </HashRouter>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

const Root = () => <App />;

export default Root;
