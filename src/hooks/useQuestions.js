import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { questionsAtom, allTagAtom } from 'state/data.js';
import { getTodayDate, generateUniqueId } from 'utils';
import { toast } from 'react-toastify';

/**
 * 질문 CRUD 작업을 관리하는 커스텀 훅
 * @returns {Object} 질문 관련 CRUD 함수들과 상태
 */
const useQuestions = () => {
  const [questions, setQuestions] = useRecoilState(questionsAtom);
  const setAllTag = useSetRecoilState(allTagAtom);
  
  /**
   * CSV 파일을 업데이트하는 메서드
   * @param {*} updatedQuestions 덮어쓰기할 배열
   * @returns 덮어쓰기된 배열
   */
  const updateCSVFile = async (updatedQuestions) => {
    try {
      await window.electronAPI.updateQuestions(updatedQuestions);
      return { success: true };
    } catch (error) {
      console.error('CSV 파일 업데이트 중 오류:', error);
      return { success: false, error };
    }
  };

  // 태그 목록 업데이트
  useEffect(() => {
    // 모든 질문에서 고유한 태그 추출
    const uniqueTags = [...new Set(questions.flatMap(q => q.tag || []))];
    setAllTag(uniqueTags);
  }, [questions, setAllTag]);

  // 질문 추가
  const addQuestion = async (questionData, imageFile = null) => {
    const { title, type, select1, select2, select3, select4, answer, tag, description } = questionData;
    
    // 제목 유효성 검사
    if (!title) {
      toast.error("제목은 필수 입력 항목입니다", { toastId: "insert-title-error" });
      return { success: false };
    }

    // 태그 처리
    const tags = tag
      ? [...new Set(tag.split(",").map(item => item.trim()))]
      : [];

    // 질문 객체 생성
    const newQuestion = {
      title,
      type,
      select1: type === "객관식" ? select1 : "",
      select2: type === "객관식" ? select2 : "",
      select3: type === "객관식" ? select3 : "",
      select4: type === "객관식" ? select4 : "",
      answer,
      description,
      img: null,
      level: 0,
      date: getTodayDate(),
      update: getTodayDate(),
      recommenddate: getTodayDate(),
      solveddate: null,
      id: generateUniqueId(questions),
      tag: tags,
      checked: false,
    };

    // 객관식 답안 검증
    if (type === "객관식" && !answer) {
      toast.error("객관식 답안을 설정해주세요", { toastId: "write-multi" });
      return { success: false };
    }

    // 이미지 처리
    if (imageFile) {
      try {
        const result = await handleSaveImage(newQuestion.id, imageFile);
        if (result.success) {
          newQuestion.img = result.path;
        } else {
          toast.error("이미지 저장에 실패했습니다.", { toastId: "image-false" });
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        toast.error("이미지 저장 중 오류가 발생했습니다.", { toastId: "image-error" });
      }
    }

    // 질문 상태 업데이트
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    
    // CSV 파일 업데이트
    const csvResult = await updateCSVFile(updatedQuestions);
    
    return { success: true, question: newQuestion };
  };

  // 질문 업데이트
  const updateQuestion = async (updatedQuestion, index, oldImagePath = null, newImageFile = null) => {
    // 기존 질문 복사
    const updatedQuestions = [...questions];
    
    // 이미지 처리
    if (newImageFile) {
      try {
        // 새 이미지 저장
        const result = await handleSaveImage(updatedQuestion.id, newImageFile);
        if (result.success) {
          updatedQuestion.img = result.path;
          
          // 기존 이미지 삭제
          if (oldImagePath) {
            await window.electronAPI.deleteImage(oldImagePath);
          }
        }
      } catch (error) {
        console.error("이미지 업데이트 중 오류 발생:", error);
        toast.error("이미지 업데이트 중 오류가 발생했습니다.");
      }
    }
    
    // 질문 업데이트
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
    
    // CSV 파일 업데이트
    await updateCSVFile(updatedQuestions);
    
    return { success: true };
  };

  // 질문 삭제
  const deleteQuestions = async (checkedIndices) => {
    const deleteImages = [];
    
    // 체크된 질문들을 필터링하고 삭제할 이미지 경로 수집
    const updatedQuestions = questions.filter((question, idx) => {
      if (checkedIndices.includes(idx)) {
        if (question.img) deleteImages.push(question.img);
        return false;
      }
      return true;
    });
    
    // 질문 상태 업데이트
    setQuestions(updatedQuestions);
    
    // CSV 파일 업데이트
    await updateCSVFile(updatedQuestions);
    
    // 이미지 삭제
    deleteImages.forEach(async (img) => {
      try {
        await window.electronAPI.deleteImage(img);
      } catch (error) {
        console.error("이미지 삭제 중 오류 발생:", error);
      }
    });
    
    return { success: true };
  };

  // ZIP 파일 가져오기
  const importQuestionsFromZip = async (file) => {
    try {
      const result = await window.electronAPI.extractZip(file);
      if (result.success) {
        setQuestions([...result.questions, ...questions]);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error("ZIP 파일 처리 중 오류:", error);
      return { success: false, error };
    }
  };

  // ZIP 파일로 내보내기
  const exportQuestionsToZip = async (selectedQuestions) => {
    try {
      // checked 및 id 속성 제거
      const processedQuestions = selectedQuestions.map(question => {
        const { checked, id, ...rest } = question;
        return rest;
      });
      
      const result = await window.electronAPI.exportQuestions(processedQuestions);
      return result;
    } catch (error) {
      console.error("ZIP 파일 내보내기 중 오류:", error);
      return { success: false, error };
    }
  };

  // 이미지 저장 헬퍼 함수
  const handleSaveImage = async (id, file) => {
    try {
      const result = await window.electronAPI.saveImage(id, file);
      return result;
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestions,
    importQuestionsFromZip,
    exportQuestionsToZip
  };
};

export default useQuestions;