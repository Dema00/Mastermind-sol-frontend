// src/components/MastermindComponent.tsx
import React, { useEffect, useState } from 'react';
import useContract from '../../hooks/useContract';
import {ethers} from 'ethers';


const SetCodeHash: React.FC<delegateCall> = ({address}:delegateCall) => {
    const { contract } = useContract(address);
    const [gameId, setGameId] = useState<string>('');
    const [stakeAmount, setStakeAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <div>
        </div>
    );
}

export default SetCodeHash;