import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface CheckOutProps {
    onSubmit: () => void;
}

const CheckOut: React.FC<CheckOutProps> = ({ onSubmit }) => {
    const [leftParkingLot, setLeftParkingLot] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async () => {
        const data = {
            leftParkingLot,
        };
        try {
            const response = await fetch(process.env.SERVER_URL + '/buildings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {onSubmit(); return response;})
            .catch(error => {alert('An error occurred.');});
        } catch (error) {
            alert('An error occurred.');
        };
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Check Out
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Parking Check-Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={leftParkingLot}
                                    onChange={(e) => setLeftParkingLot(e.target.checked)}
                                />
                                Did you leave the parking lot?
                            </label>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CheckOut;