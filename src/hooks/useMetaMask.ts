// src/hooks/useMetaMask.ts
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        if (err.code === -32002) {
          setError('MetaMask is already processing a request. Please check your MetaMask extension.');
        } else {
          setError(err.message);
        }
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return { account, error, connect };
};

export default useMetaMask;
