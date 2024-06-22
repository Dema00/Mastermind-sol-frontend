// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ContractTransactionResponse, ethers} from 'ethers';

import CodeInputForm from '../codeInputForm'


const GuessCode: React.FC<delegateCall> = ({callback, args, contract}:delegateCall) => {
    const gameId = args.get("game_id");
    const [code, setCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSetCode = async (input: Uint8Array) => {
        const guess = "0x" + bytesToHex(input).padEnd(32,"00");
        if (!ethers.isHexString( guess, 16)) {
            throw new Error('Invalid bytes16 value');
        }

        try {
            const tx = await contract.guess(gameId, guess);
            const receipt = await tx.wait();    
        } catch (error: any) {
          setError('Error joining game: ' + error.message);
        }

        callback(guess);
    };

    function bytesToHex(bytes: Uint8Array) {
      let hex = [];
      for (let i = 0; i < bytes.length; i++) {
          let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
          hex.push((current >>> 4).toString(16));
          hex.push((current & 0xF).toString(16));
      }
      return hex.join("");
  }

    return (
      <div>
        <h2>Guess the code</h2>
        <>
          <CodeInputForm maxValue={parseInt(args.get("code_sym_amt")!) - 1} inputCount={parseInt(args.get("code_len")!)} callback={handleSetCode}/>
        </>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    );
}

export default GuessCode;