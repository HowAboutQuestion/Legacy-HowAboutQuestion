import { atom } from "recoil";

const questionsAtom = atom({
  key: "questions", // Atom의 고유 키
  default: [], // 초기 상태
})

const allTagAtom = atom({
  key: "allTag", // Atom의 고유 키
  default: [], // 초기 상태
})

export {questionsAtom, allTagAtom};
