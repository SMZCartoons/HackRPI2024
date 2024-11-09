import LotStats from "../components/lotStats";
import ParkingMap from "../components/map";

function Home() {
  return (
    <div className="page">
      <div className="home-page">
          <ParkingMap />
          <LotStats />
      </div>
    </div>
  );
}

export default Home;
