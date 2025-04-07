import React, { useState } from "react";
import patchNotes from "./patchNotes";

const Helper = ({ closeHelper }) => {
  const [showPatch, setShowPatch] = useState(false);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between sticky bg-white pb-5 top-0 border-b">
        <div className="text-3xl font-bold">도움말</div>
        <button
          onClick={closeHelper}
          className="cursor-pointer text-sm font-bold px-4 py-2 rounded transition bg-gray-100 hover:bg-gray-200"
        >
          닫기
        </button>
      </div>

      <div className="flex flex-col top-0 max-h-[80vh] overflow-y-auto p-4">
        {/* 변경사항 섹션 */}
        <div className="mb-6">
          <button
            onClick={() => setShowPatch(!showPatch)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded"
          >
            {showPatch ? "▲ 변경사항 닫기" : "▼ 변경사항 보기"}
          </button>
          {showPatch && (
            <div
              className="mt-4 text-sm leading-relaxed bg-gray-50 p-4 rounded border"
              dangerouslySetInnerHTML={{ __html: patchNotes }}
            />
          )}
        </div>

        {/* 기존 도움말 내용 */}
        <div className="mt-4">
          {/* 대시보드 섹션 */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 transition duration-75 text-blue-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <p className="text-2xl font-bold mb-2">대시보드</p>
          </div>
          <p className="mb-4">
            대시보드는 사용자의 학습 데이터를 기반으로{" "}
            <strong>오늘의 추천 문제</strong>를 제공합니다.
            <br />
            또한, 내가 푼 문제 수, 맞춘 문제 수, 정답률을 한눈에 확인하고, 과거
            기록도 조회할 수 있습니다.
          </p>

          <h2 className="text-xl font-bold mb-2">🔥 오늘의 추천 문제</h2>
          <div>
            <img
              src="./images/help/ProblemRecommendation.png"
              alt="문제 추천"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <p className="mb-4">
            <strong>오늘의 추천 문제</strong>를 통해 자주 틀리거나 새로 생성된
            문제를 복습하세요!
            <br />
            학습한 문제는{" "}
            <strong>
              자주 맞출수록 덜 등장하고, 자주 틀릴수록 더 자주 추천
            </strong>
            됩니다.
          </p>

          <h2 className="text-xl font-bold mb-2">📅 학습 기록 & 히스토리</h2>
          <div className="flex items-center gap-2">
            <img
              src="./images/help/LogList.png"
              alt="리스트"
              className="w-full max-w-[50%] h-auto mb-4 rounded-lg"
            />
            <img
              src="./images/help/cal.png"
              alt="달력"
              className="w-full max-w-[50%] h-auto mb-4 rounded-lg"
            />
          </div>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>오늘의 학습 기록</strong>: 내가 푼 문제 수, 정답 수,
              정답률을 확인할 수 있습니다.
            </li>
            <li>
              <strong>최근 7일 히스토리</strong>: 가장 최근 7일 동안의 학습
              기록을 리스트로 제공합니다.
            </li>
            <li>
              <strong>달력 기능 지원</strong>: 특정 날짜를 선택하면 해당 날짜의
              학습 기록을 확인할 수 있습니다.
            </li>
          </ul>

          <hr className="my-4" />

          {/* 문제 관리 섹션 */}
          <div className="flex items-center gap-2">
            <svg
              className="flex-shrink-0 w-5 h-5 transition duration-75 text-blue-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <p className="text-2xl font-bold mb-2">문제 관리</p>
          </div>
          <p className="mb-4">
            내가 만든 문제를 한눈에 확인하고, 직접 생성, 수정, 삭제할 수 있는
            공간입니다.
            <br />
            또한, <strong>문제 가져오기/내보내기 기능</strong>을 통해 다른
            사용자의 문제를 활용할 수도 있습니다.
          </p>

          <h2 className="text-xl font-bold mb-2">✏️ 문제 생성</h2>
          <div>
            <img
              src="./images/help/QuestionAdd.png"
              alt="문제 추가"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <p className="mb-4">
            문제 생성 기능을 통해 <strong>객관식 & 주관식 문제</strong>를 만들
            수 있습니다.
            <br />
            <strong>태그 기능</strong>을 활용하면 문제를 쉽게 분류할 수 있으며,
            <br />
            객관식 문제의 경우 최대 <strong>4개의 선택지</strong>를 설정하고{" "}
            <strong>정답을 지정</strong>할 수 있습니다.
            <br />
            이미지를 첨부하여 보다 직관적인 문제를 만들 수도 있습니다.
          </p>

          <hr className="my-4" />

          {/* 문제 선택 및 풀이 섹션 */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="flex-shrink-0 w-6 h-6 transition duration-75 text-blue-500"
              aria-hidden="true"
            >
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
            </svg>
            <p className="text-2xl font-bold mb-2">문제 선택 및 풀이</p>
          </div>
          <h2 className="text-xl font-bold mb-2">📝 문제 풀기</h2>
          <ul className="list-disc list-inside mb-4">
            <li>객관식 & 주관식, 카드 문제 풀이 가능</li>
            <li>우측 상단에서 문제 번호 확인 & 클릭 시 해당 문제로 이동</li>
            <li>제출 버튼을 누르면 결과 페이지로 이동</li>
          </ul>

          <h2 className="text-xl font-bold mb-2">📊 결과 페이지</h2>
          <div>
            <img
              src="./images/help/result.png"
              alt="문제 결과"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <ul className="list-disc list-inside mb-4">
            <li>정답 & 오답 확인 가능</li>
            <li>
              <strong>차트 제공</strong>: 내가 푼 문제의 성과를 시각적으로
              분석할 수 있습니다.
            </li>
          </ul>

          <p className="font-bold">이제, 문제를 풀면서 실력을 키워보세요!</p>
        </div>

        {/* 푸터 */}
        <footer className="mt-16 text-gray-600 text-sm transition-colors duration-300 border-t pt-5">
          <div className="max-w-screen-md mx-auto text-center">
            <a
              href="https://github.com/haerim-kweon/HowAboutQuestion/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-gray-800 dark:text-white mb-2 hover:underline"
            >
              HowAboutQuestion
            </a>
            <p className="text-xs mb-6 text-gray-500">
              A simple quiz platform powered by React and creativity.
            </p>
            <div className="flex justify-center gap-6 flex-wrap items-center mb-6">
              <div className="flex items-center gap-2 group">
                <img
                  src="./images/help/github.svg"
                  alt="GitHub Icon"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <a
                  href="https://github.com/haerim-kweon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  khaelim1311
                </a>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2 group">
                <img
                  src="./images/help/github.svg"
                  alt="GitHub Icon"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <a
                  href="https://github.com/cod0216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  cod0216
                </a>
              </div>
            </div>
            <p className="italic text-xs text-gray-400">
              © {new Date().getFullYear()} khaelim1311, cod0216. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Helper;
