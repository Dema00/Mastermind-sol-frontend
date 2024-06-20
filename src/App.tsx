import React, {useState} from 'react';
import { ethers } from 'ethers';
import Mastermind from './abi/Mastermind.json';

import ConnectButton from './components/connectButton';
import CreateGame from './components/Mastermind/CreateGame';
import JoinGame from './components/Mastermind/JoinGame';
import ProposeStake from './components/Mastermind/proposeStake';


const App: React.FC = () => {
  return (
    <div>
      <h1>MetaMask Wallet Integration</h1>
      <ConnectButton />
      <CreateGame />
      <JoinGame />
      <ProposeStake />
    </div>
  );
};

export default App;
