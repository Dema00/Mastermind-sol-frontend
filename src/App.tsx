import React, {useState} from 'react';
import { ethers } from 'ethers';
import Mastermind from './abi/Mastermind.json';

import ConnectButton from './components/connectButton';
import MastermindComponent from './components/MastermindComponent';


const App: React.FC = () => {
  return (
    <div>
      <h1>MetaMask Wallet Integration</h1>
      <ConnectButton />
      <MastermindComponent />
    </div>
  );
};

export default App;
