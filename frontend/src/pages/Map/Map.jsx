import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from "react-use-websocket";
import * as tt from "@tomtom-international/web-sdk-maps";
import {
  Container,
  Col,
  Row,
  Button,
} from "reactstrap";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./Map.css";

const WS_URL = "ws://127.0.0.1:8080";
const MAX_ZOOM = 50;

const MapView = () => {
  const { basemountpoint, subid } = useParams();
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [receivedData, setReceivedData] = useState([]); // State to hold received data

  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage.data)}`);
      const { latitude, longitude } = lastJsonMessage.data;
      setLat(latitude);
      setLng(longitude);
      updateMap();
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    let map = tt.map({
      key: "lA2ONWjNjuFjGxJC4oAlV2IQJrgTpAXi",
      container: mapElement.current,
      center: [0, 0], // Default center, will be updated later
      zoom: 12,
      language: "en-GB",
    });

    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    setMap(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    const connectionStatusMessages = {
      [ReadyState.CONNECTING]: "Connecting to Caster...",
      [ReadyState.OPEN]: "OPEN",
      [ReadyState.CLOSING]: "Disconnecting...",
      [ReadyState.CLOSED]: "Disconnected",
    };

    setConnectionStatus(connectionStatusMessages[readyState]);
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage.data)}`);
      const { latitude, longitude, timestamp } = lastJsonMessage.data;

      // Store received data into an array of objects
      const newData = [...receivedData, { latitude, longitude, timestamp }];
      setReceivedData(newData);

      setLat(latitude);
      setLng(longitude);
      updateMap();
    }
  }, [lastJsonMessage]);

  const handleConnect = () => {
    sendJsonMessage({ action: "connectToCaster" });
    setConnectionStatus("Connected to Caster");
  };

  const handleStopStreaming = () => {
    sendJsonMessage({ action: "stopStreaming" });
    setConnectionStatus("Streaming of data stopped...");
  };

  const handleClose = async () => {
    console.log(receivedData);
    sendJsonMessage({ action: "closeConnection" });
    setConnectionStatus("Disconnected");
  console.log(receivedData);
    try {
      const responseUserDetails = await fetch('/api/users/all-details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any headers needed for authentication if required
        },
      });
  
      if (!responseUserDetails.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const userData = await responseUserDetails.json();
  console.log(userData);
  
      // const responseUpdateData = await fetch(`/api/users/update-base-station-data/${userData._id}/${subid}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add any headers needed for authentication if required
      //   },
      //   body: JSON.stringify({ receivedData }),
      // });
  
      // if (!responseUpdateData.ok) {
      //   throw new Error('Failed to update base station data');
      // }
  
      // const responseData = await responseUpdateData.json();
      // console.log(responseData.message);
    } catch (error) {
      console.error('Error handling close:', error.message);
    }
  };
  
  
  


  const handleSendRequest = async () => {
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
  
      const userData = await response.json();
      if (userData.subscriptions.length > 0) {
        const subscription = userData.subscriptions.find(sub => sub.basemountpoint === basemountpoint);
  
        if (subscription) {
          const SubscriptionDelay = subscription.delay;
          const Subscriptionusername = subscription.username;
          const Subscriptionpwd = userData.password;
  
          const data = {
            action: "sendRequest",
            username: Subscriptionusername,
            passsword: Subscriptionpwd,
            mountPoint: basemountpoint,
            delay: SubscriptionDelay
          };
          console.log("exiting handlesenreq");
          sendJsonMessage(data);
  
  
          
        
      }
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  
  const updateMap = () => {
    if (map && lat && lng) {
      map.setCenter([parseFloat(lng), parseFloat(lat)]);
      map.setZoom(MAX_ZOOM);
      addMarker();
    }
  };

  const addMarker = () => {
    if (map && lat && lng) {
      const targetCoordinates = [parseFloat(lng), parseFloat(lat)];

      const existingMarker = map.getLayer('roverMarker');

      if (existingMarker) {
        existingMarker.setLngLat(targetCoordinates);
      } else {
        const marker = new tt.Marker({
          color: '#FF0000'
        })
          .setLngLat(targetCoordinates)
          .addTo(map)
          .setPopup(new tt.Popup().setHTML("Real Time Rover Location"));

        marker._element.id = 'roverMarker';
      }
    }
  };



  return (
   
      <Container>
        <Row>
          <Col xs="6">
            <div ref={mapElement} className="mapDiv" />
          </Col>
          <Col xs="6" className="mapsideDiv" >
            <div className="coordinatesCard">
              <Button className="updateButton" onClick={handleConnect}>Connect to Caster</Button>
              <Button className="updateButton" onClick={handleSendRequest}>Send Request</Button>
              <Button className="updateButton" onClick={handleStopStreaming}>Stop streaming</Button>
              <Button className="updateButton" onClick={handleClose}>Close Connection</Button>
             
              
              <br />
              <br />
              <h4>Real Time Rover Data</h4>
              <h5>WebSocket Status: {connectionStatus}</h5>
              <ul className="list-group">
                <div className="jsonCoordinates">
                  {lat && <p>Latitude: {lat}</p>}
                  {lng && <p>Longitude: {lng}</p>}
                </div>
              </ul>

              <h4>Received Data Table</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {receivedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.latitude}</td>
                    <td>{data.longitude}</td>
                    <td>{data.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

           
          </Col>
        </Row>

        {/* Received data table
        <Row>
          <Col xs="12">
            
          </Col>
        </Row> */}
      </Container>
  
  );
};

export default MapView;
