// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import useContract from '../hooks/useContract';
import {ContractTransactionResponse, ethers} from 'ethers';

import GameManager from './Mastermind/GameManager';
import { assert } from 'console';
import { sign } from 'crypto';

const MASTERMINDS_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const GameCreator: React.FC = () => {
  const { contract, signer } = useContract(MASTERMINDS_CONTRACT_ADDRESS);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [role, setRole] = useState<string>('');
  const [selfAddr, setAddr] = useState<ethers.AddressLike>('');

  const [joinGameId, setJoinGameId] = useState<string>('');
  const [opponent, setOpponent] = useState<string>('');
  const [codeLength, setCodeLength] = useState<number>(4);
  const [codeSymbolsAmt, setCodeSymbolsAmt] = useState<number>(6);
  const [bonus, setBonus] = useState<string>('10');

  const [codeLen, setCodeLen] = useState<string | null>(null);
  const [codeSymAmt, setSymAmt] = useState<string | null>(null);

  useLayoutEffect(() => {
    let address: string;
    signer?.getAddress().then((addr) => {
      setAddr(addr);
      address = addr;
    })
    contract?.on('GameCreated', (_game_id: string, _game_creator: string) => {
      if (_game_creator === address && (role === "creator")) {
        setGameId(_game_id);
        contract?.off('GameCreated');
      }
    });

    contract?.on('PlayersReady', (_game_id: string, opp_address: ethers.AddressLike, _code_len: number, _code_symbols_amt: number, _bonus: number) => {
      if (_game_id === gameId || address === opp_address) {
        setCodeLen(_code_len.toString());
        setSymAmt(_code_symbols_amt.toString());
        setBonus(_bonus.toString());
        contract?.off('PlayersReady');
      }
    });
  })

  const handleCreateGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
      try {
        const tx: ContractTransactionResponse = await contract.createGame(
          opponent,
          codeLength,
          codeSymbolsAmt,
          bonus
        );
        const receipt = await tx.wait();

        setRole("creator");

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

        setRole("opponent");
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
      {gameId && codeLen && codeSymAmt &&
      <>
        <h3>You are the {role}</h3>
        <h4>In game with ID: {gameId}</h4>
        { codeLen && <h5>Code length: {codeLen} Colors amount: {codeSymAmt} Bonus: {bonus}</h5>}
        <GameManager contract={contract!} callback={()=>{}} args={new Map<string,string>([
          ["game_id", gameId], ["role", role], ["state", "stake"], ["code_len", codeLen], ["code_sym_amt", codeSymAmt], ["bonus", bonus],
          ["address", selfAddr.toString()]
          ])}/>
      </>
      }
      {gameId && !codeLen && !codeSymAmt &&
      <>
        <h4>Room ID: {gameId}</h4>
        <h4>Waiting for opponent...</h4>
      </>
      }
    </div>
  );
};

export default GameCreator;
