import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useServiceGroupId } from './ServiceGroupIdContext';
import { useNavigate } from 'react-router-dom';

const AddFollower = () => {
  const [followerName, setFollowerName] = useState('');
  const [message, setMessage] = useState('');
  const { serviceGroupId, messageId, incrementMessageId } = useServiceGroupId();
  const navigate = useNavigate();

  const handleAddFollower = async (e) => {
    e.preventDefault();
    setMessage('');

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://sos.etsiinf.upm.es" xmlns:ax21="http://model.sos.etsiinf.upm.es/xsd" xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsa:Action>urn:addFollower</wsa:Action>
          <wsa:MessageID>${messageId}</wsa:MessageID>
          <axis2:ServiceGroupId xmlns:axis2="http://ws.apache.org/namespaces/axis2">${serviceGroupId}</axis2:ServiceGroupId>
        </soapenv:Header>
        <soapenv:Body>
          <ns:addFollower>
            <ns:args0>
              <ax21:username>${followerName}</ax21:username>
            </ns:args0>
          </ns:addFollower>
        </soapenv:Body>
      </soapenv:Envelope>`;

    try {
      const response = await axios.request({
        method: 'post',
        url: 'http://localhost:8080/axis2/services/WineSocialUPM/addFollower',
        data: soapRequest,
        headers: {
          'Content-Type': 'application/soap+xml',
          'action': 'urn:addFollower',
          'charset': 'UTF-8',
          'User-Agent': 'Axis2',
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      const responseNode = xmlDoc.getElementsByTagName('ns1:response')[0];

      if (responseNode && responseNode.textContent === 'true') {
        setMessage('Follower added successfully');
        incrementMessageId();
      } else {
        setMessage('Add Follower failed: ' + (responseNode ? responseNode.textContent : 'Unknown error'));
      }
    } catch (err) {
      setMessage('Add Follower failed: ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Add Follower</Typography>
        <form onSubmit={handleAddFollower}>
          <TextField
            label="Follower Name"
            value={followerName}
            onChange={(e) => setFollowerName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Follower
          </Button>
        </form>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate('/dashboard')}
        >
          Volver a la página principal
        </Button>
      </Box>
    </Container>
  );
};

export default AddFollower;
