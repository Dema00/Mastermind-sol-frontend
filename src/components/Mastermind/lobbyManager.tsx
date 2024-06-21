// src/components/MastermindComponent.tsx
import React, { useEffect, useState } from 'react';
import useContract from '../../hooks/useContract';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute";

const LobbyManager: React.FC<delegateCall> = ({address,args}:delegateCall) => {

    const [inputField, setInputField] = useState<string>('');
    const [state, setState] = useState<gameState>("stake");


    const stakeCallback = () => {

    };

    const setCodeCallback = () => {

    };

    const guessCallback = () => {

    };


    const giveFeedbackCallback = () => {

    };

    const revealCodeCallback = () => {

    };

    const claimRewardCallback = () => {
        
    };

    const disputeCallback = () => {
        
    };

    const accuseAFKCallback = () => {
        
    };

    return(
        <>
        <div>
            <ProposeStake address={address} callback={()=>{}} args={args}/>
        </div>
        </>
    )
}

export default LobbyManager