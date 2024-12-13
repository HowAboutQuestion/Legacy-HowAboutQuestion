import React, {useState} from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue } from "recoil";
import QuestionItem from 'pages/question/QuestionItem';

function Questions() {
    const questions = useRecoilValue(questionsAtom);
    const questionsItems = questions.map((question, index) => 
      <QuestionItem  key={index} question = {question}></QuestionItem>
    )

    const allTag = useRecoilValue(allTagAtom);
    const allTagItems = allTag.map((tagName, index) => <span key={index} className="whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold bg-gray-300 border-none">
      {tagName}
    </span>)


    const [isCollapsed, setIsCollapsed] = useState(true);

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

            <div className="w-full p-5 ">
              

              {!isCollapsed && <div className="font-bold">문제검색</div>}
              {!isCollapsed && (
                <input
                  type="text"
                  className="border-gray-300 border-1 rounded py-1 w-full mt-3 text-sm"
                />
              )}
          </div>

            {!isCollapsed && (
              <div className="w-full p-5 ">
                <div className="font-bold">필터태그</div>
                <div className="flex gap-2 py-2 w-full flex-wrap">
                  {allTagItems}
                  
                </div>
              </div>
            )}
          </div>         
          

          <div className={`mb-48 transition-all duration-500 flex-1 sm:rounded-lg ${
              isCollapsed ? "ml-10" : "ml-80"
            }`}>

            <div className="px-8 py-4 flex justify-between border-b">
              <div>
                <h1 className="text-2xl font-semibold">문제 관리</h1>
                <h1 className="text-md font-normal text-gray-400">총 {questions.length} 문제</h1>
              </div>
              <div className="py-4 bg-white text-right">
              <div className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2">
                  문제추가
                </div>
                <div className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2">
                  다운로드
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
                  <th scope="col" className="px-6 py-3 rounded-tr-xl"></th>
                </tr>
              </thead>
              <tbody>
                {questionsItems}
              </tbody>
            </table>
          </div>

          <div className="hidden flex flex-col gap-3 fixed bottom-0 bg-gray-300 h-48 w-full p-4">
              <input className='block' type='text'></input>
              <input className='block' type='text'></input>
              
              <div className='flex gap-1'>
                <div className='flex gap-1 flex-1 flex-col'>
                  <input type='text' className='block flex-1'></input>
                  <input type='text' className='block flex-1'></input>
            
                </div>
                <div className='flex gap-1 flex-1 flex-col'>
                  <input type='text' className='block flex-1'></input>
                  <input type='text' className='block flex-1'></input>
              
                </div>
                <div className='p-10 bg-white'>이미지</div>

          </div>
          
         

          </div>

        </main>
      
  
      );
    
}

export default Questions;