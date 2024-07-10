import React from 'react';
import Modal from 'react-modal';
import './style/Modal.css';

Modal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
    </Modal>
  );
};

export default LoginModal;
