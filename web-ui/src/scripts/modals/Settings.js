import Modal from 'react-modal';
import React from "react";

const Settings = ({isModalOpened}) => (
    <Modal isOpen={isModalOpened}>
      Hello modal
    </Modal>
);

export default Settings;