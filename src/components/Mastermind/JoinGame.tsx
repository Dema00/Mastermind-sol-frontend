// src/components/JoinGameComponent.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import useContract from '../../hooks/useContract';

const MASTERMINDS_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const JoinGame: React.FC = () => {
  const { contract } = useContract(MASTERMINDS_CONTRACT_ADDRESS);
  const [gameId, setGameId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleJoinGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
      try {
        if (!ethers.isHexString(gameId, 32)) {
            throw new Error('Invalid bytes32 value');
          }
        const tx = await contract.joinGame(gameId);
        await tx.wait();
        setSuccess(`Successfully joined game with ID: ${gameId}`);
        setError(null);
      } catch (error: any) {
        setError('Error joining game: ' + error.message);
        setSuccess(null);
      }
    }
  };

  return (
    <div>
      <h2>Join a Game</h2>
      <form onSubmit={handleJoinGame}>
        <div>
          <label>Game ID:</label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Join Game</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default JoinGame;
