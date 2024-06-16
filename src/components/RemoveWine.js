import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useServiceGroupId } from './ServiceGroupIdContext';
import { useNavigate } from 'react-router-dom';

const RemoveWine = () => {
  const [wineName, setWineName] = useState('');
  const [wineGrape, setWineGrape] = useState('');
  const [wineYear, setWineYear] = useState('');
  const [message, setMessage] = useState('');
  const { serviceGroupId, messageId, incrementMessageId } = useServiceGroupId();
  const navigate = useNavigate();

  const handleRemoveWine = async (e) => {
    e.preventDefault();
    setMessage('');

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://sos.etsiinf.upm.es" xmlns:ax21="http://model.sos.etsiinf.upm.es/xsd" xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsa:Action>urn:removeWine</wsa:Action>
          <wsa:MessageID>${messageId}</wsa:MessageID>
          <axis2:ServiceGroupId xmlns:axis2="http://ws.apache.org/namespaces/axis2">${serviceGroupId}</axis2:ServiceGroupId>
        </soapenv:Header>
        <soapenv:Body>
          <ns:removeWine>
            <ns:args0>
              <ax21:grape>${wineGrape}</ax21:grape>
              <ax21:name>${wineName}</ax21:name>
              <ax21:year>${wineYear}</ax21:year>
            </ns:args0>
          </ns:removeWine>
        </soapenv:Body>
      </soapenv:Envelope>`;

    try {
      const response = await axios.request({
        method: 'post',
        url: 'http://localhost:8080/axis2/services/WineSocialUPM/removeWine',
        data: soapRequest,
        headers: {
          'Content-Type': 'application/soap+xml',
          'action': 'urn:removeWine',
          'charset': 'UTF-8',
          'User-Agent': 'Axis2',
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      const responseNode = xmlDoc.getElementsByTagName('ns1:response')[0];

      if (responseNode && responseNode.textContent === 'true') {
        setMessage('Wine removed successfully');
        incrementMessageId();
      } else {
        setMessage('Remove Wine failed: ' + (responseNode ? responseNode.textContent : 'Unknown error'));
      }
    } catch (err) {
      setMessage('Remove Wine failed: ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Remove Wine</Typography>
        <form onSubmit={handleRemoveWine}>
          <TextField
            label="Wine Name"
            value={wineName}
            onChange={(e) => setWineName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Wine Grape"
            value={wineGrape}
            onChange={(e) => setWineGrape(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Wine Year"
            value={wineYear}
            onChange={(e) => setWineYear(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Remove Wine
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

export default RemoveWine;
