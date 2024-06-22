// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";
import SetCodeHash from "./SetCodeHash";

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute" | "opp_turn";

const GameManager: React.FC<delegateCall> = ({args, contract}:delegateCall) => {
    const [state, setState] = useState<gameState>("stake");
    const [gamePrize, setPrize] = useState<string | null>(null);
    const [c_fb_g, setCfb] = useState<boolean | null>(null);
    const [turn_num, setTurnNum] = useState<number>(1);
    const [salt, setSalt] = useState<string | null>(null);

    const youAreBreaker = () => {
        const players = 
        (c_fb_g) ? 
        ["opponent", "creator"] : ["creator","opponent"];
        return players[turn_num % 2] === args.get("role");
    }

    useLayoutEffect( () => {
        contract?.on('GameStart', (_game_id: string, c_fb: boolean) => {
            if (_game_id === args.get("game_id")) {
                setCfb(c_fb);
                if (
                    (args.get("role") === "creator" && c_fb === true) ||
                    (args.get("role") === "opponent" && c_fb === false)
                ) {
                    setState("opp_turn");
                } else {
                    setState("setcode");
                }
                contract?.off('GameStart');
            }
          });

        contract?.on('SecretSet', (_game_id: string, turn_num: number) => {
            if (_game_id === args.get("game_id")) {
                console.log("AYY");
                setTurnNum(turn_num);
                if (youAreBreaker()) {
                    setState("guess");
                } else {
                    setState("opp_turn");
                }
            }
          });
    });

    const stakeCallback = (stake: number) => {
        console.log(stake);
        setPrize(stake.toString());
    };

    const setCodeCallback = (salt: string) => {
        setSalt(salt);
        setState("feedback");
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
                <SetCodeHash contract={contract} callback={setCodeCallback} args={args}/>
                ${state}
            </>
            }
            { state === "guess" &&
            <> 
                <div>GUESS</div>
            </>
            }
            { state === "feedback" &&
            <> 
                <div>FEEDBACK {salt}</div>
            </>
            }
            { state === "opp_turn" &&
            <> 
                <h2>Opponent is playing...</h2>
                {/* u brk:{String(youAreBreaker())}
                ---cfb:{String(c_fb_g)}---
                {args.get("role")} */}
            </>
            }
        </div>
        </>
    )
}

export default GameManager