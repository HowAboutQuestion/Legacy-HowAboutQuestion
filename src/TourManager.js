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
    
    const [cur, setCur] = useState(0);
    const [total, setTotal] = useState(0);

    /*
    * If your steps are not dynamic you can use a simple array.
    * Otherwise you can set it as a state inside your component.
    */
    const steps = useMemo(() => {
        if(location.pathname === "/dashboard" || location.pathname ==="/") {
            return [
                {
                    target: 'body', 
                    title: (<div style={{width: '600px'}}><p style={{ color: '#1D4ED8', fontSize:'20px', fontWeight: 'bold'}} >대시보드 페이지에 오신걸 환영합니다</p> </div>), 
                    content: (
                        <div style={{width: '600px'}}> 
                            <p style={{fontSize: '14px' }}>이 곳에서는 사용자의 학습 데이터를 기반으로 <br/> 오늘의 추천 문제를 제공합니다.</p>
                            <p style={{fontSize: '14px'}}>또한, 내가 푼 문제 수, 맞춘 문제 수, 정답률을 한눈에 확인하고 <br/> 과거 기록도 조회할 수 있습니다.</p>
                        </div>
                    ), 
                    placement: 'center', 
                    disableBeacon: true,
                },
                {
                    target : '[data-tour-id="dashboard-recommendation"]', 
                    content:( 
                        <div style={{width: '600px'}}> 
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                오늘의 추천 문제
                            </p>
                            <p>
                                “오늘의 추천 문제”를 통해 자주 틀리거나 새로 생성된 문제를 복습하세요!
                            </p>
                            <p>
                                학습한 문제는 자주 맞출수록 덜 등장하고, 자주 틀릴수록 더 자주 추천됩니다.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    target : '[data-tour-id="dashboard-stats"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                            오늘의 학습 진도율 안내
                            </p>
                            <p style={{ fontSize: '14px'}}>
                            오늘 맞춘 문제와 추천 문제를 기준으로 진도율이 계산됩니다.
                            </p>
                        </div>
                    ), 
                    placement: "top", 
                    disableBeacon: true},
                {
                    target : '[data-tour-id="dashboard-graph"]', 
                    content: "지금까지의 정답률을 그래프로 확인할 수 있어요", 
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    target : '[data-tour-id="dashboard-history"]', 
                    content: (<div>"이곳에서는 <br/> 해당 날짜의 <strong>푼 개수</strong>와 <strong>맞춘 갯수 정답률</strong>을 확인할 수 있어요"</div>), 
                    placement: "top", 
                    disableBeacon: true
                },
            ]
        }
        else if(location.pathname === "/questions") {
            return [
                {target: 'body',  
                    title: <h1>문제 관리 페이지에 오신걸 환영합니다</h1> ,   
                    content: "이곳은 문제를 만들고 공유하며, 수정할 수 있는 공간이에요.", 
                    placement: 'center', 
                    disableBeacon: true,
                },
                {
                    target: '[data-tour-id="question-root"]', 
                    content: "내가 만든 문제와 추가한 문제가 여기에 표시돼요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true }
                },
                {
                    id: "tag-modal", 
                    target: '[data-tour-id="tag-name"]', 
                    content: "문제집과 태그를 확인하고, 클릭해 필터링할 수 있어요.", 
                    placement: "right", 
                    disableBeacon: true
                },
                {
                    target: '[data-tour-id="question-solve-add"]', 
                    content: "이 버튼으로 문제를 풀거나 새로 만들 수 있어요.", 
                    placement: "left", 
                    disableBeacon: true
                },
                {
                    target: '[data-tour-id="question-upload-download"]', 
                    content: "문제집을 추가하거나 선택한 문제를 내보낼 수 있어요.", 
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "in-insert-modal", 
                    target: '[data-tour-id="insert-modal-root"]', 
                    content: "여기에서 문제 내용을 입력할 수 있어요.", 
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-tag"]', 
                    content: "쉼표(,)로 구분해 태그나 문제집 이름을 지정할 수 있어요.", 
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-select"]', 
                    content: "이 버튼으로 정답을 선택할 수 있어요.", 
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-expend"]', 
                    content: "창이 작다면 여기를 눌러 확장해 보세요. 설명이나 글을 더 쓸 수 있어요.", 
                    placement: "bottom", 
                    disableBeacon: true
                },

            ]
        } else if(location.pathname === "/select") {
            return [
                {
                    target: 'body',  
                    title: <h3>문제 풀기 페이지에 오신 것을 환영합니다</h3> ,   
                    content: "이곳에서 시험 또는 카드 형식으로 문제를 풀어 볼 수 있어요", 
                    placement: 'center', 
                    disableBeacon: true,
                },
                {
                    target: '[data-tour-id="exam-timer"]', 
                    content: "문제 풀이 시간을 설정할 수 있어요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
                {
                    target: '[data-tour-id="exam-select-shuffle"]', 
                    content: "객관식 선택지를 무작위로 섞어요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
                {
                    target: '[data-tour-id="exam-shuffle"]', 
                    content: "문제 출제 순서를 섞어요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
                {
                    target: '[data-tour-id="exam-card"]', 
                    content: "선택한 문제를 카드 형식으로 풀어요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
                {
                    target: '[data-tour-id="exam-select"]', 
                    content: "선택한 문제를 시험 형태로 풀어요.", 
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
            ]
        }
        return [];
    },[location.pathname]);

    useEffect(() => {
        setKey(k => k+1);
    },[location.pathname]);

    useEffect(() => {
        setTotal(steps.length);
        if(run && steps.length > 0) setCur(1);
    }, [steps, run]);

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
            setCur(0);
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

        if([EVENTS.STEP_AFTER, EVENTS.STEP_BEFORE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            setCur(index + 1);
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

    const progressPct = Math.round((cur / Math.max(total, 1)) * 100);

    // If you want to delay the tour initialization you can use the `run` prop
    return (
        <>
            {run && total > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        width: 200,
                        zIndex: 11000,
                        background: 'rgba(255,255,255,0.96)',
                        borderRadius: 12,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                        padding: '10px 12px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#374151' }}>도움말 진행</span>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{cur}/{total}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: '#E5E7EB' }}>
                        <div
                            style={{
                                width: `${progressPct}%`,
                                height: '100%',
                                borderRadius: 999,
                                background: '#3B82F6',
                                transition: 'width .25s ease'
                            }}
                        />
                    </div>
                </div>
            )}


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
                    tooltip: {
                        width: 640,          // ⬅️ 고정 폭
                        maxWidth: 640,       // (안전) 상한도 동일
                        padding: '20px 24px',
                        borderRadius: 12,
                    },
                    tooltipContainer: {
                        lineHeight: 1.6,
                        fontSize: '14px',
                    },
                }}
                callback={onCallback}
            />
        </>
    );
}

export default TourManager;