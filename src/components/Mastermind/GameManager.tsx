// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";
import SetCodeHash from "./SetCodeHash";

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute";

const GameManager: React.FC<delegateCall> = ({args, contract}:delegateCall) => {
    const [state, setState] = useState<gameState>("stake");
    const [gamePrize, setPrize] = useState<string | null>(null);
    const [c_fb_g, setCfb] = useState<boolean | null>(null);

    useLayoutEffect( () => {
        contract?.on('GameStart', (_game_id: string, c_fb: boolean) => {
            setCfb(c_fb);
            if (_game_id === args.get("game_id")) {
                if (
                    (args.get("role") === "creator" && c_fb === true) ||
                    (args.get("role") === "opponent" && c_fb === false)
                ) {
                    setState("guess");
                } else {
                    setState("setcode");
                }
            }
          });
    });

    const stakeCallback = (stake: number) => {
        console.log(stake);
        setPrize(stake.toString());
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
            {
                gamePrize &&
                <h2>Game Prize ${gamePrize} </h2>
            }
            { state === "stake" &&
            <>
                <ProposeStake contract={contract} callback={stakeCallback} args={args}/>
                ${state}
            </>
            }
            { state === "setcode" &&
            <>
                <SetCodeHash contract={contract} callback={stakeCallback} args={args}/>
                ${state}
            </>
            }
            { state === "guess" &&
            <> 
                <div>GUESS</div>
            </>
            }
        </div>
        </>
    )
}

export default GameManager