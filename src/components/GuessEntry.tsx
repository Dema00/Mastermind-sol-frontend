import React, { useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

interface GuessEntry{
    curr_guess: number,
    guess: string,
    guess_len: number,
    feedback: string,
    is_brk: boolean,
    callback: Function,
}

const GuessEntry: React.FC<GuessEntry> = ({guess,guess_len, feedback, curr_guess, is_brk, callback}) => {
  // State for the array of numbers
  const [numberArray, setNumberArray] = useState<number[]>([]);
  // State for the two individual numbers
  const [CC, setCC] = useState<number | null>(null);
  const [NC, setNC] = useState<number | null>(null);
 
  // Handle button click
  const handleButtonClick = () => {
    callback(guess);
    console.log("DISPUTED")
  };

  useLayoutEffect(() => {
    setNumberArray(bytesToNumberArray(guess, guess_len * 2));
  }, [guess, guess_len]);

  useLayoutEffect(() => {
    const [_CC, _NC] = bytesToNumberArray(feedback, 2 * 2);
    setCC(_CC);
    setNC(_NC);
  }, [feedback]);

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

  return (
    <div>
      <div className='card-body'>
        <div className='myDivInput'>
          <h5>Guess {curr_guess.toString()}</h5>
        </div>
        <div style={{float: "left", marginRight: "2em"}}>
          <h5>Code </h5>
            {numberArray.map((num, index) => (
              <a key={index}>{num} </a>
            ))}
        </div>
        {
        <>
          <div style={{float: "left", marginRight: "2em"}}>
            <h5>Feedback</h5>
            <a>CC: {CC} NC: {NC}</a>
          </div>
        </>
        }
        { is_brk &&
        <>
            <button className="btn btn-primary" onClick={handleButtonClick}>Dispute</button>
        </>
        }
      </div>
    </div>
    
  );
};

export default GuessEntry;
