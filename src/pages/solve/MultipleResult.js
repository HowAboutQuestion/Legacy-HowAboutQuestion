import React from "react";

function MultipleResult({ question, index }) {

  return (
    <div className="flex flex-col gap-5 p-10">
      <div className="text-lg font-bold">
        <span>{index + 1}.</span>
        <span>{question.title}</span>
      </div>

      <div className="flex gap-3">

      
      {question.img && (
        <div>
          <img
            className="bg-gray-50 max-w-max w-60 h-auto rounded"
            src={question.img}
            alt=""
          />
        </div>
      )}

      <div className="font-normal text-sm flex flex-col gap-2 w-max">     
        {question.select1 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select1 ? "text-blue-500 font-bold" : question.selected === question.select1 ? "text-red-500 font-bold" : "" 
                }
              `}>
                {question.select1}
          </div>)}
          
          {question.select2 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select2 ? "text-blue-500 font-bold" : question.selected === question.select2 ? "text-red-500 font-bold" : "" 
                }
              `}>
                {question.select2}

          </div>)}
          
          {question.select3 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select3 ? "text-blue-500 font-bold" : question.selected === question.select3 ? "text-red-500 font-bold" : "" 
                }
              `}>
                {question.select3}

          </div>)}
          
          {question.select4 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select4 ? "text-blue-500 font-bold" : question.selected === question.select4 ? "text-red-500 font-bold" : "" 
                }
              `}>
                {question.select4}

          </div>)}
                 
      </div>

      </div>
    </div>
  );
}

export default MultipleResult;
