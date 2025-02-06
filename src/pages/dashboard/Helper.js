import React, { useState, useEffect, useMemo, useCallback } from "react";

const Helper = ({closeHelper}) => {
        
 

    return (
        <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between sticky bg-white pb-5 top-0 border-b">
                <div className="text-3xl font-bold">도움말</div>
                <div
                    className="cursor-pointer text-sm font-bold px-4 py-2 rounded transition bg-gray-100 hover:bg-gray-200"
                    onClick={closeHelper} 
                >닫기</div>
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">문제 생성</h2>
                <img 
                className="rounded-sm w-full mb-5"
                src="./images/add-question.png"
                />
                <p>
                    1. 문제 관리 페이지에서 문제를 추가할 수 있습니다.
                    <br/>
                    2. 문제 추가를 누르고, 객관식/주관식을 선택하신 후 문제를 입력해주세요
                    <br/>
                    3. 생성하는 문제의 카테고리는 <strong>comma(,)</strong> 로 구분해주세요
                    <br/>
                    4. 문제 제목과 정답은 필수입력사항입니다
                </p>

            </div>

            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">문제 내보내기</h2>
                <img 
                className="rounded-sm w-full mb-5"
                src="./images/add-question.png"
                />
                <p>
                    1. 다른 컴퓨터에서도 문제를 풀고 싶다면 <strong>내보내기</strong> 기능을 이용할 수 있습니다.
                    <br/>
                    2. 내보내기할 문제를 체크하고, 상단의 다운로드 버튼을 누르면 .zip 파일로 다운로드가 가능합니다
                    <br/>
                    3. .zip 파일로 압축된 파일은, <strong>업로드</strong> 버튼으로 한 번에 추가가 가능합니다. 
                </p>
            </div>
        
            <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">문제 풀기</h2>
            <img 
                className="rounded-sm w-full mb-5"
                src="./images/add-question.png"
                />
                <p>
                    1. 문제는 두 가지 방식으로 풀 수 있습니다.
                    <br/>
                    2. 시험 형식으로 풀면 객관식 / 주관식 형태로 풀이가 가능합니다.
                    <br/>
                    3. 카드 형식으로 풀면 빠르게 알고 있는 개념을 확인할 수 있습니다.
                    <br/>
                    4. 풀이할 카테고리(태그)를 선택하고 여러가지 형식으로 문제를 풀어주세요!
                </p>
            </div>
        </div>
    )
}

export default Helper;
