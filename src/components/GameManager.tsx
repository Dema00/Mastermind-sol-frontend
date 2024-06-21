// src/components/MastermindComponent.tsx
import React, { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';
import {ethers} from 'ethers';

import LobbyManager from './Mastermind/lobbyManager';

const MASTERMINDS_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const GameManager: React.FC = () => {
  const { contract } = useContract(MASTERMINDS_CONTRACT_ADDRESS);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const [joinGameId, setJoinGameId] = useState<string>('');
  const [opponent, setOpponent] = useState<string>('');
  const [codeLength, setCodeLength] = useState<number>(4);
  const [codeSymbolsAmt, setCodeSymbolsAmt] = useState<number>(6);
  const [bonus, setBonus] = useState<string>('10');

  const handleCreateGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
      try {
        const tx = await contract.createGame(
          opponent,
          codeLength,
          codeSymbolsAmt,
          bonus
        );
        //const receipt = await tx.wait();

        // Listen for the GameCreated event
        contract.on('GameCreated', (_game_id: string, _game_creator: string) => {
          console.log('GameCreated event:', _game_id, _game_creator);
          setGameId(_game_id);
        });

      } catch (error: any) {
        setError('Error creating game: ' + error.message);
      }
    }
  };

  const handleJoinGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
      try {
        if (!ethers.isHexString(joinGameId, 32)) {
            throw new Error('Invalid bytes32 value');
          }
        const tx = await contract.joinGame(joinGameId);
        await tx.wait();
        setGameId(joinGameId);
      } catch (error: any) {
        setError('Error joining game: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h2>Mastermind</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      { !gameId &&
      <>
        <h1>Create Game</h1>
        <form onSubmit={handleCreateGame}>
          <div>
            <label>Opponent Address:</label>
            <input 
              type="text" 
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Code Length:</label>
            <input 
              type="number" 
              value={codeLength}
              onChange={(e) => setCodeLength(Number(e.target.value))} 
              required 
            />
          </div>
          <div>
            <label>Code Symbols Amount:</label>
            <input 
              type="number" 
              value={codeSymbolsAmt}
              onChange={(e) => setCodeSymbolsAmt(Number(e.target.value))} 
              required 
            />
          </div>
          <div>
            <label>Bonus:</label>
            <input 
              type="text" 
              value={bonus}
              onChange={(e) => setBonus(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Create Game</button>
        </form>
        <h1>Join Game</h1>
          <form onSubmit={handleJoinGame}>
          <div>
            <label>Game ID:</label>
            <input
              type="text"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Join Game</button>
          </form>
      </>
      }
      {gameId && 
      <>
        <p>In game with ID: {gameId}</p>
        <LobbyManager address={MASTERMINDS_CONTRACT_ADDRESS} callback={()=>{}}/>
      </>
      }
    </div>
  );
};

export default GameManager;
