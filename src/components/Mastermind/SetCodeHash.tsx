// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import useContract from '../../hooks/useContract';
import {ethers} from 'ethers';


const SetCodeHash: React.FC<delegateCall> = ({address, callback, args}:delegateCall) => {
    const { contract } = useContract(address);
  const gameId = args.get("game_id");
  const [code, setCode] = useState<string>('');
  const [salt, setSalt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSetCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
    }
  };

  return (
    <div>
      <h2>Set the code</h2>
      <form onSubmit={handleSetCode}>
        <div>
          <label>Set code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salt</label>
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Code</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default SetCodeHash;