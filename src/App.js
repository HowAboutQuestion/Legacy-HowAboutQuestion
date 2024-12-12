import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { allTagAtom, questionsAtom } from "state/data";
import Router from "Router";
import Navbar from "pages/Navbar";
import Papa from "papaparse";
import { BrowserRouter } from "react-router-dom";


const App = () => {
//  const [questions, setQuestions] = useState([]);
const [questions, setQuestions] = useRecoilState(questionsAtom);
const [allTag, setAlltag] = useRecoilState(allTagAtom);
const tagSet = new Set();

  useEffect(() => {
    // public 폴더의 question.csv 파일 경로
    const csvFilePath = "/question.csv";

    // CSV 파일을 읽고 파싱하는 함수
    const fetchCSV = async () => {
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
                const extraTags = item.__parsed_extra.map((tag) =>
                  tag.trim()
                );
                item.tag = [
                  ...(item.tag ? item.tag.split(",").map((tag) => tag.trim()) : []),
                  ...extraTags,
                ];
              } else if (item.tag) {
                // tag가 문자열 형태로 존재하면 리스트로 변환
                item.tag = item.tag.split(",").map((tag) => tag.trim());
              }
              item.tag.map((tag) => tagSet.add(tag));
              // __parsed_extra 필드 제거
              delete item.__parsed_extra;

              return item;
            })

            setQuestions(parsedData); // 결과 데이터를 상태로 설정
            setAlltag([...tagSet]);
          },

          
        });
      } catch (error) {
        console.error("CSV 파일 읽기 실패:", error);
      }
    };

    fetchCSV();
  }, [setQuestions]); // 의존성 배열에 setQuestions 추가


  // questions 상태가 변경될 때 로깅
  useEffect(() => {
    console.log("Updated questions:", questions);
    console.log("Updated tagSet:", allTag);
    
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

const Root = () => (
 <App/>   
);

export default Root;