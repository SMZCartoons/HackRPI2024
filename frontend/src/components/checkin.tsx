import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface CheckInProps {
    onSubmit: (arg0:string, arg1:string) => void;
    Fuckname: string;
    backendId: string;
}

const CheckIn: React.FC<CheckInProps> = ({onSubmit, Fuckname, backendId}) => {
    const [handicapSpot, setHandicapSpot] = useState(false);
    const [usedCharger, setUsedCharger] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async () => {
        const data = {
            handicapSpot,
            usedCharger,
        };
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/checkin/' + backendId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify(data),
            })
            .then(response => {onSubmit(Fuckname, backendId); return response;})
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
                                <span style={{ marginLeft: '5px' }}>Did you park in a Handicap Spot?</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={usedCharger}
                                    onChange={(e) => setUsedCharger(e.target.checked)}
                                />
                                <span style={{ marginLeft: '5px' }}>If you have an electric vehicle, did you use a charger?</span>
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