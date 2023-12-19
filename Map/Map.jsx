import React, { useEffect, useState, useRef } from "react";
import { mean, sqrt, std } from 'mathjs'; 
import Plot from 'react-plotly.js';
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
  const [GPST, setGPST] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [height, setHeight] = useState(null);
  const [Q,setQ]=useState(null);
  const [ns,setNs]=useState(null);
  const [sdn,setSdn]=useState(null);
  const [sde,setSde]=useState(null);
  const [sdu,setSdu]=useState(null);
  const [sdne,setSdne]=useState(null);
  const [sdeu,setSdeu]=useState(null);
  const [sdun,setSdun]=useState(null);
  const [age,setAge]=useState(null);
  const [ratio,setRatio]=useState(null);
  const[timestamp,setTimestamp]=useState(null);
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
      const { latitude, longitude, } = lastJsonMessage.data;
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
      zoom: 100,
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
      const { GPST,latitude, longitude, height,Q,ns,sdn,sde,sdu,sdne,sdeu,sdun,age,ratio,timestamp } = lastJsonMessage.data;

      // Store received data into an array of objects
      const newData = [...receivedData, { latitude, longitude, height ,q:Q,ns,sdn,sde,sdu,sdne,sdeu,sdun,age,ratio,timestamp,mountpoint:GPST}];
      console.log(newData);
      
      setReceivedData(newData);
      setGPST(GPST);
      setLat(latitude);
      setLng(longitude);
      setHeight(height);
      setQ(Q);
      setNs(ns);
      setSdn(sdn);
      setSde(sde);
      setSdu(sdu);
      setSdne(sdne);
      setSdeu(sdeu);
      setSdun(sdun);
      setAge(age);
      setRatio(ratio);
      setTimestamp(timestamp);
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
    console.log("receivedData");
    sendJsonMessage({ action: "closeConnection" });
    setConnectionStatus("Disconnected");
  
    try {
      // Get the user details, including subscriptions
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
  
      // Find the specific subscription you want to update (you might need to adjust this logic)
      const subscription = userData.subscriptions.find(sub => sub.basemountpoint === basemountpoint);
  
      if (subscription) {
        // Make a PUT request to update the baseStationData for the subscription
        const responseUpdateData = await fetch(`/api/users/update-base-station-data/${userData._id}/${subscription._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add any headers needed for authentication if required
          },
          body: JSON.stringify({ receivedData }),
        });
  
        if (!responseUpdateData.ok) {
          throw new Error('Failed to update base station data');
        }
  
        const responseData = await responseUpdateData.json();
        console.log(responseData.message);
      }
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
          const Subscriptionpwd = subscription.passsword;
  
          const data = {
            action: "sendRequest",
            username: Subscriptionusername,
            password: Subscriptionpwd,
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



  // error probabilty
  const [errorMetrics, setErrorMetrics] = useState({
    RMSE: 0,
    MAE: 0,
    SDE: 0,
  });

  const inputData = {
    GPST: 2105,
    latitude: 37.423568732,
    longitude: -122.094108474,
    height: -28.8393,
    Q: 2,
    ns: 0,
    sdn: 0.1716,
    sde: 0.2369,
    sdu: 0.409,
    sdne: -0.1343,
    sdeu: 0.1922,
    sdun: -0.1706,
    age: -9.56,
    ratio: 0.0,
  };
  //for plot
  const [uncorrectedData, setUncorrectedData] = useState(null);

  useEffect(() => {
    const dataValues = Object.values(inputData);
    const referenceValue = 10; // reference value

    const squaredDifferences = dataValues.map((value) =>
      Math.pow(value - referenceValue, 2)
    );

    const RMSE = sqrt(mean(squaredDifferences));
    const MAE = mean(squaredDifferences.map(val => Math.abs(val)));
    const SDE = std(squaredDifferences);

    setErrorMetrics({
      RMSE: RMSE.toFixed(4),
      MAE: MAE.toFixed(4),
      SDE: SDE.toFixed(4),
    });

    // uncorrected data
    const simulateUncorrectedValue = (value) => {
      // random deviation
      const deviation = (Math.random() - 0.5) * 0.09; // i adjusted from 0.01 to 0.06
      return value + deviation;
    };

    const simulatedUncorrectedData = {
      GPST: 2105,
      latitude: simulateUncorrectedValue(inputData.latitude),
      longitude: simulateUncorrectedValue(inputData.longitude),
      height: simulateUncorrectedValue(inputData.height),
      Q: simulateUncorrectedValue(inputData.Q),
      ns: simulateUncorrectedValue(inputData.ns),
      sdn: simulateUncorrectedValue(inputData.sdn),
      sde: simulateUncorrectedValue(inputData.sde),
      sdu: simulateUncorrectedValue(inputData.sdu),
      sdne: simulateUncorrectedValue(inputData.sdne),
      sdeu: simulateUncorrectedValue(inputData.sdeu),
      sdun: simulateUncorrectedValue(inputData.sdun),
      age: simulateUncorrectedValue(inputData.age),
      ratio: simulateUncorrectedValue(inputData.ratio),
    };
    setUncorrectedData(simulatedUncorrectedData);
  }, [inputData]);
  return (
   
      <Container className="mapviewcontainer">
        <Row>
          <Col xs="12">
            <div ref={mapElement} className="mapDiv" />
          </Col>
          <Col xs="12" className="mapsideDiv" >
            <div className="coordinatesCard">
              <button className="updateButton " onClick={handleConnect}>Connect to Caster</button>
              <button className="updateButton " onClick={handleSendRequest}>Send Request</button>
              <button className="updateButton " onClick={handleStopStreaming}>Stop streaming</button>
              <button className="updateButton " onClick={handleClose}>Close Connection</button>
             
              
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
        <Row>
        <div className="row" style={{display:'flex',flexDirection:'column'}}>
        <div className="column">
          <div className="panel">
            <h3>Error Metrics</h3>
            <p>RMSE: {errorMetrics.RMSE}</p>
            <p>MAE: {errorMetrics.MAE}</p>
            <p>SDE: {errorMetrics.SDE}</p>
          </div>
        </div>
        {/* Plotly graph */}
        <div >
        <Plot
       
  data={[
    {
      x: [inputData.latitude],
      y: [inputData.longitude],
      z: [inputData.height],
      mode: 'markers+text',
      type: 'scatter3d',
      marker: { size: 5, color: 'blue' },
      text: ['Corrected Data'],
      textposition: 'top center',
      textfont: { size: 12 },
      name: 'Corrected Data',
    },
    {
      x: [uncorrectedData?.latitude],
      y: [uncorrectedData?.longitude],
      z: [uncorrectedData?.height],
      mode: 'markers+text',
      type: 'scatter3d',
      marker: { size: 5, color: 'red' },
      text: ['Uncorrected Data'],
      textposition: 'top center',
      textfont: { size: 12 },
      name: 'Uncorrected Data',
    },
  ]}
  layout={{
    title: 'Positional Deviation',
    scene: {
      xaxis: { title: 'Latitude', range: [inputData.latitude - 0.5, inputData.latitude + 0.5] },
      yaxis: { title: 'Longitude', range: [inputData.longitude - 0.5, inputData.longitude + 0.5] },
      zaxis: { title: 'Height', range: [inputData.height - 0.5, inputData.height + 0.5] },
    },
  }}
/>


        </div>
      </div>
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
