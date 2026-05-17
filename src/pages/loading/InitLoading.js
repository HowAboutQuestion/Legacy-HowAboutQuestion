import React from "react";

const stepMessageMap = {
    idle: "앱을 준비하고 있습니다...",
    "loading-settings": "설정을 불러오는 중입니다...",
    "loading-questions": "문제 데이터를 불러오는 중입니다...",
    "normalizing-recommendations": "오늘의 추천 문제를 계산하는 중입니다...",
    "ready": "준비가 완료되었습니다.",
    "error": "초기화 중 문제가 발생했습니다.",
};

const stepProgressMap = {
    idle: 10,
    "loading-settings": 30,
    "loading-questions": 65,
    "normalizing-recommendations": 90,
    ready: 100,
    error: 100,
};

function InitLoading({step = "idle"}){
    const message = stepMessageMap[step] || "앱을 준비하고 있습니다...";
    const progress = stepProgressMap[step] ?? 0;

    return (
        <div className = "min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md px-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">문제 어때</h1>
                    <p className="mt-3 text-sm text-gray-500">{message}</p>
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