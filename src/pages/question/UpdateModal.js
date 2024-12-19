import React, {useState, useEffect} from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";

function UpdateModal({question, setUpdateQuestion, isCollapsed, index}) {
    const [title, setTitle] = useState(question.title ? question.title : "");
    const [type, setType] = useState(question.type ? question.type :"객관식");
    const [select1, setSelect1] = useState(question.select1 ? question.select1 : "");
    const [select2, setSelect2] = useState(question.select2 ? question.select2 : "");
    const [select3, setSelect3] = useState(question.select3 ? question.select3 : "");
    const [select4, setSelect4] = useState(question.select4 ? question.select4 : "");
    const [answer, setAnswer] = useState(question.answer ? question.answer : "");
    const [tag, setTag] = useState(question.tag.join(", "));
    const [date, setDate] = useState(question.date ? question.date : "");    
    const [thumbnail, setThumbnail] = useState(null);
    const handleFileChange = (event) => {
        const image = event.target.files[0];
        if (image) {
          const reader = new FileReader();
          reader.onload = () => {
            setThumbnail(reader.result);
          };
          reader.readAsDataURL(image);
        }
      };

     // question이 변경될 때마다 상태 업데이트
    useEffect(() => {
      setTitle(question.title || "");
      setType(question.type || "객관식"); // 기본값 설정
      setSelect1(question.select1 || "");
      setSelect2(question.select2 || "");
      setSelect3(question.select3 || "");
      setSelect4(question.select4 || "");
      setAnswer(question.answer || "");
      setTag(question.tag.join(", "));
      setDate(question.date || "");
    }, [question]); // 의존성 배열에 question 추가


    const setQuestions = useSetRecoilState(questionsAtom);
    const updateEvent = () => {
        // 태그 배열 생성
        const tags = tag ? [...new Set(tag.split(",").map((item) => item.trim()))] : [];
    
        // 수정된 질문 데이터
        const updatedQuestion = {
          ...question,
          title,
          type,
          select1,
          select2,
          select3,
          select4,
          answer,
          img: thumbnail,
          date,
          tag: tags,
        };
    
        // Recoil 상태 업데이트
        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = updatedQuestion; // index로 접근하여 수정
          return updatedQuestions;
        });
    
        // 모달 닫기
        setUpdateQuestion(null);
      };

      return (

        <div className={`
          ${question ? "h-[300px]" : "h-0" }
            transition-all width-fill-available shadow-[10px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-t-2xl duration-500 fixed bottom-0 bg-white  ${
              isCollapsed ? "ml-10" : "ml-80"
            }`}
          >
            <div className="h-full w-full p-7 flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="font-bold text-xl pl-1">문제 수정하기</div>
              <div className="items-center flex">
                <div
                  onClick={updateEvent}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
                >
                  저장하기
                </div>
                <div
                  onClick={() => setUpdateQuestion(null)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>


            
            <div className="flex gap-3">
              <input
                type="text"
                className="block min-w-[50%] outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10"
                placeholder="문제를 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <select
                className="block border-b-2 text-sm px-2 py-1 h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="객관식">객관식</option>
                <option value="주관식">주관식</option>
              </select>
            </div>


            <input
              type="text"
              className="block outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10 w-1/2 flex-none"
              placeholder="태그를 입력해주세요"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            {type === "객관식" ? (<div className="flex gap-5">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="answer"
                    onChange={() => setAnswer(select1)}
                    checked={answer === select1} 
                    />
                  <input
                    type="text"
                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                    placeholder="선택지1"
                    value={select1}
                    onChange={(e) => setSelect1(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="answer"
                    checked={answer === select2} 
                    onChange={() => setAnswer(select2)}
                  />
                  <input
                    type="text"
                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                    placeholder="선택지2"
                    value={select2}
                    onChange={(e) => setSelect2(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="answer"
                    checked={answer === select3} 
                    onChange={() => setAnswer(select3)}
                  />
                  <input
                    type="text"
                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                    placeholder="선택지3"
                    value={select3}
                    onChange={(e) => setSelect3(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="answer"
                    checked={answer === select4} 
                    onChange={() => setAnswer(select4)}
                  />
                  <input
                    type="text"
                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                    placeholder="선택지4"
                    value={select4}
                    onChange={(e) => setSelect4(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="bg-gray-50 flex rounded"
                style={{
                  backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  className="w-full h-full text-xs opacity-0"
                  onChange={handleFileChange}
                />
              </div>
            </div>) : (                      
              <div className="flex gap-3 flex-1">
                                  <input
                                    type="text"
                                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                                    placeholder="정답"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                  />
                                  <div
                                    className="bg-gray-50 flex rounded"
                                    style={{
                                      backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept=".jpg, .jpeg, .png"
                                      className="w-full h-full text-xs opacity-0"
                                      onChange={handleFileChange}
                                    />
                                  </div>
                        </div>)}
            
          
          </div>
       
        
        </div>
      
  
      );
    
}

export default UpdateModal;