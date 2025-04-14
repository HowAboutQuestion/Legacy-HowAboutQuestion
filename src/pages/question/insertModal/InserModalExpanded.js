import React from "react";

function InsertModalExpanded({
  title,
  setTitle,
  type,
  setType,
  select1,
  setSelect1,
  select2,
  setSelect2,
  select3,
  setSelect3,
  select4,
  setSelect4,
  description,
  setDescription,
  tag,
  setTag,
  renderImageUpload,
  insertEvent,
  titleInputRef,
  setInsertModal,
  selectedOptionIndex,
  setSelectedOptionIndex,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between">
          <div className="font-bold text-xl pl-1">문제 추가하기</div>
          <div className="items-center flex">
            <div
              onClick={insertEvent}
              className="cursor-pointer bg-blue-500 transition hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
            >
              저장하기
            </div>
            <div
              onClick={() => setInsertModal(false)}
              className="cursor-pointer bg-blue-500 transition hover:scale-105 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <input
              ref={titleInputRef}
              type="text"
              className="block min-w-[50%] outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10"
              placeholder="문제를 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className="block border-b-2 text-sm px-2 py-1 h-10 outline-none border-gray-200 focus:border-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="객관식">객관식</option>
              <option value="주관식">주관식</option>
            </select>
          </div>
          <input
            type="text"
            className="block outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10 w-1/2"
            placeholder="문제집 또는 태그를 입력해주세요"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {type === "객관식" ? (
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  className="focus:outline-blue-500"
                  type="radio"
                  name="answer"
                  value={select1}
                  checked={selectedOptionIndex === 0}
                  onChange={() => setSelectedOptionIndex(0)}
                />
                <textarea
                  rows="3"
                  maxLength={300}
                  className="flex-1 block text-sm leading-6 border-2 rounded-md outline-none border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                  placeholder="선택지1"
                  value={select1}
                  onChange={(e) => setSelect1(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="focus:outline-blue-500"
                  type="radio"
                  name="answer"
                  value={select2}
                  checked={selectedOptionIndex === 1}
                  onChange={() => setSelectedOptionIndex(1)}
                />
                <textarea
                  rows="3"
                  maxLength={300}
                  className="flex-1 block text-sm leading-6 border-2 rounded-md outline-none border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                  placeholder="선택지2"
                  value={select2}
                  onChange={(e) => setSelect2(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="focus:outline-blue-500"
                  type="radio"
                  name="answer"
                  value={select3}
                  checked={selectedOptionIndex === 2}
                  onChange={() => setSelectedOptionIndex(2)}
                />
                <textarea
                  rows="3"
                  maxLength={300}
                  className="flex-1 block text-sm leading-6 border-2 rounded-md outline-none border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                  placeholder="선택지3"
                  value={select3}
                  onChange={(e) => setSelect3(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="focus:outline-blue-500"
                  type="radio"
                  name="answer"
                  checked={selectedOptionIndex === 3}
                  onChange={() => setSelectedOptionIndex(3)}
                />
                <textarea
                  rows="3"
                  maxLength={300}
                  className="flex-1 block text-sm leading-6 border-2 rounded-md outline-none border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                  placeholder="선택지4"
                  value={select4}
                  onChange={(e) => setSelect4(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <textarea
                  rows="5"
                  maxLength={300}
                  placeholder="설명"
                  className="w-2/3 border-2 text-sm outline-none border-gray-200 px-2 py-1 rounded-md focus:border-blue-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="w-1/3 h-full transform transition duration-300 hover:scale-105">
                  {renderImageUpload()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea
                rows="9"
                maxLength={800}
                className="flex-1 block text-sm border-2 rounded-md outline-none border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                placeholder="정답"
                value={""} // 주관식은 answer 값을 직접 사용해도 되고 필요에 따라 추가하세요.
                onChange={() => {}}
              />
              <textarea
                rows="5"
                maxLength={300}
                className="block text-sm border-2 rounded-md border-gray-200 outline-none focus:border-blue-500 px-2 py-1 resize-none"
                placeholder="설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="flex-1 mx-auto mt-4 transform transition duration-300 hover:scale-105">
                {renderImageUpload()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsertModalExpanded;
