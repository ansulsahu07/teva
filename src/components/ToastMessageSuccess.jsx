import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessageSuccess = ({ show, message, onClose }) => {
    return (
        <ToastContainer
            position="bottom-end"
            containerPosition="fixed"
            className="p-3"
            style={{ zIndex: 9999 }}
        >
            <Toast
                bg="success"
                show={show}
                onClose={onClose}
                delay={3000}
                autohide
            >
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastMessageSuccess;