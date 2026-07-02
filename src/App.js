import React, { useEffect } from "react";
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

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.time("[init] total");
        setAppInitStep("loading");

        console.time("[init] parallel (getUserId + initQuestions)");
        await Promise.all([
          (async () => {
            const id = await window.electronAPI.getUserId();
            setUserId(id);
            console.log("사용자 id : ", id);
          })(),
          (async () => {
            const result = await window.electronAPI.initQuestions();
            if (result.success) {
              setAlltag(result.allTag);
              setQuestions(result.questions);
            } else {
              console.error(result.message);
              setAppInitStep("error");
            }
          })(),
        ]);
        console.timeEnd("[init] parallel (getUserId + initQuestions)");

        setAppInitStep("ready");
        console.timeEnd("[init] total");
      } catch (error) {
        console.error("앱 초기화 실패: ", error);
        setAppInitStep("error");
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const tagSet = new Set();
    questions.forEach(question => question.tag.forEach(item => tagSet.add(item)));
    setAlltag([...tagSet]);
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
