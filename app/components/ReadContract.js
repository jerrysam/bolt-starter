// Now, let's create a component to read data from the contract
// This component reads the storedNumber value from the contract and displays it to the user. It also sets up a polling interval to refresh the data periodically.


'use client';

import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/contract';

const ReadContract = () => {
  const [storedNumber, setStoredNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to read data from the blockchain
    const fetchData = async () => {
      try {
        setLoading(true);
        const contract = getContract();
        // Call the smart contract's storedNumber function
        const number = await contract.storedNumber();
        setStoredNumber(number.toString());
        setError(null);
      } catch (err) {
        console.error('Error fetching stored number:', err);
        setError('Failed to fetch data from the contract');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 10 seconds to keep UI in sync with blockchain
    const interval = setInterval(fetchData, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white text-gray-700 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">Current Betting Pool</h2>
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <div className="text-center">
          <p className="text-sm font-mono bg-blue-100 px-2 py-1 rounded-md text-blue-800">
            <strong>Total bets on price going up:</strong> {storedNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadContract;