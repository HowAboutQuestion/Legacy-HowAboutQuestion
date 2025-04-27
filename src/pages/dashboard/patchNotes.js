const patchNotes = `
<div class="space-y-8">
<div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      👾 <span class="font-mono">[확장 모드 버그 수정]</span> - <span class="italic">"미안하다, 업데이트 확인하려고 어그로 끌었다."</span>
    </h3>
    <div class="text-gray-700">
       문제 추가하면서 확장 모드로 변경 시 이미지 추가 및 정답 입력 문제와 갯수 카운트 등 버그를 수정했습니다.
    </div>
  </div>

  <!-- 타이머 기능 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      🕐 <span class="font-mono">[타이머 기능]</span> - <span class="italic">"이제 진짜 시작이다..."</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/timer.gif"
        alt="타이머"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      시간 한 번 딱! 정해놓고 <strong>나 자신과의 전쟁</strong>을 시작해보자. 몰입감 MAX, 정신줄도 MAX로 조여드립니다.
    </div>
  </div>

  <!-- 마크다운 문법 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      📄 <span class="font-mono">[마크다운 문법]</span> - <span class="italic">"나... 사실 코드 좀 써..."</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/markdown.gif"
        alt="마크다운"
        className="w-full mb-4 rounded-lg"
        />
    </div>    

    <div class="text-gray-700">
      아직은 쑥스럽지만, 그래도 백틱 정도는 사용할 수 있어요. <strong>(주의: 따옴표(") 는 빽틱 안에 사용하세요!)</strong>
    </div>
  </div>

  <!-- 설명 기능 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      💡 <span class="font-mono">[설명 기능]</span> - <span class="italic">"말이... 조금 길어질 수도 있어..."</span>
    </h3>
   <div>
        <img
        src="./images/help/patchNotes/description.gif"
        alt="설명"
        className="w-full mb-4 rounded-lg"
        />
    </div>

    <div class="text-gray-700">
      문제마다 짧은 수필 한 편 써도 괜찮아요. 전구 버튼으로 <strong>켜고 끄는 감성</strong>까지 챙겼습니다.
    </div>
  </div>

  <!-- 문제 섞기 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      🔀 <span class="font-mono">[문제 섞기]</span> - <span class="italic">"거 쪼매 섞어주이소. 내 손이 이래가"</span>
    </h3>
   <div>
        <img
        src="./images/help/patchNotes/suffle.gif"
        alt="문제 섞기"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      이제부터 사기치다 걸리면 잔짜 손모가지예요! 진정한 꾼들끼리 깨끗하게 풀어봐요!
    </div>
  </div>

  <!-- 확장모드 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      🖥 <span class="font-mono">[확장모드]</span> - <span class="italic">"크다 커! 진짜 크네?!"</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/expend.gif"
        alt="확장"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      좁은 데서 끙끙대지 말고, <strong>확 트인 판에서 시원하게</strong> 문제를 만들어봐요. 스케일은 클수록 좋다구요?
    </div>
  </div>

  <!-- 단축키 이용 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      ⌨ <span class="font-mono">[단축키 이용]</span> - <span class="italic">"마우스? 걔랑 사이 안 좋아요"</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/keyboard.gif"
        alt="키보드"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      엔터, 쉬프트 엔터, 탭이면 뭐든 됩니다. 마우스는 잠시 휴가 보냈어요.
    </div>
  </div>

  <!-- 태그 정렬 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      🏷 <span class="font-mono">[태그 정렬]</span> - <span class="italic">"이제 정리 좀 하고 살래요"</span>
    </h3>
       <div>
        <img
        src="./images/help/patchNotes/tag.png"
        alt="태그"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      알파벳 순, 사전 순 다 해드려요~. 이제 <strong>태그창 열면 엄마가 감탄해요!</strong>.
    </div>
  </div>

  <!-- PDF 뽑기 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      📄 <span class="font-mono">[PDF 뽑기]</span> - <span class="italic">"이건 저장각이다"</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/PDF.gif"
        alt="PDF"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      ???: "팀장이 결과 취합해서 MM 소통방에 올려주세요~"
    </div>
  </div>

  <!-- 그래프 개선 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      📊 <span class="font-mono">[그래프 개선]</span> - <span class="italic">"나 이만큼 틀렸다고요..."</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/graph.png"
        alt="그래프"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <div class="text-gray-700">
      맞은 문제, 틀린 문제, 태그별 정답률까지 <strong>그래프로 잔인하게</strong> 보여드립니다. (눈물은 닦고 봐요)
    </div>
  </div>

  <!-- 주관식 정답 처리 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      ✍️ <span class="font-mono">[주관식 정답 처리]</span> - <span class="italic">"진짜 오타였다고요..."</span>
    </h3>
    <div>
        <img
        src="./images/help/patchNotes/answer.gif"
        alt="주관식"
        className="w-full mb-4 rounded-lg"
        />
    </div>
    <p class="text-gray-700">
      이제 문제를 풀다가 애매한 답변도 <strong>정답 처리</strong>를 할 수 있어요!
    </p>
  </div>

  <!-- 기타 버그 개선 -->
  <div class="p-6 bg-white rounded shadow">
    <h3 class="text-2xl font-bold mb-2">
      🐞 <span class="font-mono">[기타 버그 개선]</span> - <span class="italic">"이제 버그가 날 피해 다녀"</span>
    </h3>
    <p class="text-gray-700">
      잡았다 요놈! 숨어있던 사소한 버그들 싹 다 조지고, 안정성 +5 올렸습니다.
    </p>
  </div>
</div>
`;

export default patchNotes;
