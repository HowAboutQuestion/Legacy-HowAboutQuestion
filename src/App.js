import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { allTagAtom, questionsAtom } from "state/data";
import Router from "Router";
import Navbar from "pages/Navbar";
import Papa from "papaparse";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  const [questions, setQuestions] = useRecoilState(questionsAtom);
  const [allTag, setAlltag] = useRecoilState(allTagAtom);
  const tagSet = new Set();

  const [isLoaded, setIsLoaded] = useState(false); // 파일이 이미 읽혔는지 여부 추적

  useEffect(() => {
    // public 폴더의 question.csv 파일 경로
    const csvFilePath = "/question.csv";

    // CSV 파일을 읽고 파싱하는 함수
    const fetchCSV = async () => {
      if (isLoaded) return; // 이미 파일이 읽혀지면 다시 읽지 않도록 합니다.

      try {
        const response = await fetch(csvFilePath);
        if (!response.ok) throw new Error("CSV 파일을 찾을 수 없습니다.");

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true, // 첫 줄을 헤더로 사용
          skipEmptyLines: true, // 빈 줄 무시

          complete: (result) => {
            const parsedData = result.data.map((item) => {
              // __parsed_extra 필드가 있으면 tag에 추가
              if (item.__parsed_extra) {
                const extraTags = item.__parsed_extra.map((tag) => tag.trim());
                item.tag = [
                  ...(item.tag ? item.tag.split(",").map((tag) => tag.trim()) : []),
                  ...extraTags,
                ];
              } 
              if(!item.tag) item.tag = [];
              else if (item.tag) {
                // tag가 문자열 형태로 존재하면 리스트로 변환
                item.tag = item.tag.split(",").map((tag) => tag.trim());
              }
              if(item.tag) item.tag.map((tag) => tagSet.add(tag));
              // __parsed_extra 필드 제거
              delete item.__parsed_extra;

              return item;
            });

            setQuestions(parsedData); // 결과 데이터를 상태로 설정
            setAlltag([...tagSet]);
            setIsLoaded(true); // 파일이 읽혔음을 상태로 설정
          },
        });
      } catch (error) {
        console.error("CSV 파일 읽기 실패:", error);
      }
    };

    // 첫 번째 렌더링 시에만 CSV 파일을 읽고 데이터를 설정합니다.
    fetchCSV();
  }, [isLoaded]); // isLoaded가 변경될 때만 실행되도록 설정

  useEffect(() => {
    const updateQuestionsAsync = async () => {
      try {
        // 상태 업데이트 후 비동기적으로 questions를 처리
        const result = await window.electronAPI.updateQuestions(questions);
        console.log(result);
      } catch (error) {
        console.error("Error updating questions:", error);
      }
    };

    if (questions.length > 0) {
      updateQuestionsAsync(); // 비동기로 호출
    }
  }, [questions]); 

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Router />
      </BrowserRouter>
    </div>
  );
};

const Root = () => <App />;

export default Root;
