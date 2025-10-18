import React, { useEffect, useState, useMemo } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';
import { useLocation } from "react-router-dom";

const LOCALE_KO = { back:"뒤로", close:"닫기", last:"완료", next:"다음", skip:"건너뛰기", step:"단계" };

function TourManager() {
    const location = useLocation();
    const [run, setRun] = useState(false);
    const [key, setKey] = useState(0);
    const [padding, setPadding] = useState(8);
    const [lockScroll, setLockScroll] = useState(false); 

    /*
    * If your steps are not dynamic you can use a simple array.
    * Otherwise you can set it as a state inside your component.
    */
    const steps = useMemo(() => {
        if(location.pathname === "/dashboard" || location.pathname ==="/") {
            return [
                {target: 'body', title: <h1>대시보드 페이지에 오신걸 환영합니다</h1>, content: (<div style={{ textAlign: 'center' }}> <p>이 곳에서는 문제 추천, 학습 진도률, 히스토리 등 확인할 수 있어요.</p></div>), placement: 'center', disableBeacon: true,},
                {target : '[data-tour-id="dashboard-recommendation"]', content: "오늘 추천 문제를 확인할 수 있어요", placement: "bottom", disableBeacon: true},
                {target : '[data-tour-id="dashboard-stats"]', content: "오늘 하루 맞춘 문제와 추천 문제 기준 학습 진도률을 확인할 수 있어요", placement: "top", disableBeacon: true},
                {target : '[data-tour-id="dashboard-graph"]', content: "지금까지의 정답률을 그래프로 확인할 수 있어요", placement: "bottom", disableBeacon: true},
                {target : '[data-tour-id="dashboard-history"]', content: "이곳에서는 해당 날짜의 푼 갯수와 맞춘 갯수 정답률을 확인할 수 있어요", placement: "top", disableBeacon: true},
            ]
        }
        else if(location.pathname === "/questions") {
            return [
                {target: 'body',  title: <h1>문제 관리 페이지에 오신걸 환영합니다</h1> ,   content: "이곳은 문제를 만들고 공유하며, 수정할 수 있는 공간이에요.", placement: 'center', disableBeacon: true,},
                {target: '[data-tour-id="question-root"]', content: "내가 만든 문제와 추가한 문제가 여기에 표시돼요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},
                {id: "tag-modal", target: '[data-tour-id="tag-name"]', content: "문제집과 태그를 확인하고, 클릭해 필터링할 수 있어요.", placement: "right", disableBeacon: true},
                {target: '[data-tour-id="question-solve-add"]', content: "이 버튼으로 문제를 풀거나 새로 만들 수 있어요.", placement: "left", disableBeacon: true},
                {target: '[data-tour-id="question-upload-download"]', content: "문제집을 추가하거나 선택한 문제를 내보낼 수 있어요.", placement: "bottom", disableBeacon: true},
                {id: "in-insert-modal", target: '[data-tour-id="insert-modal-root"]', content: "여기에서 문제 내용을 입력할 수 있어요.", placement: "bottom", disableBeacon: true},
                {id: "lock", target: '[data-tour-id="insert-modal-tag"]', content: "쉼표(,)로 구분해 태그나 문제집 이름을 지정할 수 있어요.", placement: "bottom", disableBeacon: true},
                {id: "lock", target: '[data-tour-id="insert-modal-select"]', content: "이 버튼으로 정답을 선택할 수 있어요.", placement: "bottom", disableBeacon: true},
                {id: "lock", target: '[data-tour-id="insert-modal-expend"]', content: "창이 작다면 여기를 눌러 확장해 보세요. 설명이나 글을 더 쓸 수 있어요.", placement: "bottom", disableBeacon: true},

            ]
        } else if(location.pathname === "/select") {
            return [
                {target: 'body',  title: <h3>문제 풀기 페이지에 오신 것을 환영합니다</h3> ,   content: "이곳에서 시험 또는 카드 형식으로 문제를 풀어 볼 수 있어요", placement: 'center', disableBeacon: true,},
                {target: '[data-tour-id="exam-timer"]', content: "문제 풀이 시간을 설정할 수 있어요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},
                {target: '[data-tour-id="exam-select-shuffle"]', content: "객관식 선택지를 무작위로 섞어요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},
                {target: '[data-tour-id="exam-shuffle"]', content: "문제 출제 순서를 섞어요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},
                {target: '[data-tour-id="exam-select"]', content: "선택한 문제를 시험 형태로 풀어요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},
                {target: '[data-tour-id="exam-card"]', content: "선택한 문제를 카드 형식으로 풀어요.", placement: "left-start", disableBeacon: true, floaterProps: { disableFlip: true }},


            ]
        }
        return [];
    },[location.pathname]);

    useEffect(() => {
        setKey(k => k+1);
    },[location.pathname]);


    const onCallback = (data) => {
        const { status, type, index } = data;
        const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(status);
        const noFollowIds = new Set([
            "in-insert-modal",
            "lock"
        ]);

        if(type === EVENTS.TOUR_END || finished) {
            setRun(false);
            localStorage.setItem("tour-seen", "1");
            setLockScroll(false);
        }

        if (type === EVENTS.STEP_BEFORE) {
        const id = steps[index]?.id;

        // 스크롤 락 (자동 스크롤 비활성)
        setLockScroll(noFollowIds.has(id));

        // spotlight padding 제어
        if (id === "in-insert-modal" || id === "tag-modal") {
            setPadding(0);
        } else {
            setPadding(8);
        }
        }
    }

    useEffect(() => {
    if (run) document.body.classList.add('joyride-running');
    else document.body.classList.remove('joyride-running');
    return () => document.body.classList.remove('joyride-running');
    }, [run]);

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
            scrollToFirstStep
            disableScrolling={lockScroll} 
            disableOverlayClose={true}
            spotlightPadding={padding}
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
                    fontWeight: 'bold'
                },
                buttonBack: {
                    color: '#6B7280',           // “뒤로” 버튼 색
                    outline: 'none',
                },
                overlay: {
                    backgroundColor: 'rgba(0,0,0,0.45)', // 전체 어두움(원하는 투명도로 조절)
                    },
                    spotlight: {
                    borderRadius: 12,                    // 필요시 둥글게
                    // 테두리 원인인 1px 스트로크 제거: '큰 그림자'만 유지
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                },
            }}
            callback={onCallback}
        />
    );
}

export default TourManager;