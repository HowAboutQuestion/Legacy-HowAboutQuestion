import React, {useState, useEffect} from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import QuestionItem from 'pages/question/QuestionItem';
import Papa from "papaparse";
import UpdateModal from 'pages/question/UpdateModal';
import { useLocation } from "react-router-dom";
import {generateUniqueId} from "utils/util"
import InsertModal from './InsertModal';

function Questions() {
    const location = useLocation(); 
    //모든 문제 전역에서 불러오기
    const questions = useRecoilValue(questionsAtom);
    const setQuestions = useSetRecoilState(questionsAtom);
    const setAlltag = useSetRecoilState(allTagAtom);
        
    const [filterQuestions, setFilterQuestions] = useState([]);

    
    //존재하는 중복 없는 모든 태그
    const allTag = useRecoilValue(allTagAtom);
    const [selectedTag, setSelectedTag] = useState([]); // 선택된 태그 상태
    
    useEffect(() => {
      if (location.state?.openModal) {
        setInsertModal(true);
      }
    }, [location.state]);

     // 태그 선택/해제 핸들러
    const handleTagClick = (tagName) => {
      setSelectedTag((prev) => 
        prev.includes(tagName)
          ? prev.filter((tag) => tag !== tagName) // 이미 선택된 경우 제거
          : [...prev, tagName] // 새로 선택된 경우 추가
      );
    };

    const allTagItems = allTag.map((tagName, index) => {
    const isSelected = selectedTag.includes(tagName); // 선택 여부 확인
    
    return (
      <div 
        onClick={() => handleTagClick(tagName)}
        key={index} 
        className={`cursor-pointer whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold border-none ${
          isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {tagName}
      </div>
    );
  });

  //태그 필터링 이벤트트
  useEffect(() => {
    if (selectedTag.length === 0) {
      setFilterQuestions(questions.map((question, index) => ({ question, index })));
      return;
    }
  
    const filtered = questions
      .map((question, index) => ({ question, index })) // 각 질문과 인덱스를 묶음
      .filter(({ question }) =>
        question.tag.some((tag) => selectedTag.includes(tag))
      );
    setFilterQuestions(filtered);
  }, [questions, selectedTag]); // 의존성 배열에 `selectedTag`와 `questions` 추가
  

    //csv 파일 업로드 이벤트
    const insertCSV = async (file) => {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("CSV 파일을 찾을 수 없습니다.");
  
        const csvText = await response.text();
  
        Papa.parse(csvText, {
          header: true, // 첫 줄을 헤더로 사용
          skipEmptyLines: true, // 빈 줄 무시
          complete: (result) => {
            const tagSet = new Set(); // 태그 중복 제거용
            const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
  
            const parsedData = result.data.map((item, index) => {
              
              // tag가 문자열 형태로 존재하면 리스트로 변환
              if(item.tag){
                item.tag = (item.tag).split(",").map((t) => t.trim());
              }else{
                item.tag = [];
              }
              
              item.tag.forEach((tag) => tagSet.add(tag)); // 태그 중복 제거
  
              // 필요한 필드만 유지, 기본값 설정
              return {
                title: item.title || "",
                type: item.type || "",
                select1: item.select1 || "",
                select2: item.select2 || "",
                select3: item.select3 || "",
                select4: item.select4 || "",
                answer: item.answer || "",
                img: item.img || "",
                level: 0, // 기본값
                date: today, // 오늘 날짜
                recommenddate:today,
                update:today,
                solveddate:null,

                tag: item.tag || [],
                id: generateUniqueId(questions)+index
              };
            });
  
            // 기존 questions 배열에 새 데이터를 추가
            setQuestions([...parsedData, ...questions]);
            //setAlltag([...tagSet, ...allTag]);

          },
        });
      } catch (error) {
        console.error("CSV 파일 읽기 실패:", error);
      }
    };
    
    const handleFileUpload = (event) => {
    const file = event.target.files[0]; // 사용자가 업로드한 파일
    if (file) {
      const fileUrl = URL.createObjectURL(file); // 파일 URL 생성
      insertCSV(fileUrl); // insertQuestion 함수 호출
      }
    };

   //.zip 업로드 핸들러 
   const handleZipUpload = async (event) => {
    const file = event.target.files[0]; // 사용자가 업로드한 파일
    if (file) {
      try {
        // Electron API를 통해 파일 전달 및 처리
        const result = await window.electronAPI.extractZip(file);
        if (result.success) {
          setQuestions([...result.questions, ...questions]); // questions 배열 업데이트
        } else {
        }
      } catch (error) {
        console.error("Zip 파일 처리 중 오류:", error);
      }
    }
  };


    //.csv 만 다운로드
    const handleDownload = () => {
      const downloadQuestions = filterQuestions.some(({index, question}) => question.checked)
        ? filterQuestions
            .filter(({index, question}) => question.checked)  // question.checked가 true인 것만 필터링
            .map(({index, question}) => {
                const { checked, ...rest } = question; 
                return rest;
              })
        : filterQuestions
            .map(({index, question}) => {
              const { checked, ...rest } = question;  // checked 제외한 데이터만 추출
              return rest;
            });



      const csv = Papa.unparse(downloadQuestions, {
        header: true, // 첫 번째 줄에 헤더 포함
        columns: [
          "title", "type", "select1", "select2", "select3", "select4", "answer", 
          "img", "level", "date", "update", "recommenddate", "solveddate", "tag"
        ], // 원하는 헤더 순서 설정
      });

  
      // Blob을 사용하여 CSV 데이터를 파일로 변환
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  
      // 다운로드 링크 생성
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "questions.csv"); // 다운로드할 파일 이름 설정
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click(); // 다운로드 실행
        document.body.removeChild(link); // 링크 제거
      }
    };

    // .zip 다운로드
    const handleDownloadToZip = async () => {
      const downloadQuestions = filterQuestions.some(({index, question}) => question.checked)
        ? filterQuestions
            .filter(({index, question}) => question.checked)  // question.checked가 true인 것만 필터링
            .map(({index, question}) => {
                const { checked, id, ...rest } = question; 
                return rest;
              })
        : filterQuestions
            .map(({index, question}) => {
              const { checked, id, ...rest } = question;  // checked 제외한 데이터만 추출
              return rest;
            });

      const result = await window.electronAPI.exportQuestions(downloadQuestions);

      if (result.success) {
        alert(`Questions exported to: ${result.path}`);
      } else {
        alert(`Error exporting questions: ${result.message}`);
      }
    };

    // 문제 삭제
    const deleteQuestionsAll = () => {
      if (!window.confirm("진짜 삭제?")) return;
      const updatedQuestions = filterQuestions
      .filter(({ question }) => question.checked !== true) // checked가 true가 아닌 데이터만 필터링
      .map(({ question }) => {
        const { checked, ...rest } = question; // checked 제외한 나머지 데이터 추출
        return rest;
      });

      setQuestions(updatedQuestions);
    };


    //좌측 사이드바 토글
    const [isCollapsed, setIsCollapsed] = useState(true);
    //문제 추가 모달 토글
    const [insertModal, setInsertModal] = useState(false);
    const insertButtonClick = () => {
      setUpdateModal(false);
      setInsertModal(true);
    }

    //문제 업데이트 모달 토글
    const [updateModal, setUpdateModal] = useState(false);
    const [updateQuestion, setUpdateQuestion] = useState(null); // 수정할 질문 객체 (모달 제어 포함)
    const [updateIndex, setUpdateIndex] = useState(null);

    const handleUpdateClick = (question, index) => {
      setInsertModal(false);
      setUpdateModal(true);
      setUpdateIndex(index);
      setUpdateQuestion({ ...question });
    };
    
    const [isAllChecked, setIsAllChecked] = useState(false); // 전체 체크박스 상태 관리

    // 전체 체크박스 상태 변경
    const handleAllCheckboxChange = () => {
      const newCheckedState = !isAllChecked;

      setFilterQuestions((prevQuestions) =>
        prevQuestions.map(({ question, index }) => ({
          question: {
            ...question,
            checked: newCheckedState, // 전체 체크박스 상태에 따라 변경
          },
          index,
        }))
      );

      setIsAllChecked(newCheckedState);
    };

    // 개별 체크박스 상태 변경
    const handleCheckboxChange = (index) => {
      setFilterQuestions((prevQuestions) => {
        const updatedQuestions = prevQuestions.map(({ question, index: idx }) => ({
          question: {
            ...question,
            checked: idx === index ? !question.checked : question.checked, // 해당 index만 변경
          },
          index: idx,
        }));

        // 전체 체크박스 상태 업데이트
        const allChecked = updatedQuestions.every(({ question }) => question.checked);
        setIsAllChecked(allChecked);

        return updatedQuestions;
      });
    };


    // 테이블 데이터 랜더링
    const questionsItems = filterQuestions.map(({question, index}) => (
      <QuestionItem
        key={index}
        question={question}
        onUpdateClick={() => handleUpdateClick(question, index)} // index 전달
        handleCheckboxChange={() => handleCheckboxChange(index)}
      />
    ));
    



      return (

        <main className="ml-20 flex">

          <div
            className={`fixed h-full ${
              isCollapsed ? "border-r" : "w-80"
            } rounded-r-xl  flex flex-col items-center shadow bg-gray-100 transition-all duration-500`}
          >

              <div
                className="cursor-pointer text-gray-400 w-full text-right p-2"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-5 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>

              </div>

            <div className="hidden w-full p-5 ">
              {!isCollapsed && <div className="font-bold">문제검색</div>}
              {!isCollapsed && (
                <input
                  type="text"
                  className="border-gray-300 border-1 rounded py-1 w-full mt-3 text-sm"
                />
              )}
          </div>

            {!isCollapsed && (
              <div 
               className="w-full p-5 h-max overflow-auto css-tag-scroll">
                <div 
                className="font-bold">문제집 선택</div>
                <div className="flex gap-2 py-2 w-full flex-wrap">
                  {allTagItems}
                  
                </div>
              </div>
            )}
          </div>         
          

          <div className={`mb-[300px] transition-all duration-500 flex-1 sm:rounded-lg ${
              isCollapsed ? "ml-10" : "ml-80"
            }`}>

            <div className="px-8 py-4 flex justify-between border-b">
              <div>
                <h1 className="text-2xl font-semibold">문제 관리</h1>
                <h1 className="text-md font-normal text-gray-400">총 {filterQuestions.length} 문제</h1>
              </div>
              <div className="bg-white items-center flex">
                <div 
                onClick={() => insertButtonClick()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2">
                    문제추가
                </div>
                <div 
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 absolute"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <input 
                  onChange={handleZipUpload}
                  type='file' accept='.zip' className='opacity-0 h-full w-full'></input>

                </div>
                <div 
                onClick={handleDownloadToZip}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 absolute"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                      />
                  </svg>
                </div>
              </div>
            </div>

            <table className="text-left rtl:text-right text-gray-500 m-5 rounded-xl bg-gray-50 " >
              <thead className="text-sm font-bold text-gray-700 uppercase border-b">
                <tr className="px-10 bg-gray-100">
                  <th scope="col" className="py-4 px-8 rounded-tl-xl">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onClick={handleAllCheckboxChange} // 클릭 시 전체 선택/해제
                        checked={isAllChecked} // 모든 항목이 체크된 상태에 따라 체크박스 상태 변경
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 w-full">
                    문제
                  </th>
                  
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    유형
                  </th>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope='col' className='px-5 py-3 rounded-tr-xl'>
                    <svg
                        onClick={deleteQuestionsAll}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionsItems}
                <tr>
                  <td 
                    className='rounded-b-xl h-10 bg-gray-50'
                    colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>



            
          <div className={`
              ${( insertModal || updateModal ) ? "h-[300px]" : "h-0" }
                transition-all width-fill-available shadow-[10px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-t-2xl duration-500 fixed bottom-0 bg-white  ${
                  isCollapsed ? "ml-10" : "ml-80"
                }`}
              >
                {insertModal && <InsertModal 
                  setInsertModal={setInsertModal}>
                </InsertModal>}

                {updateModal && 
                  <UpdateModal
                  setUpdateModal={setUpdateModal}
                  question={updateQuestion} // 수정할 질문 객체 전달
                  setUpdateQuestion={setUpdateQuestion}
                  isCollapsed={isCollapsed}
                  index={updateIndex}
                />
                }
                

                
            
          </div>


           



        </main>
      
  
      );
    
}

export default Questions;