// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";
import SetCodeHash from "./SetCodeHash";
import GuessEntry from '../GuessEntry';
import GuessCode from './GuessCode';

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute" | "opp_turn";

const GameManager: React.FC<delegateCall> = ({args, contract}:delegateCall) => {
    const [state, setState] = useState<gameState>("stake");
    const [gamePrize, setPrize] = useState<string | null>(null);
    const [c_fb_g, setCfb] = useState<boolean | null>(null);
    const [turn_num, setTurnNum] = useState<number>(1);
    const [salt, setSalt] = useState<string | null>(null);
    const [code, setCode] = useState<number[] | null>(null);
    const [guesses, addGuess] = useState<[string,string][]>([]);
    const [currGuess, setCurrGuess] =  useState<number>(1);

    const youAreBreaker = () => {
        const players = 
        (c_fb_g) ? 
        ["opponent", "creator"] : ["creator","opponent"];
        return players[turn_num % 2] === args.get("role");
    }

    function bytesToNumberArray(bytes: string, len: number): number[] {
        // Remove the '0x' prefix
        const hexString = bytes.slice(2);
        // Convert the hex string to an array of numbers
        const numberArray: number[] = [];
        for (let i = 0; i < len; i += 2) {
          const byte = hexString.slice(i, i + 2);
          numberArray.push(parseInt(byte, 16));
        }
        return numberArray;
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
                setTurnNum(turn_num);
                if (youAreBreaker()) {
                    setState("guess");
                } else {
                    setState("opp_turn");
                }
            }
          });

        contract?.on('GuessSent', (_game_id: string, _turn_num: number, _guess_num: number, _guess: string) => {
            if (_game_id === args.get("game_id")) {
                setCurrGuess(_guess_num);
                console.log(_guess_num);
                guesses[_guess_num] =[_guess, "0x"];
                if (youAreBreaker()) {
                    setState("opp_turn");
                } else {
                    setState("feedback");
                }
            }
          });
    }, []);

    const stakeCallback = (stake: number) => {
        console.log(stake);
        setPrize(stake.toString());
    };

    const setCodeCallback = (salt: string, code: string) => {
        setSalt(salt);
        setCode(bytesToNumberArray(code,Number(args.get("code_len"))*2));
    };

    const guessCallback = (guess: string) => {
        
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
                gamePrize && <>
                <h2>Game Prize ${gamePrize} </h2>
                { code &&
                    <>
                    Current Code
                    <ul>
                        {code.map((number,index) => (
                            <><li key={index}>{number}</li></>
                        ))}
                    </ul>
                    </>
                }
                <ul>
                {guesses.map((entry, index) => (
                    <><li key={index}><GuessEntry curr_guess={currGuess} guess={entry[0]} guess_len={Number(args.get("code_len"))} feedback={entry[1]}/></li></>
                ))}
                </ul>
                </>
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
                <GuessCode contract={contract} callback={guessCallback} args={args}/>
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