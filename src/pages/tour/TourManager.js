import React, { useEffect, useState, useMemo } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';
import { useLocation } from "react-router-dom";
import getDashboardSteps from 'pages/tour/steps/dashboardSteps.js';
import getQuestionsSteps from 'pages/tour/steps/questionsSteps.js';
import getSelectSolveSteps from 'pages/tour/steps/selectSolveSteps.js';

const LOCALE_KO = { back: "뒤로", close: "닫기", last: "완료", next: "다음", skip: "건너뛰기", step: "단계" };

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
        if (location.pathname === "/dashboard" || location.pathname === "/") return getDashboardSteps();
        else if (location.pathname === "/questions") return getQuestionsSteps();
        else if (location.pathname === "/select") return getSelectSolveSteps();
        return [];
    }, [location.pathname]);

    useEffect(() => {
        setKey(k => k + 1);
    }, [location.pathname]);

    useEffect(() => {
        setTotal(steps.length);
        if (run && steps.length > 0) setCur(1);
    }, [steps, run]);

    const onCallback = (data) => {
        const { status, type, index } = data;
        const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(status);
        const noFollowIds = new Set([
            "in-insert-modal",
            "lock"
        ]);

        if (type === EVENTS.TOUR_END || finished) {
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

        if ([EVENTS.STEP_AFTER, EVENTS.STEP_BEFORE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
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
        window.addEventListener("start-tour", handler);
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