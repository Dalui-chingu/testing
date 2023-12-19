import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import RegisterForm from '../elements/Forms/UpdateProfile';
import SideBarButton from '../elements/SideBarButtons/SideBarButtons';
import SubsTable from '../pages/UserProfile/SubsTable/SubsTable';

const ProfileScreen = () => {
  
 

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div style={{marginRight:'900px',display:'flex',flexDirection:'row'}}>
      <RegisterForm/>
      <SubsTable/>
      </div>
    </div>
  );
};

export default ProfileScreen;