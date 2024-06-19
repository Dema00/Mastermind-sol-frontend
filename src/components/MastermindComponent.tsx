// src/components/MastermindComponent.tsx
import React, { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';

const MASTERMINDS_CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

const MastermindComponent: React.FC = () => {
  const { contract } = useContract(MASTERMINDS_CONTRACT_ADDRESS);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        try {
          const result = await contract.someReadFunction(); // Replace with your contract's read function
          setData(result);
        } catch (error) {
          console.error('Error fetching data from contract:', error);
        }
      }
    };

    fetchData();
  }, [contract]);

  const handleWriteFunction = async () => {
    if (contract) {
      try {
        const tx = await contract.someWriteFunction(); // Replace with your contract's write function
        await tx.wait();
        console.log('Transaction successful');
      } catch (error) {
        console.error('Error sending transaction:', error);
      }
    }
  };

  return (
    <div>
      <h2>Mastermind Contract Interaction</h2>
      {data ? <p>Data from contract: {data.toString()}</p> : <p>Loading...</p>}
      <button onClick={handleWriteFunction}>Call Write Function</button>
    </div>
  );
};

export default MastermindComponent;
