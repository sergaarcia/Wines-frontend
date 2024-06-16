import axios from 'axios';

const SOAP_ENDPOINT = 'http://tu-servidor.com/axis2/services/TuServicioSOAP';

export const sendSOAPRequest = async (soapAction, soapBody) => {
    const headers = {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': soapAction
    };

    const xmlEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://your-namespace">
            <soapenv:Header/>
            <soapenv:Body>
                ${soapBody}
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    try {
        const response = await axios.post(SOAP_ENDPOINT, xmlEnvelope, { headers });
        return response.data;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error;
    }
};

import React, { useState, useEffect } from 'react';
import { sendSOAPRequest } from './soapService';

const VinosComponent = () => {
    const [vinos, setVinos] = useState([]);

    useEffect(() => {
        const fetchVinos = async () => {
            const soapBody = `
                <ser:ObtenerVinos>
                    <!-- parámetros de la solicitud -->
                </ser:ObtenerVinos>
            `;
            try {
                const response = await sendSOAPRequest('ObtenerVinos', soapBody);
                // Procesar la respuesta XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, 'text/xml');
                const vinosList = xmlDoc.getElementsByTagName('tuTagDeVinos');
                setVinos(vinosList);
            } catch (error) {
                console.error('Error fetching vinos:', error);
            }
        };

        fetchVinos();
    }, []);

    return (
        <div>
            <h1>Vinos</h1>
            <ul>
                {Array.from(vinos).map((vino, index) => (
                    <li key={index}>{vino.textContent}</li>
                ))}
            </ul>
        </div>
    );
};

export default VinosComponent;
