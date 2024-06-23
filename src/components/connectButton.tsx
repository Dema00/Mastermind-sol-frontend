// src/components/ConnectButton.tsx
import React from 'react';
import useMetaMask from '../hooks/useMetaMask';

const ConnectButton: React.FC = () => {
  const { account, error, connect } = useMetaMask();

  return (
    <div className='card border-primary mb-3 myDivInput' style={{marginLeft: "10%", marginRight: "10%", marginTop: "1em"}}>
        <div className='card-body'>
        <h3>Logged in as:</h3>
        <h3>{account}</h3>
        </div>
    </div>
  );
};

export default ConnectButton;