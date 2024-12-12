import React from "react";

function Single ({question, index}) {

        return(
                      <div className="flex flex-col gap-8 p-10 items-center">
            <div className="text-xl font-bold">
              <span>{index + 1}.</span>
              <span>
                {question.title}
              </span>
            </div>
            <div>
              <img
                className="bg-gray-50 max-w-max w-96 h-auto"
                src="https://cdn.mkhealth.co.kr/news/photo/202011/51201_51475_853.jpg"
                alt=""
              />
            </div>
            <input
              type="text"
              className="box border rounded-lg p-3 pr-10 w-3/4 min-w-96 max-w-98 w-400"
            />
          </div>

        )
    
}

export default Single ;