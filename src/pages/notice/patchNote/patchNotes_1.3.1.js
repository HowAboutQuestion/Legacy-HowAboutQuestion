import React from "react";

function PatchNotes131() {
  return (
    <div className="w-full">
      <header className="mt-8 relative w-full h-64 overflow-hidden bg-white">
        <a
          href="https://github.com/HowAboutQuestion/Legacy-HowAboutQuestion/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
        >
          <img
            src="./images/help/1_3_1/tellme.png"
            alt="의견 남기러 가기"
            className="w-full h-full object-contain cursor-pointer"
          />
        </a>
      </header>

      <div className="mt-4 text-center">
        좋았던 점이나 개선이 필요한 부분을 남겨주시면 큰 힘이 됩니다!
      </div>
      
    </div>
  );
}

export default PatchNotes131;
