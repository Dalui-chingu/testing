import  { useState,useEffect  } from 'react';
import { useSelector } from 'react-redux';
import { Link ,useNavigate} from 'react-router-dom';

import { Container, Typography, TextField, MenuItem } from '@mui/material';
import '../DataSubcription/DataSubcription.css';
import Sidebar from '../../components/sidebar/Sidebar';

function DataSubscriptionPage() {
  const [formData, setFormData] = useState({
    mountPoint: '',
    duration: '',
    correctionType: '',
    region: '',
    dataFormat: '',
    dataRate: '',
    username: '',
    password: '',
    subscriptionName: '',
  });


  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  // const [userLocation, setUserLocation] = useState(null);
  // const [nearbyBaseStations, setNearbyBaseStations] = useState([]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const location = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       };
  //       setUserLocation(location);

  //       // Filter nearby base stations
  //       const nearbyStations = allBaseStations.filter((baseStation) => {
  //         const distance = calculateDistance(location, baseStation.location);
  //         return distance <= 10; // Adjust threshold as needed (in kilometers)
  //       });

  //       setNearbyBaseStations(nearbyStations);
  //     },
  //     (error) => {
  //       console.error('Error getting user location:', error);
  //       // Handle errors here
  //     }
  //   );
  // }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo ? `Bearer ${userInfo.token}` : '',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Subscription created successfully
        // Reset form fields or navigate to a different page
        navigate('/subscriptions');
      } else {
        // Handle error response
      }
    } catch (error) {
      // Handle fetch error
    }
  };

  return (
    <div style={{display:'flex',width:'100%',paddingRight:'240px'}}>
    <Sidebar/>
    <Container className="container">
       <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Data Subscription</span>
        </div>
    
    <p></p>
    <center>
    <form style={{paddingTop:'20px',maxWidth:'500px'}} onSubmit={handleSubscribe}>
      
        <TextField
      style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
      name="mountPoint"
      label="Select Mount Point"
        variant="outlined"
        fullWidth
        value={formData.mountPoint}
        onChange={handleChange}
        className="text-input"
        required
      />
        <p></p>
      <TextField
      style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="duration"
        label="Subscription Duration"
        variant="outlined"
        fullWidth
        value={formData.duration}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="correctionType"
        label="Correction Type"
        variant="outlined"
        fullWidth
        value={formData.correctionType}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="region"
        label="Geographical Region"
        variant="outlined"
        fullWidth
        value={formData.region}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="dataFormat"
        label="Data Format"
        variant="outlined"
        fullWidth
        value={formData.dataFormat}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="dataRate"
        label="Data Rate or Quality"
        variant="outlined"
        fullWidth
        value={formData.dataRate}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="username"
        label="Username"
        variant="outlined"
        fullWidth
        value={formData.username}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="password"
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        value={formData.password}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <TextField
       style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}}
        name="subscriptionName"
        label="Subscription Name/Description"
        variant="outlined"
        fullWidth
        value={formData.subscriptionName}
        onChange={handleChange}
        className="text-input"
      />
       <p></p>
      <button  style={{boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px'}} type="submit"  className="subscribe-button">Subscribe</button>

    </form>
    </center>
  </Container>
  </div>
  );
}

export default DataSubscriptionPage;