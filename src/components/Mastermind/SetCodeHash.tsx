// src/components/MastermindComponent.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ContractTransactionResponse, ethers} from 'ethers';

import CodeInputForm from '../codeInputForm'


const SetCodeHash: React.FC<delegateCall> = ({callback, args, contract}:delegateCall) => {
    const gameId = args.get("game_id");
    const [code, setCode] = useState<string | null>(null);
    const [salt, setSalt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSetCode = async (input: Uint8Array) => {
        const string_code = "0x" + bytesToHex(input).padEnd(32,"00");
        if (!ethers.isHexString( string_code, 16)) {
            throw new Error('Invalid bytes16 value');
        }

        setCode(string_code);
        const _salt = "0x" + generateRandom4ByteString();
        if (!ethers.isHexString(_salt, 4)) {
          throw new Error('Invalid bytes4 value');
        }
        setSalt(_salt); 

        const secret = ethers.solidityPackedKeccak256(["bytes16","bytes4"],[code,salt]);

        try {
          if (!ethers.isHexString(secret, 32)) {
              throw new Error('Invalid bytes32 value');
            }
            const tx = await contract.setCodeHash(gameId,secret);
            const receipt = await tx.wait();    
        } catch (error: any) {
          setError('Error joining game: ' + error.message);
        }

        callback(_salt);
    };

    function generateRandom4ByteString(): string {
        const randomBytes = new Uint8Array(4);
        window.crypto.getRandomValues(randomBytes);
        
        return Array.from(randomBytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

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
        <h2>Set the code</h2>
        <>
          <CodeInputForm maxValue={parseInt(args.get("code_sym_amt")!) - 1} inputCount={parseInt(args.get("code_len")!)} callback={handleSetCode}/>
        </>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    );
}

export default SetCodeHash;