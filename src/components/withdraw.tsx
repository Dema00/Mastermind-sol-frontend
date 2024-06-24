// src/components/ConnectButton.tsx
import React from 'react';
import {ethers} from 'ethers';
import useContract from '../hooks/useContract';

const MASTERMINDS_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const WithdrawButton: React.FC = () => {
    const { contract, signer } = useContract(MASTERMINDS_CONTRACT_ADDRESS);

    const withdraw = async () => {
        const tx = await contract?.withdraw();
        await tx.wait();
    }

    return (
        <div className=" gap-2">
        <button className="btn btn-primary" type="submit" onClick={withdraw}>Withdraw</button>
        </div>
    );
};

export default WithdrawButton;