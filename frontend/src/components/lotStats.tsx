import { Row, Col, Container, Button } from "react-bootstrap";
import { useState, useRef } from "react";

function LotStats(LotInfo : any) {
  // const [totalSpots, setTotalSpots] = useState(LotInfo.totalSpots);
  // const [capacity, setCapacity] = useState("-");
  // const [spotsAvailable, setSpotsAvailable] = useState("-");

  // const ref = useRef(null);

  const infoButtonClick = (e : any) => {
    e.preventDefault();
    console.log(LotInfo)

    //scrollintoview
    var element = document.getElementById("bottom-row");
    element?.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <Container fluid className="lotStatsContainer">
        <div className="info-button-div"><Button variant="info" onClick={(e) => infoButtonClick(e)}>Lot Info</Button></div>
        <Row>
          <Col>
            <h5>Total Spots</h5>
            <h2>{LotInfo.totalSpots}</h2>
          </Col>
          <Col>
            <h5>Capacity</h5>
            <h2>{LotInfo.capacity}</h2>
          </Col>
          <Col>
            <h5>Spots Available</h5>
            <h2>{LotInfo.spotsAvailable}</h2>
          </Col>
        </Row>

        <Row id="bottom-row">
          <Col>
            <h5>Chargers Available</h5>
            <h2>{LotInfo.chargersAvailable}</h2>
          </Col>
          <Col>
            <h5>Handicap Spots Available</h5>
            <h2>{LotInfo.handicap}</h2>
          </Col>
          <Col>
            <h5>Parking Lot Access</h5>
            <h2>{LotInfo.lotAccess}</h2>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LotStats;