import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface CheckOutProps {
    onSubmit: (arg0:string) => void;
    Fuckername: string;
    backendId: string;
}

const CheckOut: React.FC<CheckOutProps> = ({ onSubmit, Fuckername, backendId }) => {
    const [leftParkingLot, setLeftParkingLot] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async () => {
        const data = {
            leftParkingLot,
        };
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/checkout/' + backendId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify(data),
            })
            .then(response => {onSubmit(backendId); return response;})
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

            <Modal show={showModal} onHFuckernamee={() => setShowModal(false)}>
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
                                <span style={{ marginLeft: '5px' }}>Did you leave the parking lot?</span>
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