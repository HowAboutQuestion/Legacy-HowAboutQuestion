
// import { useRecoilState, useResetRecoilState } from "recoil";
// import { questionsAtom } from "state/questionsAtom";

// // public 폴더의 question.csv 파일 경로
// const csvFilePath = "/question.csv";
// const [questions, setQuestions] = useRecoilState(questionsAtom);

// // CSV 파일을 읽고 파싱하는 함수
// const fetchCSV = async () => {
//   try {
//     const response = await fetch(csvFilePath);
//     if (!response.ok) throw new Error("CSV 파일을 찾을 수 없습니다.");

//     const csvText = await response.text();

//     // Papa Parse를 사용하여 CSV 파싱
//     Papa.parse(csvText, {
//       header: true, // 첫 줄을 헤더로 사용
//       skipEmptyLines: true, // 빈 줄 무시
//       complete: (result) => {
//         setQuestions(result.data); // 결과 데이터를 상태로 설정
//       },
//     });
//   } catch (error) {
//     console.error("CSV 파일 읽기 실패:", error);
//   }
// };

// export {fetchCSV} 