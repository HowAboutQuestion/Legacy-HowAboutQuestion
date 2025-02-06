import React from 'react';
import ReactDOM from 'react-dom';

const LargeModal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg relative w-full max-w-4xl p-6">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default LargeModal;
