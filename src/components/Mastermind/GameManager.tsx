// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";
import SetCodeHash from "./SetCodeHash";
import GuessEntry from '../GuessEntry';
import GuessCode from './GuessCode';
import GiveFeedback from './GiveFeedback';

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute" | "opp_turn";

interface guessStruct {
    turn: number,
    guess: string,
    feedback: string,
}

const GameManager: React.FC<delegateCall> = ({args, contract}:delegateCall) => {
    const [state, setState] = useState<gameState>("stake");
    const [gamePrize, setPrize] = useState<string | null>(null);
    const [turn_num, setTurnNum] = useState<number>(1);
    const [salt, setSalt] = useState<string | null>(null);
    const [code, setCode] = useState<number[] | null>(null);
    const [guess_array, setGuessArray] = useState<guessStruct[]>([]);
    const [currGuess, setCurrGuess] =  useState<number>(1);
    var setOnce: boolean = false;

    var c_fb_gg: boolean;

    const youAreBreaker = () => {
        let turnNum = Number(turn_num);
        if (isNaN(turnNum)) {
            console.error('turn_num is not a valid number:', turn_num);
            return false; // Handle error case as appropriate
        }


        const players = (c_fb_gg) ? ["opponent", "creator"] : ["creator", "opponent"];
        const playerIndex: number = turnNum % 2;
        const currentRole = args.get("role");

        /* console.log("-------------------------------------------");
        console.log('c_fb:', c_fb_gg, 'type:', typeof c_fb_gg);
        console.log('turn_num:', turn_num, 'type:', typeof turn_num);
        console.log('currentRole:', currentRole, 'type:', typeof currentRole);
        console.log('currentStatus:', players[playerIndex], 'type:', typeof players[playerIndex]);
        console.log('return', players[playerIndex] == currentRole, 'type:', typeof (players[playerIndex] == currentRole)); */

        return (players[playerIndex] == currentRole);
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
        if (setOnce) {
            return;
        }
        contract?.once('GameStart', (_game_id: string, c_fb: boolean) => {
            if (_game_id === args.get("game_id")) {
                c_fb_gg = c_fb;
                if (
                    (args.get("role") === "creator" && c_fb === true) ||
                    (args.get("role") === "opponent" && c_fb === false)
                ) {
                    setState("opp_turn");
                } else {
                    setState("setcode");
                }
                //contract?.off('GameStart');
                console.log("GameStart");
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
                console.log("SecretSet");
            }
          });

        contract?.on('GuessSent', (_game_id: string, _turn_num: number, _guess_num: number, _guess: string) => {
            if (_game_id === args.get("game_id")) {
                setCurrGuess(_guess_num);
                guess_array[_guess_num] ={turn:_guess_num,guess:_guess, feedback:"0x"};
                if (youAreBreaker()) {
                    setState("opp_turn");
                } else {
                    setState("feedback");
                }
                console.log("GuessSent");
            }
          });

        contract?.on('FeedbackSent', (_game_id: string, _turn_num: number, _feedback: string) => {
            if (_game_id === args.get("game_id")) {
                console.log("currGuess",currGuess);
                console.log("currCode",guess_array[currGuess].guess);
                console.log("currFeeback",_feedback);
                guess_array[Number(guess_array.length-1)].feedback = _feedback.toString();
                console.log(guess_array);
                setGuessArray(guess_array);
                console.log("TADAA");
                if (youAreBreaker()) {
                    setState("guess");
                } else {
                    setState("opp_turn");
                }
                console.log("FeedbackSent");
                console.log(_feedback);
            }
          });

        setOnce = true;
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


    const giveFeedbackCallback = (feedback: string) => {

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
                            <li key={index}>{number}</li>
                        ))}
                    </ul>
                    </>
                }
                <ul>
                {guess_array.slice(1).map((entry, index) => (
                    <li key={index}>
                        <GuessEntry 
                        is_brk={youAreBreaker()} 
                        curr_guess={entry.turn} 
                        guess={entry.guess} 
                        guess_len={Number(args.get("code_len"))} 
                        feedback={entry.feedback}/></li>
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
                <GiveFeedback contract={contract} callback={giveFeedbackCallback} args={args}/>
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