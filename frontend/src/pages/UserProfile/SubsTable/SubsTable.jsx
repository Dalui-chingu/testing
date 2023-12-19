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
    return <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'250px',marginLeft:'200px',marginRight:'400px'}}>
    <h3 style={{color:'gray',fontWeight:'normal'}}>Oops no Subscriptions yet</h3>
     <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue'}}>Add Data Subscription +</button></Link></div>;
    
     // You can replace this with your loading indicator or message
  }

  // Function to handle subscription click, you can navigate to a detailed view or perform other actions
  const handleSubscriptionClick = (subscription) => {
    // Implement the logic to handle the click, e.g., navigate to a detailed view
    // Example: navigate(/subscriptions/${subscription.id})
    navigate("/");
  };

  return (
    <div style={{ paddingTop:'50px'}} className="container-xl px-4 mt-4">
                 <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 20px ',borderRadius:'5px',color:'white',marginTop:'10px',background:'darkblue',paddingLeft:'20px',width:'230px',marginBottom:'20px'}}>Add Data Subscription+</button></Link>

      <div className="card mb-4" style={{paddingBottom:'60px',minWidth:'95vb'}}>
        <div style={{backgroundColor:'white'}} className="card-header">• • •

        </div>
        <div className="card-body p-0">
          <div  className="table-responsive table-billing-history">
            <table style={{backgroundColor:'white'}}  className="table mb-0">
              <thead>
                <tr >
                  <th style={{paddingLeft:'10px'}} className="border-gray-200" scope="col">Serial No</th>
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
                    <Link style={{textDecoration:'none'}} to={`/map/${subscription.basemountpoint}?subid=${subscription._id}`}><button style={{padding:'10px 20px ',borderRadius:'25px',color:'darkblue',marginTop:'10px',background:'rgba(26, 35, 126, 0.2)',marginLeft:'10px'}}>Map</button></Link>
                    <Link style={{textDecoration:'none'}} to={`/logdata/${subscription._id}`}><button style={{padding:'10px 15px ',borderRadius:'25px',color:'darkblue',marginTop:'10px',background:'rgba(26, 35, 126, 0.2)',marginLeft:'10px'}}>Log status</button></Link>
                    <Link style={{textDecoration:'none'}} to={'/datasubcription'}><button style={{padding:'10px 15px ',borderRadius:'25px',color:'darkblue',marginTop:'10px',background:'rgba(26, 35, 126, 0.2)',marginLeft:'10px'}}>Statistics</button></Link>
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