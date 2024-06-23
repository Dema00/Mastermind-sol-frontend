// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

import ProposeStake from "./proposeStake";
import SetCodeHash from "./SetCodeHash";
import GuessEntry from '../GuessEntry';
import GuessCode from './GuessCode';
import GiveFeedback from './GiveFeedback';

type gameState = "stake" | "setcode" | "guess" | "feedback" | "reveal" | "dispute" | "opp_turn" | "game_over" | "game_completed";

interface guessStruct {
    turn: number,
    guess: string,
    feedback: string,
}

const GameManager: React.FC<delegateCall> = ({args, contract}:delegateCall) => {
    const [error, setError] = useState<string | null>(null);


    const [state, setState] = useState<gameState>("stake");
    const [gamePrize, setPrize] = useState<string | null>(null);
    const [turn_num, setTurnNum] = useState<number>(1);
    const [salt, setSalt] = useState<string | null>(null);
    const [code, setCode] = useState<number[]>([]);
    const [codestr, setCodeStr] = useState<string| null>(null);
    const [guess_array, setGuessArray] = useState<guessStruct[]>([]);
    const [currGuess, setCurrGuess] =  useState<number>(1);
    const [myScore, setMyScore] = useState<number>(0);
    const [oppScore, setOppScore] = useState<number>(0);
    const [winner, setWinner] = useState<string | null>(null);
    var setOnce: boolean = false;

    var c_fb_gg: boolean;

    const youAreBreaker = (t_n = turn_num) => {
        let turnNum = Number(t_n);
        if (isNaN(turnNum)) {
            console.error('turn_num is not a valid number:', t_n);
            return false; // Handle error case as appropriate
        }


        const players = (c_fb_gg) ? ["opponent", "creator"] : ["creator", "opponent"];
        const playerIndex: number = turnNum % 2;
        const currentRole = args.get("role");
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

        contract?.on('SecretSet', (_game_id: string, _turn_num: bigint) => {
            if (_game_id === args.get("game_id")) {
                setGuessArray([]);

                const t_num: number = Number(_turn_num);
                setTurnNum(t_num);
                if (youAreBreaker(t_num)) {
                    setCode([]);
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
                setGuessArray(guess_array);
                const t_num: number = Number(_turn_num);
                if (youAreBreaker(t_num)) {
                    setState("opp_turn");
                } else {
                    setState("feedback");
                }
                console.log("GuessSent");
            }
          });

        contract?.on('TurnOver', (_game_id: string, _turn_num: number, _code_sol: string) => {
            if (_game_id === args.get("game_id")) {
                setCode(bytesToNumberArray(_code_sol,Number(args.get("code_len"))*2));
                const t_num: number = Number(_turn_num);
                
                if (youAreBreaker(t_num)) {
                    setOppScore(oppScore + (guess_array.length-2));
                    if(guess_array[t_num].feedback != "0x0400") {
                        setOppScore(oppScore + 1);
                    }
                    if(guess_array.length == 10 && guess_array[10].feedback != "0x0400") {
                        setOppScore(oppScore + parseInt(args.get("bonus")!));
                    }
                    setState("dispute");
                } else {
                    setMyScore(myScore + (guess_array.length-2));
                    if(guess_array[t_num].feedback != "0x0400") {
                        setMyScore(oppScore + 1);
                    }
                    if(guess_array.length == 10 && guess_array[10].feedback != "0x0400") {
                        setMyScore(myScore + parseInt(args.get("bonus")!));
                    }
                    setState("opp_turn");
                }
            }
          });

        contract?.on('GameWinner', (_game_id: string, _winner: ethers.AddressLike) => {
            if (_game_id === args.get("game_id")) {
                setState("game_over");
                console.log("gamewinner",winner?.toString(), typeof winner);
                setWinner(_winner.toString());
            }
          });

          contract?.on('RewardClaimed', (_game_id: string, _winner: ethers.AddressLike) => {
            if (_game_id === args.get("game_id")) {
                setState("game_completed");
                console.log("rew claimed",winner, typeof winner);
                setWinner(_winner.toString());
            }
          });

        contract?.on('disputeWon', (_game_id: string, _winner: ethers.AddressLike) => {
            if (_game_id === args.get("game_id")) {
                setState("game_completed");
                console.log("disp won",winner, typeof winner);
                setWinner(_winner.toString());
            }
          });


        contract?.on('FeedbackSent', (_game_id: string, _turn_num: number, _feedback: string) => {
            if (_game_id === args.get("game_id")) {
                guess_array[Number(guess_array.length-1)].feedback = _feedback.toString();
                setGuessArray(guess_array);
                const t_num: number = Number(_turn_num);
                if (youAreBreaker(t_num)) {
                    setState("guess");
                } else {
                    setState("opp_turn");
                }
                console.log("FeedbackSent");
                const fdbk = bytesToNumberArray(_feedback,2*2);
                if(currGuess == 10 || fdbk[0] == parseInt(args.get("code_len")!)) {
                    setState("reveal");
                }
            }
          });

        setOnce = true;
    }, []);

    const stakeCallback = (stake: number) => {
        setPrize(stake.toString());
    };

    const setCodeCallback = (salt: string, code: string) => {
        setSalt(salt);
        setCode(bytesToNumberArray(code,Number(args.get("code_len"))*2));
        setCodeStr(code);
    };

    const guessCallback = (guess: string) => {
        
    };


    const giveFeedbackCallback = (feedback: string) => {

    };

    const revealCodeCallback = async () => {
        try{
            const tx = await contract.revealCode(args.get("game_id"), codestr, salt);
            await tx.wait();
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    const claimRewardCallback = async () => {
        try {
            const tx = await contract.claimReward(args.get("game_id"));
            await tx.wait();
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    const setNextSecret = () => {

        if (youAreBreaker()) {
            setState("setcode");
        } else {
            setState("opp_turn");
        }

        const next_turn: number = turn_num + 1;
        console.log("next turn", next_turn);
        setTurnNum(next_turn);
    };

    const disputeCallback = async (guess: string) => {
        try{
            const tx = await contract.dispute(args.get("game_id")!, guess);
            const receipt = await tx.wait();
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    const accuseAFKCallback = async () => {
        try{
        const tx = await contract.accuseAFK(args.get("game_id")!);
        const receipt = await tx.wait();
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    return(
        <>
        <div className='myDivInput'>
            {
                gamePrize && <>
                <div className="card text-white bg-info mb-3" >
                    <div className='card-body'>
                        <h3 className='title'>Match Status</h3>
                        <h5>Game Prize</h5>
                        <h6>{gamePrize} GWEI</h6>
                        <h5>You: {myScore} Opp: {oppScore}</h5>
                        <h5>Turn {turn_num}</h5>
                    </div>
                </div>
                { code!.length != 0 && code &&
                    <>
                    <div className='card text-white bg-warning mb-3'>
                        <div className='card-body'>
                            <h3>Turn Code</h3>
                            <h3>
                                {code.map((number,index) => (
                                    <a key={index}>{number} </a>
                                ))}
                            </h3>
                        </div>
                    </div>
                    </>
                }
                <ul>
                {guess_array.slice(1).map((entry, index) => (
                    <li style={{float: "left"}} key={index}>
                        <GuessEntry 
                        callback={disputeCallback}
                        is_brk={youAreBreaker()} 
                        curr_guess={entry.turn} 
                        guess={entry.guess} 
                        guess_len={Number(args.get("code_len"))} 
                        feedback={entry.feedback}/></li>
                ))}
                </ul>
                <div style={{clear: "both"}}></div>
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
            { state === "reveal" &&
            <> 
                {!youAreBreaker() &&
                <>
                    <div className="d-grid gap-2 myDivBtn">
                        <button className="btn btn-lg btn-primary" onClick={revealCodeCallback}>Reveal</button>
                    </div>
                </>
                }
                {youAreBreaker() &&
                <>
                    <h2>Waiting for reveal...</h2>
                </>
                }
            </>
            }
            { state === "opp_turn" &&
            <> 
                <h2>Opponent is playing...</h2>
                <h5>
                <button className="btn btn-outline-danger" onClick={accuseAFKCallback}>Accuse</button>
                <a> him of being AFK and wait until you can claim the </a>
                <button className="btn btn-outline-success" onClick={claimRewardCallback}>Reward</button>
                </h5>
            </>
            }
            { state === "game_over" &&
            <> 
                <h2>Winner {winner}</h2>
                { winner==args.get("address") &&
                    <>
                        <p>claim reward once claimable</p>
                        <button onClick={claimRewardCallback}>Claim Reward</button>
                    </>
                }
                { winner!=args.get("address") &&
                    <>
                        <p>dispute or wait for reward to be claimed</p>
                    </>
                }
                { winner === ethers.ZeroAddress &&
                <>
                    <p>TIE</p>
                    <button onClick={claimRewardCallback}>Claim Reward</button>
                </>
                }
            </>
            }
            { state === "game_completed" &&
            <> 
                <h2>Winner {winner}</h2>
                <p>The game is over</p>
            </>
            }
            { state === "dispute" &&
            <> 
                <h2>Dispute or set the next secret</h2>
                <div className="d-grid gap-2 myDivBtn">
                    <button className="btn btn-lg btn-primary" onClick={setNextSecret}>Set secret</button>
                </div>
            </>
            }
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        </>
    )
}

export default GameManager