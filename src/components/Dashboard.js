import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useServiceGroupId } from './ServiceGroupIdContext';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const { serviceGroupId, messageId } = useServiceGroupId();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMessage('');

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://sos.etsiinf.upm.es" xmlns:ax21="http://model.sos.etsiinf.upm.es/xsd" xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsa:Action>urn:logout</wsa:Action>
          <wsa:MessageID>${messageId}</wsa:MessageID>
          <axis2:ServiceGroupId xmlns:axis2="http://ws.apache.org/namespaces/axis2">${serviceGroupId}</axis2:ServiceGroupId>
        </soapenv:Header>
        <soapenv:Body>
          <ns:logout/>
        </soapenv:Body>
      </soapenv:Envelope>`;

    try {
      const response = await axios.request({
        method: 'post',
        url: 'http://localhost:8080/axis2/services/WineSocialUPM/logout',
        data: soapRequest,
        headers: {
          'Content-Type': 'application/soap+xml',
          'action': 'urn:logout',
          'charset': 'UTF-8',
          'User-Agent': 'Axis2',
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      const responseNode = xmlDoc.getElementsByTagName('ns1:response')[0];

      if (responseNode && responseNode.textContent === 'true') {
        navigate('/login');
      } else {
        setMessage('Logout failed: ' + (responseNode ? responseNode.textContent : 'Unknown error'));
      }
    } catch (err) {
      setMessage('Logout failed: ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/add-wine')}
        >
          Add Wine
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/add-follower')}
        >
          Add Follower
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/unfollow')}
        >
          Unfollow
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/add-user')}
        >
          Add User
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/remove-user')}
        >
          Remove User
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate('/remove-wine')}
        >
          Remove Wine
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default Dashboard;
