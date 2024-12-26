import React, {useState, useEffect} from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";

function UpdateModal({ question, setUpdateQuestion, isCollapsed, index }) {
  const [title, setTitle] = useState(question.title || "");
  const [type, setType] = useState(question.type || "객관식");
  const [select1, setSelect1] = useState(question.select1 || "");
  const [select2, setSelect2] = useState(question.select2 || "");
  const [select3, setSelect3] = useState(question.select3 || "");
  const [select4, setSelect4] = useState(question.select4 || "");
  const [answer, setAnswer] = useState(question.answer || "");
  const [tag, setTag] = useState(question.tag.join(", ") || "");
  const [date, setDate] = useState(question.date || "");
  const [thumbnail, setThumbnail] = useState(question.img || null);
  const [imageFile, setImageFile] = useState(null);

  console.log(thumbnail);

  const setQuestions = useSetRecoilState(questionsAtom);

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(image);
      setImageFile(image);
    }
  };

  const handleSave = async (file) => {
    try {
      const result = await window.electronAPI.saveImage(file);
      return result;
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
      return { success: false, error: error.message };
    }
  };

  const updateEvent = async () => {
    if (!title) {
      alert("제목은 필수 입력 항목입니다");
      return;
    }

    const tags = tag ? [...new Set(tag.split(",").map((item) => item.trim()))] : [];
    const updatedQuestion = {
      ...question,
      title,
      type,
      select1,
      select2,
      select3,
      select4,
      answer,
      img: question.img,
      date,
      tag: tags,
    };

    if (imageFile) {
      try {
        const result = await handleSave(imageFile);
        if (result.success) {
          updatedQuestion.img = result.path;
        } else {
          console.error("이미지 저장 실패:", result.error);
          alert("이미지 저장에 실패했습니다.");
          return;
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        alert("이미지 저장 중 오류가 발생했습니다.");
        return;
      }
    }

    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = updatedQuestion;
      return updatedQuestions;
    });

    setUpdateQuestion(null);
  };

  useEffect(() => {
    setTitle(question.title || "");
    setType(question.type || "객관식");
    setSelect1(question.select1 || "");
    setSelect2(question.select2 || "");
    setSelect3(question.select3 || "");
    setSelect4(question.select4 || "");
    setAnswer(question.answer || "");
    setTag(question.tag.join(", ") || "");
    setDate(question.date || "");
    setThumbnail(question.img || null);
  }, [question]);


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
                  backgroundImage: thumbnail ? `url("${thumbnail}")` : "none",
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
                                      backgroundImage: thumbnail ? `url("${thumbnail}")` : "none",
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