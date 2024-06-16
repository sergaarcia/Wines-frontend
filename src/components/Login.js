import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useServiceGroupId } from './ServiceGroupIdContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setServiceGroupId } = useServiceGroupId();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://sos.etsiinf.upm.es" xmlns:ax21="http://model.sos.etsiinf.upm.es/xsd">
      <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
        <wsa:Action>urn:login</wsa:Action>
        <wsa:MessageID>1</wsa:MessageID>
        <wsa:ReplyTo>
          <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>
        </wsa:ReplyTo>
      </soapenv:Header>
      <soapenv:Body>
        <ns:login>
          <ns:args0>
            <ax21:name>${username}</ax21:name>
            <ax21:pwd>${password}</ax21:pwd>
          </ns:args0>
        </ns:login>
      </soapenv:Body>
    </soapenv:Envelope>`;
  
    try {
      const response = await axios.request({
        method: 'post',
        url: 'http://localhost:8080/axis2/services/WineSocialUPM/login',
        data: soapRequest,
        headers: {
          'Content-Type': 'application/soap+xml',
          'action': 'urn:login',
          'charset': 'UTF-8',
          'User-Agent': 'Axis2',
        },
      });

      console.log('Raw response:', response.data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      console.log('Parsed XML:', xmlDoc);

      const responseNode = xmlDoc.getElementsByTagName('ns1:response')[0];

      if (responseNode && responseNode.textContent === 'true') {
        parseServiceGroupId(response.data);
        navigate('/dashboard');
      } else {
        setError('Login failed: ' + (responseNode ? responseNode.textContent : 'Unknown error'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed: ' + err.message);
    }
  };

  const parseServiceGroupId = (xmlResponse) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');
    const serviceGroupIdNode = xmlDoc.getElementsByTagName('axis2:ServiceGroupId')[0];
    if (serviceGroupIdNode) {
      const serviceGroupIdValue = serviceGroupIdNode.textContent;
      setServiceGroupId(serviceGroupIdValue);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default Login;
