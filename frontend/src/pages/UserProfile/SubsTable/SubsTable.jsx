import React,  { useEffect, useState } from 'react';
import './SubsTable.css';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
const SubsTable = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch('/api/users/all-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any headers needed for authentication if required
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userdata = await response.json();
        setSubscriptionData(userdata.subscriptions);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchSubscriptionData();
  }, []); // Fetch data when the component mounts

  if (subscriptionData<1) {
    return <><h1>Oops no Subscriptions yet</h1>
     <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',marginLeft:'380px',width:'230px'}}>Add Data Subscription+</button></Link></>; // You can replace this with your loading indicator or message
  }

  // Function to handle subscription click, you can navigate to a detailed view or perform other actions
  const handleSubscriptionClick = (subscription) => {
    // Implement the logic to handle the click, e.g., navigate to a detailed view
    // Example: navigate(`/subscriptions/${subscription.id}`)
    navigate("/");
  };

  return (
    <div style={{ width: '1400px',paddingTop:'105px',marginRight:'10px'}} className="container-xl px-4 mt-4">
         
      <div className="card mb-4" style={{paddingBottom:'60px'}}>
        <div className="card-header">• • •
        <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',marginLeft:'380px',width:'230px'}}>Add Data Subscription+</button></Link>

        </div>
        <div className="card-body p-0">
          <div className="table-responsive table-billing-history">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th className="border-gray-200" scope="col">Serial No</th>
                  <th className="border-gray-200" scope="col">Subscription name</th>
                  <th className="border-gray-200" scope="col">Base station</th>
                  
                  <th className="border-gray-200" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
              {subscriptionData.map((subscription, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{subscription.description}</td>
                    <td>{subscription.basemountpoint}</td>
                    <td>
                    <Link style={{textDecoration:'none'}} to={`/map/${subscription.basemountpoint}?subid=${subscription._id}`}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',marginLeft:'10px',width:'180px'}}>Map</button></Link>
                    <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',marginLeft:'10px',width:'180px'}}>Log status</button></Link>
                    <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',marginLeft:'10px',width:'180px'}}>Statistics</button></Link>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsTable;
