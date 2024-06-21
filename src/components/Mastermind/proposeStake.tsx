// src/components/ProposeStakeComponent.tsx
import React, { useLayoutEffect, useState } from 'react';
import { ethers } from 'ethers';
import useContract from '../../hooks/useContract';

const ProposeStake: React.FC<delegateCall> = ({address, callback, args}:delegateCall) => {
  const { contract } = useContract(address);
  const gameId = args.get("game_id");
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useLayoutEffect( () => {
    contract?.on('StakeSent', (_game_id: string, stake: number) => {
      if (gameId === args.get("game_id")) {
        setSuccess(`creator staked: ${stake}`);
        setError(null);
      }
    });

    contract?.on('StakeFailed', (_game_id: string, stake: number) => {
      if (gameId === args.get("game_id")) {
        setError(`Stake failed, opponent sent: ${stake}`);
        setSuccess(null);
      }
    });

    contract?.on('StakeSuccessful', (_game_id: string, stake: number) => {
      if (gameId === args.get("game_id")) {
        setSuccess(`Game prize pool: ${stake}`);
        setError(null);
      }
    });
  }

  );

  const handleProposeStake = async (event: React.FormEvent) => {
    event.preventDefault();
    if (contract) {
      try {
        // Ensure the input is a valid 32-byte hexadecimal string
        if (!ethers.isHexString(gameId, 32)) {
          throw new Error('Invalid bytes32 value for Game ID');
        }

        const stakeInWei = ethers.parseEther(stakeAmount);
        const tx = await contract.proposeStake(gameId, { value: stakeInWei });
        await tx.wait();
      } catch (error: any) {
        setError('Error proposing stake: ' + error.message);
        setSuccess(null);
      }
    }
  };

  return (
    <div>
      <h2>Propose a Stake</h2>
      <form onSubmit={handleProposeStake}>
        <div>
          <label>Stake Amount (ETH):</label>
          <input
            type="text"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Propose Stake</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default ProposeStake;
