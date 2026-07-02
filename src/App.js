import React, { useEffect } from "react";
import Papa from 'papaparse';
import Router from "Router";
import { useRecoilState } from "recoil";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { allTagAtom, questionsAtom, appPathAtom, userIdAtom, appInitStepAtom } from "state/data.js";
import Navbar from "pages/Navbar.js";
import "react-toastify/dist/ReactToastify.css";
import TourManager from "pages/tour/TourManager.js";
import InitLoading from "pages/loading/InitLoading.js";

const App = () => {
  const [questions, setQuestions] = useRecoilState(questionsAtom);
  const [allTag, setAlltag] = useRecoilState(allTagAtom);
  const [appPath, setAppPath] = useRecoilState(appPathAtom);
  const [userId, setUserId] = useRecoilState(userIdAtom);
  const [appInitStep, setAppInitStep] = useRecoilState(appInitStepAtom);

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
      setAppInitStep("error");
    }
  };

  // setting 파일에서 userId 불러와서 Atom에 넣기 (옵션 추가 되면 그때 수정)
  const initUserId = async() => {
    try{
      const id = await window.electronAPI.getUserId();
      setUserId(id);
      console.log("사용자 id : ", id);
    }catch(error){
      console.error("사용자 id를 Atom에 넣는 과정에서 문제가 발생했습니다.");
      setAppInitStep("error");
    }
  }

  const recommendations = async () => {
    try{
      const result = await window.electronAPI.updateRecommendDates();
      if(!result.success){
        console.error(result.message);
        setAppInitStep("error");
      }
    }catch(error) {
      console.error("추천 날자 보정 실패: ", error);
      setAppInitStep("error");
    }
  };


  useEffect(() => {
    const initializeApp = async () => {
      try{
        console.time("[init] total");

        setAppInitStep("loading-settings");
        console.time("[init] 1. getUserId");
        await initUserId();
        console.timeEnd("[init] 1. getUserId");

        setAppInitStep("loading-questions");
        console.time("[init] 2. readQuestionsCSV (1st)");
        await readElectron();
        console.timeEnd("[init] 2. readQuestionsCSV (1st)");

        setAppInitStep("recommendations");
        console.time("[init] 3. updateRecommendDates");
        await recommendations();
        console.timeEnd("[init] 3. updateRecommendDates");

        setAppInitStep("loading-updateQuestions");
        console.time("[init] 4. readQuestionsCSV (2nd)");
        await readElectron();
        console.timeEnd("[init] 4. readQuestionsCSV (2nd)");

        setAppInitStep("ready");
        console.timeEnd("[init] total");
      } catch(error) {
        console.error("앱 초기화 실패: ", error);
        setAppInitStep("error");
      }
    };

    initializeApp()
  }, []);

  useEffect(() => {
    const tagSet = new Set();
    questions.map((question) => question.tag.map((item) => { tagSet.add(item) }));
    setAlltag([...tagSet]);


    const updateQuestionsAsync = async () => {
      try {
        console.time("[app] ① Papa.unparse (CSV 변환)");
        const csv = Papa.unparse(
          questions.map(({ id, checked, ...rest }) => rest)
        );
        console.timeEnd("[app] ① Papa.unparse (CSV 변환)");

        console.time("[app] ② writeQuestionsCSV IPC 전체");
        await window.electronAPI.writeQuestionsCSV(csv);
        console.timeEnd("[app] ② writeQuestionsCSV IPC 전체");
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

  if(appInitStep !== "ready"){
    return<InitLoading step={appInitStep} />;
  }

  return (
    <div>
      <HashRouter>
        <Navbar />
        <TourManager/>
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
