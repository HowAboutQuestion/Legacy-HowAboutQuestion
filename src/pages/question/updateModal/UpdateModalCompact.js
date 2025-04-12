import React from "react";

function UpdateModalCompact({
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
  answer,
  setAnswer,
  tag,
  setTag,
  description,
  setDescription,
  date,
  selectedOptionIndex,
  setSelectedOptionIndex,
  renderImageUpload,
  updateEvent,
  updateCancelEvent,
  titleInputRef,
  setInsertModal, // 혹은 setUpdateModal 등 필요에 따라 변경
}) {
  return (
    <div className="flex gap-2">
      <div className="flex-[2]">
        <div className="flex justify-between">
          <div className="font-bold text-xl pl-1">문제 수정하기</div>
          <div className="items-center flex">
            <div
              onClick={updateEvent}
              className="cursor-pointer bg-blue-500 transition hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
            >
              저장하기
            </div>
            <div
              onClick={updateCancelEvent}
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
        <div className="flex gap-2">
          <div className="flex-[2]">
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
              className="block outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10 w-1/2 flex-none"
              placeholder="문제집 또는 태그를 입력해주세요"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            {type === "객관식" ? (
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex gap-3">
                    <input
                      className="focus:outline-blue-500"
                      type="radio"
                      name="answer"
                      checked={selectedOptionIndex === 0}
                      onChange={() => setSelectedOptionIndex(0)}
                    />
                    <textarea
                      rows="1"
                      maxLength={300}
                      className="flex-1 block text-sm h-10 leading-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1"
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      placeholder="선택지1"
                      value={select1}
                      onChange={(e) => setSelect1(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          !e.shiftKey &&
                          e.key === "Enter" &&
                          e.target.value.split("\n").length === 1
                        ) {
                          e.preventDefault();
                          updateEvent();
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <input
                      className="focus:outline-blue-500"
                      type="radio"
                      name="answer"
                      checked={selectedOptionIndex === 1}
                      onChange={() => setSelectedOptionIndex(1)}
                    />
                    <textarea
                      rows="1"
                      maxLength={300}
                      className="flex-1 block text-sm h-10 leading-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1"
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      placeholder="선택지2"
                      value={select2}
                      onChange={(e) => setSelect2(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          !e.shiftKey &&
                          e.key === "Enter" &&
                          e.target.value.split("\n").length === 1
                        ) {
                          e.preventDefault();
                          updateEvent();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex gap-3">
                    <input
                      className="focus:outline-blue-500"
                      type="radio"
                      name="answer"
                      checked={selectedOptionIndex === 2}
                      onChange={() => setSelectedOptionIndex(2)}
                    />
                    <textarea
                      rows="1"
                      maxLength={300}
                      className="flex-1 block text-sm h-10 leading-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1"
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      placeholder="선택지3"
                      value={select3}
                      onChange={(e) => setSelect3(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          !e.shiftKey &&
                          e.key === "Enter" &&
                          e.target.value.split("\n").length === 1
                        ) {
                          e.preventDefault();
                          updateEvent();
                        }
                      }}
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
                      rows="1"
                      maxLength={300}
                      className="flex-1 block text-sm h-10 leading-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1"
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      placeholder="선택지4"
                      value={select4}
                      onChange={(e) => setSelect4(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          !e.shiftKey &&
                          e.key === "Enter" &&
                          e.target.value.split("\n").length === 1
                        ) {
                          e.preventDefault();
                          updateEvent();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 flex-1 mt-[6px]">
                <textarea
                  rows="4"
                  maxLength={800}
                  className="flex-1 block text-sm outline-none border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1 resize-none"
                  placeholder="정답"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex-1 mt-4 transform transition duration-300 hover:scale-105">
            {renderImageUpload()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateModalCompact;
