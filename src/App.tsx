import React, {useState} from 'react';
import { ethers } from 'ethers';
import Mastermind from './abi/Mastermind.json';

import ConnectButton from './components/connectButton';
import GameCreator from './components/GameCreator';

import 'bootstrap/dist/css/bootstrap.css';
import './bootstrap.min.css'
import './custom.css'


const App: React.FC = () => {
  return (
    <div>
      <h1>MetaMask Wallet Integration</h1>
      <ConnectButton />
      <GameCreator />
    </div>
  );
};

export default App;
