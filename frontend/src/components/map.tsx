// import '@tomtom-international/web-sdk-maps/dist/maps.css'
// import tt from '@tomtom-international/web-sdk-maps/dist';

import { LatLng } from "leaflet";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./searchBar";


// function ParkingMap() {
//   const mapElement = useRef();
//   const [mapLongitude, setMapLongitude] = useState(-121.91599);
//   const [mapLatitude, setMapLatitude] = useState(37.36765);
//   const [mapZoom, setMapZoom] = useState(13);
//   const [map, setMap] = useState({});


//   useEffect(() => {
//     let map = tt.map({
//       key: "<API key goes here>",
//       container: mapElement.current,
//       center: [mapLongitude, mapLatitude],
//       zoom: mapZoom
//     });
//     setMap(map);
//     return () => map.remove();
//   }, []);

//   const increaseZoom = () => {
//     if (mapZoom < /*MAX_ZOOM*/ 20) {
//       setMapZoom(mapZoom + 1);
//     }
//   };
  
//   const decreaseZoom = () => {
//     if (mapZoom > 1) {
//       setMapZoom(mapZoom - 1);
//     }
//   };
  
//   const updateMap = () => {
//     map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
//     map.setZoom(mapZoom);
//   };

//   return (
//     <>
//       <input
//         type="text"
//         name="longitude"
//         value={mapLongitude}
//         onChange={(e) => setMapLongitude(e.target.value)}
//       />

//       {/* <div ref={mapElement} className="mapDiv"></div> */}
//     </>
//   );
// }

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
      </>
    );
  }

  return (
    <>
      <SearchBar />
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
    </>
  );
}

export default ParkingMap;
