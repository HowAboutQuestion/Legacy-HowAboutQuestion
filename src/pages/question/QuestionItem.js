import React, {useState}  from 'react';

function QuestionItem({question}) {
  const tag = question.tag.map((tagName, index) => <span key={index}      className="font-medium text-xs whitespace-nowrap bg-gray-200 rounded-xl py-1 px-2">{tagName}</span>);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggle = () => {setIsCollapsed((state) => !(state))}



 
  if(question.type === '주관식'){
    return (
      <>
      <tr onClick={toggle} className={`${!isCollapsed && "border-b hover:shadow hover:bg-white"} transition-all `}>
        <td className="w-4 p-4 align-top py-4 px-8">
          <div className="flex items-center ">
            <input
              id="checkbox-table-search-1"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </td>
        <td className="flex items-center px-6 py-4 text-gray-900 ">
          <div className="flex-1">
            <div className="text-base font-bold">{question.title}</div>
            <div className="flex gap-1 mt-2">{tag}</div>
          </div>
        </td>
        <td className="hidden px-6 py-4 align-top">
          <div className="flex gap-1">{tag}</div>
        </td>
        <td className="px-6 py-4 align-top ">
          <div className="font-medium text-sm whitespace-nowrap">{question.type}</div>
        </td>
        <td className="px-10 py-2 align-top">
          <div className="rounded-xl hover:font-bold hover:bg-gray-100 w-max text-xs cursor-pointer text-blue-600 p-2">
            수정
        </div>
        </td>
      </tr>
      <tr className={` hover:shadow transition-all duration-500 ${isCollapsed ? "border-b" : ""}`}>
        <td></td>
        <td className="overflow-hidden">
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex-1 font-normal text-sm text-gray-500 flex flex-col px-6 pb-3 gap-2">
              <div className="border bg-white rounded-lg p-2.5 px-4">
                {question.answer}
              </div>
              
            </div>
            
          </div>
        </td>
        <td colSpan={2} className="overflow-hidden">
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            
            <div className="p-5 px-6">
              <img
                art=""
                src={question.img}
                className="bg-gray-200 rounded aspect-video min-w-[10vw] max-w-[20vw]"
              />
            </div>
          </div>
        </td>
      </tr>
    </>
    );
  }

  return (
    <>
      <tr onClick={toggle} className={`${!isCollapsed && "border-b hover:shadow hover:bg-white"} transition-all `}>
        <td className="w-4 p-4 align-top py-4 px-8">
          <div className="flex items-center ">
            <input
              id="checkbox-table-search-1"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </td>
        <td className="flex items-center px-6 py-4 text-gray-900 ">
          <div className="flex-1">
            <div className="text-base font-bold">{question.title}</div>
            <div className="flex gap-1 mt-2">{tag}</div>
          </div>
        </td>
        <td className="hidden px-6 py-4 align-top">
          <div className="flex gap-1">{tag}</div>
        </td>
        <td className="px-6 py-4 align-top ">
          <div className="font-medium text-sm whitespace-nowrap">{question.type}</div>
        </td>
        <td className="px-10 py-2 align-top">
        <div className="rounded-xl hover:font-bold hover:bg-gray-100 w-max text-xs cursor-pointer text-blue-600 p-2">
            수정
        </div>
        </td>
      </tr>
      <tr className={` hover:shadow transition-all duration-500 ${isCollapsed ? "border-b" : ""}`}>
        <td></td>
        <td className="overflow-hidden">
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex-1 font-normal text-sm text-gray-500 flex flex-col px-6 pb-3 gap-2">
              <div
                className={`border bg-white rounded-lg p-2.5 px-4 ${
                  question.select1 === question.answer ? "font-bold text-blue-500" : ""
                }`}
              >
                {question.select1}
              </div>
              <div
                className={`border bg-white rounded-lg p-2.5 px-4 ${
                  question.select2 === question.answer ? "font-bold text-blue-500" : ""
                }`}
              >
                {question.select2}
              </div>
              <div
                className={`border bg-white rounded-lg p-2.5 px-4 ${
                  question.select3 === question.answer ? "font-bold text-blue-500" : ""
                }`}
              >
                {question.select3}
              </div>
              <div
                className={`border bg-white rounded-lg p-2.5 px-4 ${
                  question.select4 === question.answer ? "font-bold text-blue-500" : ""
                }`}
              >
                {question.select4}
              </div>
            </div>
            
          </div>
        </td>
        <td colSpan={2} className="overflow-hidden">
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            
            <div className="p-5 px-6">
              <img

                src={question.img}
                className="bg-gray-200 rounded aspect-video min-w-[10vw] max-w-[20vw]"
              />
            </div>
          </div>
        </td>
      </tr>
    </>

  );
  
}

export default QuestionItem;