import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";

function LotStats() {
  const [totalSpots, setTotalSpots] = useState("-");
  const [capacity, setCapacity] = useState("-");
  const [spotsAvailable, setSpotsAvailable] = useState("-");


  return (
    <>
      <Container fluid className="lotStatsContainer">
        <Row>
          <Col>
            <h5>Total Spots</h5>
            <h2>{totalSpots}</h2>
          </Col>
          <Col>
            <h5>Capacity</h5>
            <h2>{capacity}</h2>
          </Col>
          <Col>
            <h5>Spots Available</h5>
            <h2>{spotsAvailable}</h2>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LotStats;