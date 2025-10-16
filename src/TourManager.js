import React, { useEffect, useState, useMemo } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';
import { useLocation } from "react-router-dom";

const LOCALE_KO = { back:"뒤로", close:"닫기", last:"완료", next:"다음", skip:"건너뛰기", step:"단계" };

function TourManager() {
    const location = useLocation();
    const [run, setRun] = useState(false);
    const [key, setKey] = useState(0);
    /*
    * If your steps are not dynamic you can use a simple array.
    * Otherwise you can set it as a state inside your component.
    */
    const steps = useMemo(() => {
        if(location.pathname === "/dashboard" || location.pathname ==="/") {
            return [
                {target : '[data-tour-id="dashboard-recommendation"]', content: "오늘 추천 문제를 확인할 수 있어요", placement: "bottom", disableBeacon: true},
                {target : '[data-tour-id="dashboard-stats"]', content: "오늘 하루 맞춘 문제와 추천 문제 기준 학습 진도률을 확인할 수 있어요", placement: "top", disableBeacon: true},
                {target : '[data-tour-id="dashboard-graph"]', content: "지금까지의 정답률을 그래프로 확인할 수 있어요", placement: "bottom", disableBeacon: true},
                {target : '[data-tour-id="dashboard-history"]', content: "이곳에서는 해당 날짜의 푼 갯수와 맞춘 갯수 정답률을 확인할 수 있어요", placement: "top", disableBeacon: true},
            ]
        }
        else if(location.pathname === "/questions") {
            return [
                {target : '[data-tour-id="question-solve-add"]', content: "선택한 문제를 풀거나 만들 수 있어요", placement: "left", disableBeacon: true},
                {target : '[data-tour-id="question-upload-download"]', content: "문제집을 추가하거나 선택한 문제들을 내보내기 할 수 있어요", placement: "bottom", disableBeacon: true},
            ]
        }
        return [];
    },[location.pathname]);

    useEffect(() => {
        setKey(k => k+1);
    },[location.pathname]);

    const onCallback = (data) => {
        const { status, type } = data;
        const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(status);
        if(type === EVENTS.TOUR_END || finished) {
            setRun(false);
            localStorage.setItem("tour-seen", "1");
        }
    }

    useEffect(() => {
        const handler = () => setRun(true);
        window.addEventListener("start-tour",handler);
        return () => window.removeEventListener("start-tour", handler);
    }, []);

    // If you want to delay the tour initialization you can use the `run` prop
    return (
        <Joyride 
            key={key}
            run={run}
            steps={steps} 
            continuous
            showSkipButton
            hideCloseButton={true}
            showCloseButton={false}
            scrollToFirstStep
            disableOverlayClose={true}
            spotlightPadding={0}
            locale={LOCALE_KO}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#3B82F6',    // “다음” 버튼 배경색
                    textColor: '#000000ff',       // 툴팁 글자색
                    backgroundColor: '#FFFFFF', // 툴팁 배경색
                },
                buttonSkip: {
                    color: '#9CA3AF',           // “건너뛰기” 색
                    fontWeight: 500,
                    outline: 'none',
                },
                buttonNext: {
                    backgroundColor: '#3B82F6', // “다음” 버튼 색
                    color: '#fff',
                    outline: 'none',
                },
                buttonBack: {
                    color: '#6B7280',           // “뒤로” 버튼 색
                    outline: 'none',
                },
            }}
            callback={onCallback}
        />
    );
}

export default TourManager;