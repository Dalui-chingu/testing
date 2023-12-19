import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CSVLink } from 'react-csv';
import Sidebar from "../../components/sidebar/Sidebar";
import ExportButton from "../../elements/ExportButton/ExportButton";

export default function LogTable() {
  const { subid } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);

  const customStyles = {
    headCells: {
      style: {
          minWidth:"300px"
      },
  }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/users/all-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching user details');
        }

        const userData = await response.json();
        console.log('userData:', userData); // Log the userData to see the structure

        const subscription = userData.subscriptions.find((sub) => sub._id === subid);

        if (subscription) {
          console.log('Subscription found:', subscription); // Log the subscription to inspect baseStationdata
          setData(subscription.baseStationdata);
          setFilter(subscription.baseStationdata);
        } else {
          console.error(`Subscription with ID ${subid} not found.`);
          // Handle case when subscription is not found
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    fetchUserDetails();
  }, [subid, userInfo.token]);

  console.log('data:', data); // Log the data fetched to check its contents

  const columns = [
    // Define your columns as needed
    // For example:
    { name: 'Mount Point', selector: 'mountpoint', sortable: true },
    { name: 'latitude', selector: 'latitude', sortable: true },
    { name: 'longitude', selector: 'longitude', sortable: true },
    { name: 'Received time', selector: 'timestamp', sortable: true, style:{minWidth:"300px"}},
    { name: 'Height', selector: 'height', sortable: true },
    { name: 'sdn', selector: 'sdn', sortable: true },
    { name: 'sde', selector: 'sde', sortable: true },
    { name: 'sdu', selector: 'sdu', sortable: true },
    { name: 'sdne', selector: 'sdne', sortable: true },
    { name: 'sdeu', selector: 'sdeu', sortable: true },
    { name: 'sdun', selector: 'sdun', sortable: true },
    { name: 'Age', selector: 'age', sortable: true },
    { name: 'latitude', selector: 'latitude', sortable: true },
    // Include other columns similarly
  ];

  return (
    <div style={{display:'flex',width:'100%',marginBottom:'100px',marginTop:'30px'}}>
    <Sidebar/>
    <div className="container">
      <React.Fragment>
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Logging Table</span>
        </div>
        <div>
          {/* Button for exporting data to JSON */}
          <button
          style={{marginRight:'20px'}}
            onClick={() => {
              const jsonContent = JSON.stringify(data);
              const blob = new Blob([jsonContent], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'logData.json');
              document.body.appendChild(link);
              link.click();
            }}
          >
            <ExportButton lable={"Export to JSON"}/>
          </button>
          

          {/* CSV Export button */}
          
          <CSVLink data={data}  filename={'logData.csv'}>
          <ExportButton lable={"Export to CSV"}/>
            </CSVLink>
        
        </div>

        <div className="table-container">
  <DataTable
  customStyles={customStyles}
    columns={columns}
    data={filter}
    pagination
    selectableRows
    fixedHeader
    selectableRowsHighlight
    highlightOnHover
  />
</div>

      </React.Fragment>
    </div>
    </div>
 
  );
}
