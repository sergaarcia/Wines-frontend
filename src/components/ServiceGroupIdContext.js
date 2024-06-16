import React, { createContext, useState, useContext } from 'react';

const ServiceGroupIdContext = createContext();

export const ServiceGroupIdProvider = ({ children }) => {
  const [serviceGroupId, setServiceGroupId] = useState('');
  const [messageId, setMessageId] = useState(1);

  const incrementMessageId = () => {
    setMessageId(prevMessageId => prevMessageId + 1);
  };

  return (
    <ServiceGroupIdContext.Provider value={{ serviceGroupId, setServiceGroupId, messageId, incrementMessageId }}>
      {children}
    </ServiceGroupIdContext.Provider>
  );
};

export const useServiceGroupId = () => useContext(ServiceGroupIdContext);
