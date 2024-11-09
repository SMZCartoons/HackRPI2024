import { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";

function SearchBar() {
  const [isLot, setIsLot] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState({id: null, name: "Location"});
  const [selectedTime, setSelectedTime] = useState(0)
  const [lots, setLots] = useState([{id: null, name: null}]);
  const [buildings, setBuildings] = useState([{id: null, name: null}]);

  var timeChoices = []
  for(var i = 0; i < 24; i++) {
    var hour = i%12;
    if(hour == 0) hour = 12;
    var ampm = "am";
    if(i > 11) ampm = "pm";
    for(var minute = 0; minute < 4; minute++) {
      if(minute == 0) timeChoices.push(hour + ":00" + ampm);
      else {timeChoices.push(hour + ":" + minute*15 + ampm);}
    }
  }
  const dateObj = new Date();

  //get location data from backend, change endpoints later
  useEffect(() => {
    fetch(process.env.SERVER_URL + '/lots', {
      "method": "GET",
    })
      .then(response => response.json())
      .then(data => {
        setLots(data);
      });

      fetch(process.env.SERVER_URL + '/buildings', {
        "method": "GET",
      })
        .then(response => response.json())
        .then(data => {
          setBuildings(data);
        });

  }, []);

  const handleChangeLoc = (e : any) => {
    e.preventDefault();
    setSelectedLoc(e.target.value);
    var isLotLocal = false;
    for(var i = 0; i < lots.length; i++) {
      if(e.target.value.id === lots[i].id) {
        isLotLocal = true;
      }
    }
    setIsLot(isLotLocal);
  }

  const handleChangeTime = (e : any) => {
    e.preventDefault();
    setSelectedTime(e.target.value);
  }

  //submit id of location and the time to get 
  const handleSubmit = (e : any) => {
    e.preventDefault();

  }

  return (
    <div className="searchbar">
      <div className="inside-searchbar">
        <Row>
          {/* <Col md="3"> */}
          <Dropdown autoClose="outside" style={{height: "20px"}}>
            <Dropdown.Toggle id="location-dropdown">
              {selectedLoc.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Form.Select aria-label="Lot selection" onChange={(e: any) => handleChangeLoc(e)}>
                  <option>Lots</option>
                  {lots.map((lot) => (
                    <option value={`${lot}`}>{lot.name}</option>
                  ))}
                </Form.Select>
              </Dropdown.Item>

              <Dropdown.Item>
              <Form.Select aria-label="Building selection" onChange={(e: any) => handleChangeLoc(e)}>
                  <option>Buildings</option>
                  {buildings.map((building) => (
                    <option value={`${building}`}>{building.name}</option>
                  ))}
                </Form.Select>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* </Col> */}

          {/* <Col md="3"> */}
          <Form.Select aria-label="Time selection" defaultValue={} onChange={(e: any) => handleChangeTime(e)}>
            <option>Time</option>
            {timeChoices.map((time) => (
              <option value={`${time}`}>{time}</option>
            ))}
          </Form.Select>
          {/* </Col> */}
            
          {/* <Col md="3"> */}
            <Button type="submit" onClick={(e) => handleSubmit(e)}>Submit</Button>
          {/* </Col> */}
        </Row>
      </div>
    </div>
  );
}

export default SearchBar;