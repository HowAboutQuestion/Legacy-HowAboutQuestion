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
                            <p style={{ fontSize: '14px' }}>
                                이곳에서는 사용자의 학습 데이터를 기반으로 오늘의 추천 문제를 제공합니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                또한, <strong>푼 문제 수, 맞춘 문제 수, 정답률</strong>을 한눈에 확인하고, 과거 기록을 손쉽게 조회할 수 있습니다.
                            </p>
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
                            <p style={{ fontSize: '14px' }}>
                                “오늘의 추천 문제”를 통해 자주 틀리거나 새로 생성된 문제를 <strong>복습</strong>하세요!
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                학습한 문제는 <strong>자주 맞출수록 덜 등장</strong>하고, <strong>자주 틀릴수록 더 자주 추천</strong>됩니다.
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
                                오늘 푼 문제 수와 맞춘 문제 개수를 확인할 수 있습니다. 
                            </p>
                            <p style={{ fontSize: '14px'}}>
                                학습 진도는 <strong>추천 문제 중 푼 개수</strong>에 따라 달라집니다.
                            </p>
                        </div>
                    ), 
                    placement: "top", 
                    disableBeacon: true},
                {
                    target : '[data-tour-id="dashboard-graph"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                한달 동안 정답률 그래프
                            </p>
                             <p style={{ fontSize: '14px' }}>
                                최근 한 달 동안의 <strong>문제 정답률 변화</strong>를 시각적으로 확인할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                그래프를 통해 <strong>어제보다 발전하는 나</strong>를 만나보세요!
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    target : '[data-tour-id="dashboard-history"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                학습 기록 & 히스토리
                            </p>
                            <p style={{ fontSize: '14px'}}>
                                히스토리에서 <strong>최근 7개</strong>(일일 기준)의 <strong>학습 추이</strong>(푼 문제, 맞춘 문제, 정답률)를 확인할 수 있어요
                            </p>
                            <p style={{ fontSize: '14px'}}>
                                 더 오래된 기록은 <strong>달력 보기</strong>를 통해 특정 날짜별로 확인할 수 있습니다.
                            </p>
                        </div>
                    ), 
                    placement: "top", 
                    disableBeacon: true
                },
                {
                    target : '[data-tour-id="dashboard-switch"]', 
                    content: (
                        <div >
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                달력 리스트 전환하기
                            </p>
                            <p style={{ fontSize: '14px'}}>
                                <strong>달력 ↔ 리스트</strong>는 이 버튼을 통해 전환이 가능해요!
                            </p>
                        </div>
                    ), 
                    placement: "left", 
                    disableBeacon: true,
                    styles: {
                        tooltip: {
                        width: 340,
                        padding: '16px',
                        },
                    }
                },
            ]
        }
        else if(location.pathname === "/questions") {
            return [
                {target: 'body',  
                    title: (<div><p style={{ color: '#1D4ED8', fontSize:'20px', fontWeight: 'bold'}} >문제 관리 페이지에 오신걸 환영합니다</p></div>),   
                    content: (
                        <div>
                            <p>
                                이곳에서는 내가 만든 문제를 한눈에 <strong>확인하고, 직접 생성, 수정, 삭제</strong>할 수 있는 공간입니다.
                            </p>
                            <p>
                                또한, 문제 <strong>가져오기 / 내보내기</strong> 기능을 통해 다른 사용자의 문제를 활용할 수도 있습니다.
                            </p>
                        </div>
                    ), 
                    placement: 'center', 
                    disableBeacon: true,
                },
                {
                    target: '[data-tour-id="question-root"]', 
                    content: 
                    (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                문제 관리 테이블
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                내가 가진 문제가 이곳에 표시됩니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                문제를 <strong>생성, 수정, 삭제, 선택</strong>할 수 있으며,
                                체크박스를 통해 여러 기능을 조합해 활용할 수 있습니다.
                            </p>
                        </div>
                    ),
                    placement: "left-start", 
                    disableBeacon: true, 
                    floaterProps: { disableFlip: true },
                    
                },
                {
                    id: "tag-modal", 
                    target: '[data-tour-id="tag-name"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                문제집 & 테그 선택
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                문제에 입력된 <strong>태그</strong>나 <strong>문제집 키워드</strong>를 이곳에서 확인할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                여러 태그를 선택하면, 해당 키워드를 포함한 문제들만 테이블에 표시됩니다.
                            </p>
                        </div>
                    ),
                    placement: "right", 
                    disableBeacon: true
                },
                {
                    target: '[data-tour-id="question-solve-add"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                선택한 문제 풀기 & 문제 추가
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                체크박스로 선택한 문제를 풀거나, 나만의 <strong>새로운 문제</strong>를 만들 수 있습니다.
                            </p>
                        </div>
                    ),
                    placement: "left", 
                    disableBeacon: true,
                    styles: {
                        tooltip: {
                        width: 500,
                        padding: '16px',
                        },
                    }
                },
                {
                    target: '[data-tour-id="question-upload-download"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                문제 가져오기 및 내보내기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                외부에서 문제를 가져오거나, 선택한 문제를 파일로 내보낼 수 있습니다.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true,
                    styles: {
                        tooltip: {
                        width: 500,
                        padding: '16px',
                        },
                    }
                },
                {
                    id: "in-insert-modal", 
                    target: '[data-tour-id="insert-modal-root"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                문제 추가하기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                이곳에서 새로운 문제를 <strong>직접 작성</strong>할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                제목이나 선택지 입력 중 <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Enter</code>를 누르면 자동으로 저장됩니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Tab</code> 키와{' '}
                                <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Enter</code> 키를 이용해 빠르고 효율적으로 문제를 제작해 보세요!
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-tag"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                테그 & 문제집 입력하기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                쉼표(<code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>,</code>)로 구분하여 <strong>태그</strong>나 <strong>문제집 이름</strong>을 입력할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                문제 연속 생성 시 마지막으로 입력한 태그들은 자동으로 유지됩니다.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-select"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                객관식 선택지 작성하기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                객관식 <strong>선택지</strong>를 작성할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                            선택지 입력 시 <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>`</code> 
                            혹은 <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>```</code> 
                            를 사용해 코드 블록을 작성할 수 있습니다.
                            </p>

                            <p style={{ fontSize: '14px' }}>
                            <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Shift + End</code>로 다음 줄로 이동하고, 이후에는{' '}
                            <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Enter</code>로 간편하게 줄바꿈할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                더 큰 입력창이 필요하다면, <strong>확장 모드</strong>를 이용해보세요.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-answer"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                객관식 정답 선택하기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                이 버튼을 눌러 해당 문제의 <strong>정답</strong>을 지정할 수 있습니다.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-image"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                이미지 추가하기
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                버튼을 눌러 이미지를 삽입하거나, 이미지를 드래그하여 끌어다 놓을 수도 있습니다.
                            </p>
                        </div>
                    ),
                    placement: "bottom", 
                    disableBeacon: true
                },
                {
                    id: "lock", 
                    target: '[data-tour-id="insert-modal-expend"]', 
                    content: (
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
                                확장 모드
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                창이 작을 경우, 이 버튼을 눌러 <strong>확장 모드</strong>로 전환할 수 있습니다.
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                더 넓은 공간에서 설명이나 추가 내용을 작성할 수 있습니다.
                            </p>
                        </div>
                    ), 
                    placement: "bottom", 
                    disableBeacon: true
                },

            ]
        } else if(location.pathname === "/select") {
            return [
                        {
                            target: 'body',
                            title: (
                            <div>
                                <p style={{ color: '#1D4ED8', fontSize:'20px', fontWeight: 'bold'}} >
                                문제 풀기 페이지에 오신 것을 환영합니다
                                </p>
                            </div>
                            ),
                            content: (
                            <div>
                                <p style={{ fontSize: '14px' }}>
                                이곳에서는 문제를 <strong>시험 형식</strong> 또는 <strong>카드 형식</strong>으로 풀어볼 수 있습니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                각 기능을 활용해 <strong>자신의 학습 스타일</strong>에 맞는 문제 풀이를 진행해보세요.
                                </p>
                            </div>
                            ),
                            placement: 'center',
                            disableBeacon: true,
                        },

                        {
                            target: '[data-tour-id="exam-timer"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>풀이 시간 설정</p>
                                <p style={{ fontSize: '14px' }}>
                                문제 풀이에 사용할 <strong>시간 제한</strong>을 설정할 수 있습니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                시간 제한이 활성화되면, 남은 시간을 상단에서 확인할 수 있습니다.
                                </p>
                            </div>
                            ),
                            placement: 'left-start',
                            disableBeacon: true,
                            styles: {
                                tooltip: {
                                    width: 500,
                                    padding: '16px',
                                },
                            }
                        },

                        {   id: "lock",
                            target: '[data-tour-id="exam-select-shuffle"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>선택지 섞기</p>
                                <p style={{ fontSize: '14px' }}>
                                객관식 문제의 <strong>선택지 순서</strong>를 무작위로 섞습니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                매번 새로운 순서로 표시되어, <strong>기억에 의존하지 않고</strong> 실력을 점검할 수 있습니다.
                                </p>
                            </div>
                            ),
                            placement: 'left-start',
                            disableBeacon: true,
                            styles: {
                                tooltip: {
                                    width: 500,
                                    padding: '16px',
                                },
                            }
                        },

                        {   id: "lock",
                            target: '[data-tour-id="exam-shuffle"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>문제 순서 섞기</p>
                                <p style={{ fontSize: '14px' }}>
                                전체 문제의 <strong>출제 순서</strong>를 무작위로 변경합니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                매번 다른 순서로 문제를 풀며 <strong>집중력과 응용력</strong>을 높일 수 있습니다.
                                </p>
                            </div>
                            ),
                            placement: 'left-start',
                            disableBeacon: true,
                            styles: {
                                tooltip: {
                                    width: 500,
                                    padding: '16px',
                                },
                            }
                        },
                        {   id: "lock",
                            target: '[data-tour-id="exam-tag-select"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>문제집 선택하기</p>
                                <p style={{ fontSize: '14px' }}>
                                    이곳에서 풀이할 <strong>문제집</strong>을 선택할 수 있습니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                    선택된 문제집은{' '}
                                <span className="bg-blue-500 text-white px-1 rounded">
                                    색상
                                </span>
                                    으로 확인할 수 있어요.
                                </p>

                            </div>
                            ),
                            placement: 'left-start',
                            disableBeacon: true,
                            floaterProps: { disableFlip: true },
                            styles: {
                                tooltip: {
                                    width: 360,
                                    padding: '16px',
                                },
                            }
                        },

                        {
                            target: '[data-tour-id="exam-card"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>카드 형식으로 풀기</p>
                                <p style={{ fontSize: '14px' }}>
                                문제를 한 장씩 넘기며 맞춤, 틀림으로 풀이하는 <strong>카드 형식 모드</strong>입니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                지문과 정답에 집중할 수 있어, 빠른 <strong>암기용</strong>으로 적합합니다.
                                </p>
                            </div>
                            ),
                            placement: 'bottom',
                            disableBeacon: true,
                            styles: {
                                tooltip: {
                                    width: 500,
                                    padding: '16px',
                                },
                            }
                        },

                        {
                            target: '[data-tour-id="exam-select"]',
                            content: (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>시험 형식으로 풀기</p>
                                <p style={{ fontSize: '14px' }}>
                                한 문제씩 한 화면에 표시하는 <strong>시험 모드</strong>입니다.
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                주관식과 객관식 문제를 실제 시험처럼 <strong>집중해서 연습</strong>하고 싶은 경우에 활용하세요.
                                </p>
                            </div>
                            ),
                            placement: 'bottom',
                            disableBeacon: true,
                            styles: {
                                tooltip: {
                                    width: 550,
                                    padding: '16px',
                                },
                            }
                        },
                    ];

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

            setLockScroll(noFollowIds.has(id));

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
                        primaryColor: '#3B82F6',
                        textColor: '#000000ff',
                        backgroundColor: '#FFFFFF',
                    },
                    buttonSkip: {
                        color: '#9CA3AF',
                        fontWeight: 500,
                        outline: 'none',
                    },
                    buttonNext: {
                        backgroundColor: '#3B82F6',
                        color: '#fff',
                        outline: 'none',
                        fontWeight: 'bold'
                    },
                    buttonBack: {
                        color: '#6B7280',
                        outline: 'none',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        },
                        spotlight: {
                        borderRadius: 12,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                    },
                    tooltip: {
                        width: 640,
                        maxWidth: 640,
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