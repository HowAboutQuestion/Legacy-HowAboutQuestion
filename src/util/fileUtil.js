// import { useRecoilState } from "recoil";
// import { questionsAtom } from "state/data";
// import Papa from "papaparse";

// const useCSVHandler = () => {
//   const [questions, setQuestions] = useRecoilState(questionsAtom);

//   // CSV 파일을 읽고 파싱하는 함수
//   const insertQuestion = async (file) => {
//     try {
//       const response = await fetch(file);
//       if (!response.ok) throw new Error("CSV 파일을 찾을 수 없습니다.");

//       const csvText = await response.text();

//       Papa.parse(csvText, {
//         header: true, // 첫 줄을 헤더로 사용
//         skipEmptyLines: true, // 빈 줄 무시
//         complete: (result) => {
//           const tagSet = new Set(); // 태그 중복 제거용
//           const today = new Date().toISOString().split("T")[0]; // 오늘 날짜

//           const parsedData = result.data.map((item) => {
//             // __parsed_extra 필드가 있으면 tag에 추가
//             if (item.__parsed_extra) {
//               const extraTags = item.__parsed_extra.map((tag) => tag.trim());
//               item.tag = [
//                 ...(item.tag ? item.tag.split(",").map((tag) => tag.trim()) : []),
//                 ...extraTags,
//               ];
//             } else if (item.tag) {
//               // tag가 문자열 형태로 존재하면 리스트로 변환
//               item.tag = item.tag.split(",").map((tag) => tag.trim());
//             }
//             item.tag?.forEach((tag) => tagSet.add(tag)); // 태그 중복 제거

//             // 필요한 필드만 유지, 기본값 설정
//             return {
//               title: item.title || "",
//               type: item.type || "",
//               select1: item.select1 || "",
//               select2: item.select2 || "",
//               select3: item.select3 || "",
//               select4: item.select4 || "",
//               answer: item.answer || "",
//               img: item.img || "",
//               level: 0, // 기본값
//               date: today, // 오늘 날짜
//               tag: item.tag || [],
//             };
//           });

//           // 기존 questions 배열에 새 데이터를 추가
//           setQuestions([...questions, ...parsedData]);
//         },
//       });
//     } catch (error) {
//       console.error("CSV 파일 읽기 실패:", error);
//     }
//   };

// };

// export { useCSVHandler };
