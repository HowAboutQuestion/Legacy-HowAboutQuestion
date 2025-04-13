import { useState, useRef } from 'react';

/**
 * 이미지 업로드 처리를 위한 커스텀 훅
 * @returns {Object} 이미지 업로드 관련 상태와 함수들
 */
const useImageHandler = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  // 파일 선택 이벤트 처리
  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(image);
      setImageFile(image);
    }
  };

  // 드래그 이벤트 처리
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    setThumbnail(null);
    setImageFile(null);
  };

  // 상태 초기화
  const resetImage = () => {
    setThumbnail(null);
    setImageFile(null);
  };

  return {
    thumbnail,
    imageFile,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    resetImage
  };
};

export default useImageHandler;