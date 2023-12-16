import Sidebar from "../../components/sidebar/Sidebar";

import "./home.scss";
import DashboardDefault from '../../components/Dashboardcomp/index';
import Subscriptions from "../Subscriptions/Subscriptions";
import SubsTable from "../UserProfile/SubsTable/SubsTable";

const Home = () => {
  return (
    <div className="home" >
      <Sidebar />
      <div className="homeContainer">
        <button style={{padding:'5px 15px',borderRadius:'7px',marginLeft:'20px', margin:'10px',backgroundColor:'gray',color:'white'}}>Dashboard</button>
        <SubsTable/>
      </div>
    </div>
  );
};

export default Home;
