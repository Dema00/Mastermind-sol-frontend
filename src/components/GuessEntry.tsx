import React, { useLayoutEffect, useState } from 'react';
import {ethers} from 'ethers';

interface GuessEntry{
    curr_guess: number,
    guess: string,
    guess_len: number,
    feedback: string,
}

const GuessEntry: React.FC<GuessEntry> = ({guess,guess_len, feedback, curr_guess}) => {
  // State for the array of numbers
  const [numberArray, setNumberArray] = useState<number[]>([]);
  // State for the two individual numbers
  const [CC, setCC] = useState<number | null>(null);
  const [NC, setNC] = useState<number | null>(null);
 
  // Handle button click
  const handleButtonClick = () => {
    console.log('Array:', numberArray);
    console.log('Number 1:', CC);
    console.log('Number 2:', NC);
  };

  useLayoutEffect(() => {
    setNumberArray(bytesToNumberArray(guess,guess_len*2));
    const [_CC, _NC] = bytesToNumberArray(feedback, 2*2);
    if( !Number.isNaN(_CC) && !Number.isNaN(_NC)) {
        setCC(_CC);
        setNC(_NC);
    }
  }, []);

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
      <h2>Guess {curr_guess.toString()}</h2>
      <h3>Code</h3>
      <ul>
        {numberArray.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
    { CC && NC &&
    <>
      <h3>Feedback</h3>
      <div>
        <label>
          <span style={{ marginLeft: '10px' }}>CC: {CC}</span>
        </label>
      </div>
      <div>
        <label>
          <span style={{ marginLeft: '10px' }}>NC: {NC}</span>
        </label>
      </div>

      <button onClick={handleButtonClick}>Dispute</button>
    </>
    }
    </div>
    
  );
};

export default GuessEntry;
