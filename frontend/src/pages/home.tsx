import LotStats from "../components/lotStats";
import ParkingMap from "../components/map";
import { useState } from "react";

function Home() {
  // const [lotData, setLotData] = useState<any>({totalSpots: "-", capacity: "-", spotsAvailable: "-", chargersAvailable: "-", handicap: "-", lotAccess: "-"});

  // const handleClick = () => {
  //   setLotData({totalSpots: "-", capacity: "-", spotsAvailable: "oejfi", chargersAvailable: "-", handicap: "-", lotAccess: "-"});
  //   console.log(lotData);
  // }
  return (
    <div className="page">
      <div className="home-page">
          <ParkingMap />
          {/* <LotStats LotInfo={lotData}/> */}
      </div>
    </div>
  );
}

export default Home;
