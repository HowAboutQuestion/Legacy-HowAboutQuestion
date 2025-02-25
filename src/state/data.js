import { atom } from "recoil";

const questionsAtom = atom({
  key: "questions", // Atom의 고유 키
  default: [], // 초기 상태
})

const allTagAtom = atom({
  key: "allTag", // Atom의 고유 키
  default: [], // 초기 상태
})

const historyDataAtom = atom({
  key: "historyDataAtom",
  default: [],
});

const recommendedQuestionsAtom = atom({
  key: "recommendedQuestionsAtom",
  default: [],
});

const selectedTagsAtom = atom({
  key: "selectedTagsAtom",
  default: [],
});

const selectedQuestionsAtom = atom({
  key: "selectedQuestionsAtom",
  default: [],
});


const appPathAtom = atom({
  key: "appPathAtom",
  default: "",
});


export {questionsAtom, allTagAtom, historyDataAtom, recommendedQuestionsAtom, selectedTagsAtom, selectedQuestionsAtom, appPathAtom};
