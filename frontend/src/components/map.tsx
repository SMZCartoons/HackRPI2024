// import '@tomtom-international/web-sdk-maps/dist/maps.css'
// import tt from '@tomtom-international/web-sdk-maps/dist';

import { LatLng } from "leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
// import SearchBar from "./searchBar";
import {Row, Col, Container, Button, Dropdown, Form} from 'react-bootstrap';
import CheckIn from "./checkin";
import CheckOut from "./checkout";

import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

function LocationMarker() {
  // var nulll : LatLng = ;// = null;
  const [position, setPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

function ParkingMap() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lotID, setLotID] = useState("-1");

  const coordinates = {
    latitude: 42.730026,
    longitude: -73.680037
  };
  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const response = await axios.get('https://overpass-api.de/api/interpreter', {
          params: {
            data: `
              [out:json];
              (
              way["amenity"="parking"](around:500,${coordinates.latitude},${coordinates.longitude});
              way["building"](around:500,${coordinates.latitude},${coordinates.longitude});
            );
              out geom;
            `,
          },
        });
        setParkingSpots(response.data.elements);
      } catch (error) {
        console.error('Error fetching parking spots:', error);
      }
    };

    fetchParkingSpots();
  }, []);

  const handleSubmission = (num : string) => {
    setIsSubmitted(true);
    setLotID(num);
  };

  const handleSubmissionOut = () => {
    setIsSubmitted(false);
    setLotID("-1");
  };

  function getParkingTags(spot: any): JSX.Element {
    
    if (!spot || !spot.tags) {
      return <></>;
    }
  
    const tagsToCheck = ['access', 'fee', 'capacity'];
    const validTags = tagsToCheck
      .filter(tag => spot.tags[tag] !== null && spot.tags[tag] !== undefined)
      .map(tag => <span key={tag}>{tag}: {spot.tags[tag]}<br /></span>);
  
    const title = spot.tags.name ? `${spot.tags.name}` : 'Parking Spot';
  

    return (
      <>
        <strong>{title}</strong><br />
        {validTags}
        {!isSubmitted && <CheckIn onSubmit={handleSubmission} id={spot.id}/>}
      </>
    );
  }

  //lot info
  const [lotData, setLotData] = useState<any>({totalSpots: "-", capacity: "-", spotsAvailable: "-", chargersAvailable: "-", handicap: "-", lotAccess: "-"});

  const infoButtonClick = (e : any) => {
    e.preventDefault();
    // console.log(lotData)

    //scrollintoview
    var element = document.getElementById("bottom-row");
    element?.scrollIntoView({behavior: 'smooth'});
  }

  //search bar
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
    fetch(process.env.REACT_APP_SERVER_URL + '/lots', {
      "method": "GET",
    })
      .then(response => response.json())
      .then(data => {
        setLots(data);
      });

    fetch(process.env.REACT_APP_SERVER_URL + '/buildings', {
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

  //submit id of location and the time to get stats on lots and/or buildings
  const handleSubmit = (e : any) => {
    e.preventDefault();

    fetch(process.env.SERVER_URL + '/' + (isLot ? 'lotinfo' : 'buildinginfo') + '/' + selectedLoc.id + '/' + selectedTime, {
      "method": "GET",
    })
      .then(response => response.json())
      .then(data => {
        //figure out how to get data to stats component here
        setLotData(data);
      });
  }

  return (
    <>
      {/* <SearchBar /> */}

      <div className="searchbar">
        <div className="inside-searchbar">
          <Row>
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

            <Form.Select aria-label="Time selection" defaultValue={dateObj.getHours()%12 + ":" + dateObj.getMinutes() + ""} onChange={(e: any) => handleChangeTime(e)}>
              <option>{(dateObj.getHours() === 12 ? 12 : dateObj.getHours()%12) + ":" + (dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes()) + (dateObj.getHours() <11 ? 'am' : 'pm')}</option>
              {timeChoices.map((time) => (
                <option value={`${time}`}>{time}</option>
              ))}
            </Form.Select>
              
              <Button type="submit" onClick={(e) => handleSubmit(e)}>Submit</Button>
          </Row>
        </div>
      </div>
      {isSubmitted && <CheckOut onSubmit={handleSubmissionOut} id={lotID}/>}
      {/* <MapContainer style={{ height: "578px", width: "390px" }} center={[42.730026,-73.680037]} zoom={15} scrollWheelZoom={true}> */}
      <MapContainer center={[coordinates.latitude,coordinates.longitude]} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker position={[42.730026,-73.680037]} icon={}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */
        parkingSpots.map((spot : any) => {

          if (spot.tags['building']) { 
            return <Polygon
            pathOptions={{ color: 'red' }}
            key={spot.id}
            positions={spot.geometry.map((point : any) => [point.lat, point.lon])} >
            <Popup>{<strong>{spot.tags.name ? `${spot.tags.name}` : 'Unnamed Building'}</strong>}</Popup>
          </Polygon>
          }

          return spot.type === 'node' ? (
            <Marker key={spot.id} position={[spot.lat, spot.lon]}>
              <Popup>Parking Spot</Popup>
            </Marker>
          ) : (
            <Polygon
              pathOptions={{ color: 'blue' }}
              key={spot.id}
              positions={spot.geometry.map((point : any) => [point.lat, point.lon])}
            >
              <Popup>{getParkingTags(spot)}</Popup>
            </Polygon>
          )
})}
        <LocationMarker />
      </MapContainer>



      <Container fluid className="lotStatsContainer">
        <div className="info-button-div"><Button variant="info" onClick={(e) => infoButtonClick(e)}>Lot Info</Button></div>
        <Row>
          <Col>
            <h5>Total Spots</h5>
            <h2>{lotData.totalSpots}</h2>
          </Col>
          <Col>
            <h5>Capacity</h5>
            <h2>{lotData.capacity}</h2>
          </Col>
          <Col>
            <h5>Spots Available</h5>
            <h2>{lotData.spotsAvailable}</h2>
          </Col>
        </Row>

        <Row id="bottom-row">
          <Col>
            <h5>Chargers Available</h5>
            <h2>{lotData.chargersAvailable}</h2>
          </Col>
          <Col>
            <h5>Handicap Spots Available</h5>
            <h2>{lotData.handicap}</h2>
          </Col>
          <Col>
            <h5>Parking Lot Access</h5>
            <h2>{lotData.lotAccess}</h2>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ParkingMap;
