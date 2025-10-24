import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Notice from "./Notice.js";
import { getAppVersion, markSeen } from 'services/noticeService.js';

const NoticeModal = ({ onClose }) => {
  const handleClose = useCallback(async () => {
    const version = await getAppVersion();
    markSeen(version);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const container = document.getElementById("modal-root") || document.body;

  const node = (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4" onClick={handleClose} >
         <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6" onClick={(e) => e.stopPropagation()}>
          <Notice closeNotice={handleClose} />
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(node, container);
};

export default NoticeModal;
