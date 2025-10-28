import React, { useState } from "react";
import PatchNotes130 from "./patchNote/patchNotes_1.3.0.js";

const Notice = ({ closeNotice }) => {

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between sticky bg-white pb-5 top-0 border-b">
        <div className="text-3xl font-bold">공지사항</div>
        <button
          onClick={closeNotice}
          className="cursor-pointer text-sm font-bold px-4 py-2 rounded transition bg-gray-100 hover:bg-gray-200"
        >
          닫기
        </button>
      </div>

      <div className="flex flex-col top-0 max-h-[80vh] overflow-y-auto p-4">
        
        <div className= "flex justify-center items-center">
          <PatchNotes130/>
        </div>
        <div className=" mt-4">
          
        </div>

        {/* 푸터 */}
        <footer className="mt-16 text-gray-600 text-sm transition-colors duration-300 border-t pt-5">
          <div className="max-w-screen-md mx-auto text-center">
            <a
              href="https://github.com/HowAboutQuestion/Lagacy-HowAboutQuestion/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-gray-800 dark:text-white mb-2 hover:underline"
            >
              HowAboutQuestion
            </a>
            <p className="text-xs mb-6 text-gray-500">
              A simple quiz platform powered by React and creativity.
            </p>
            <div className="flex justify-center gap-6 flex-wrap items-center mb-6">
              <div className="flex items-center gap-2 group">
                <img
                  src="./images/help/github.svg"
                  alt="GitHub Icon"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <a
                  href="https://github.com/haerim-kweon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  khaelim1311
                </a>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2 group">
                <img
                  src="./images/help/github.svg"
                  alt="GitHub Icon"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <a
                  href="https://github.com/cod0216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  cod0216
                </a>
              </div>
            </div>
            <p className="italic text-xs text-gray-400">
              © {new Date().getFullYear()} khaelim1311, cod0216. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Notice;
