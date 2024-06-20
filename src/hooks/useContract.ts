// src/hooks/useContract.ts
import { useEffect, useState } from 'react';
import { InterfaceAbi, JsonRpcSigner, ethers } from 'ethers';
import Mastermind from '../abi/Mastermind.json';

const useContract = (contractAddress: string) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner().then(
        (signer) => {
            setSigner(signer);
            const contract = new ethers.Contract(contractAddress, Mastermind.abi, signer);
            setContract(contract);
        }
      );
    }
  }, [contractAddress]);

  return { contract, provider, signer, };
};

export default useContract;