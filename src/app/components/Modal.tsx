// Modal.tsx
import React from 'react';

interface ModalProps {
    title: string;
    open: boolean;
    onOk: (values: any) => void;
    onCancel: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, open, onOk, onCancel, children }) => {
    if (!open) return null;

    const handleOk = () => {
        const formValues = {}; // Captura los valores de los inputs aquí
        onOk(formValues);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <div className="modal-content">{children}</div>
                <div className="modal-footer">
                    <button onClick={onCancel}>Cancelar</button>
                    <button onClick={handleOk}>Aceptar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
