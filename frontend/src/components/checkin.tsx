import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface CheckInProps {
    onSubmit: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({onSubmit}) => {
    const [handicapSpot, setHandicapSpot] = useState(false);
    const [usedCharger, setUsedCharger] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async () => {
        const data = {
            handicapSpot,
            usedCharger,
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
                Check In
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Check In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={handicapSpot}
                                    onChange={(e) => setHandicapSpot(e.target.checked)}
                                />
                                Did you park in a Handicap Spot?
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={usedCharger}
                                    onChange={(e) => setUsedCharger(e.target.checked)}
                                />
                                If you have an electric vehicle, did you use a charger?
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

export default CheckIn;