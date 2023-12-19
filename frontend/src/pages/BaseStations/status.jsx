import React from 'react';
import Navbar from '../../elements/NavBar/Navbar';

const BaseStatus = () => {
  const sampleData = [
    {
      serialNo: 1,
      mountPoint: 'BaseStation1',
      lat: 40.7128,
      long: -74.0060,
      status: 'Active'
    },
    {
      serialNo: 2,
      mountPoint: 'BaseStation2',
      lat: 34.0522,
      long: -118.2437,
      status: 'Inactive'
    },
    // Add more sample data as needed
  ];

  return (
    <>
      <Navbar />
      <div style={{ margin: '130px' }}>
        <table style={{ backgroundColor: 'white', width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="table mb-0">
          <thead>
            <tr>
              <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }} className="border-gray-200" scope="col">Serial No</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }} className="border-gray-200" scope="col">Mount Point</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }} className="border-gray-200" scope="col">Latitude</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }} className="border-gray-200" scope="col">Longitude</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }} className="border-gray-200" scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((data, index) => (
              <tr key={index}>
                <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>{data.serialNo}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>{data.mountPoint}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>{data.lat}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>{data.long}</td>
                <td style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #ddd', 
                  textAlign: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      marginRight: '8px',
                      backgroundColor: data.status === 'Active' ? '#4CAF50' : '#aaa',
                    }}></div>
                    {data.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BaseStatus;
