// Modal that appears to know more information about the Task from the Timetable including its Description
import { useState } from 'react';
import Modal from 'react-modal';

const TimetableTaskModal = ({task, isOpen, onClose}) => {

    if (!task) return null;
    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}>
                <p> Title: {task.title}</p>
                <p> Description: {task.description}</p>
                <button onClick={onClose}>Close</button>
            </Modal>
        </>
    )
}

export default TimetableTaskModal