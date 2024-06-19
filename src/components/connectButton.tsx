// src/components/ConnectButton.tsx
import React from 'react';
import useMetaMask from '../hooks/useMetaMask';

const ConnectButton: React.FC = () => {
  const { account, error, connect } = useMetaMask();

  return (
    <div>
      {!account ? (
        <button onClick={connect}>Connect to MetaMask</button>
      ) : (
        <span>Connected with {account}</span>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ConnectButton;