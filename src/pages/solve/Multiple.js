import React from 'react';


function Multiple ({question, index}) {
  console.log(index+1, question)
 
      return (
        <div className="flex flex-col gap-5 p-10 items-center ">
      <div className="text-xl font-bold">
        <span>{index + 1}.</span>
        <span>
          {question.title}
        </span>
      </div>
      <div>
        <img
          className="bg-gray-50 max-w-max w-96 h-auto rounded"
          src="https://cdn.mkhealth.co.kr/news/photo/202011/51201_51475_853.jpg"
          alt=""
        />
      </div>
      <form className="font-normal text-sm flex flex-col gap-2 w-max">
        <label className="border rounded-lg p-3 pr-10 ">
          <input
            type="radio"
            name="choice"
            className="mx-1 bg-gray-50 border-gray-300"
          />
          {question.select1}
          </label>
        <label className="border rounded-lg p-3 pr-10 ">
          <input
            type="radio"
            name="choice"
            className="mx-1 bg-gray-50 border-gray-300"
          />
          {question.select2}
        </label>
        <label className="border rounded-lg p-3 pr-10 ">
          <input
            type="radio"
            name="choice"
            className="mx-1 bg-gray-50 border-gray-300"
          />
          {question.select3}
        </label>
        <label className="border rounded-lg p-3 pr-10 ">
          <input
            type="radio"
            name="choice"
            className="mx-1 bg-gray-50 border-gray-300"
          />
          {question.select4}
        </label>
      </form>
    </div>
      
  
      );
    
}

export default Multiple;