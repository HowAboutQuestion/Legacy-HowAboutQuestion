import React, {useEffect, useState } from "react";

const stepMessageMap = {
    idle: "문제어때가 시작을 준비하고 있어요",
    "loading-settings": "설정을 확인하고 있어요",
    "loading-questions": "문제들을 불러오고 있어요",
    "recommendations": "오늘의 추천 문제를 준비하고 있어요",
    "loading-updateQuestions": "마무리로 데이터를 정리하고 있어요",
    "ready": "준비가 끝났어요. 곧 시작합니다!",
    "error": "앗, 준비 중에 잠시 문제가 생겼어요",
};

const stepProgressMap = {
    idle: 10,
    "loading-settings": 15,
    "loading-questions": 45,
    "recommendations": 60,
    "loading-updateQuestions": 85,
    ready: 100,
    error: 100,
};

function InitLoading({step = "idle"}){
    const message = stepMessageMap[step] || "앱을 준비하고 있습니다";
    const progress = stepProgressMap[step] ?? 0;
    const [displayedMessage, setDisplayedMessage] = useState("");

    useEffect(() => {
        let index = 0;
        setDisplayedMessage("");

        const interval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage(message.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [message]);

    return (
        <div className = "min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md px-8">
                <div className="text-center mb-8">
                    <img src="./images/loading/InitLoading.png" alt="문제어때 로딩" className="w-128 h-128 mx-auto object-contain"/>
                    <h1 className="text-2xl font-bold text-gray-800">문제 어때</h1>
                    <p className="mt-3 text-sm text-gray-500 h-5">
                        {displayedMessage}
                        {step !== "ready" && step !== "error" && (
                            <span className="inline-flex ml-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce [animation-delay:150ms]">.</span>
                                <span className="animate-bounce [animation-delay:300ms]">.</span>
                            </span>
                        )}
                    </p>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%`}} />
                </div>
                <div className="mt-3 text-right text-xs text-gray-400" >
                    {progress}%
                </div>
            </div>
        </div>
    );
}

export default InitLoading;