import React, { ReactNode } from "react";
import { Button } from "../Buttons/button";

interface ModalProps {
    onClose?: () => void;
    children: ReactNode;
    className?: string;
}

const Modal = ({ onClose, children, className }: ModalProps) => {
    return (
        <div className={`bg-gray-800 bg-opacity-50 fixed top-0 left-0 w-full h-full grid justify-center items-center z-10 ${className}`}>
            <div className="bg-white p-10 rounded-md grid">
                <div className="justify-center items-center grid">{children}</div>
                <div className="justify-end grid">
                    <Button action={onClose} text="Close" />
                </div>
            </div>
        </div >
    );
};

export default Modal;
