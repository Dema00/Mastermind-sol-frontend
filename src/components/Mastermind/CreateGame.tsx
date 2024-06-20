// src/components/MastermindComponent.tsx
import React, { useEffect, useState } from 'react';
import useContract from '../../hooks/useContract';
import {ethers} from 'ethers';

const MASTERMINDS_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const CreateGame: React.FC = () => {
  const { contract } = useContract(MASTERMINDS_CONTRACT_ADDRESS);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

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
        const receipt = await tx.wait();
        console.log('Transaction successful:', receipt);

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

  return (
    <div>
      <h2>Mastermind Contract Interaction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      {gameId && <p>Created Game ID: {gameId}</p>}
    </div>
  );
};

export default CreateGame;
