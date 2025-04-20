// Finally, let's create a component that allows users to update the stored number.
// This component allows users to input a new number and send a transaction to update the value stored in the contract. When the transaction is successful, users will see the stored value update in the ReadContract component after the transaction is confirmed.

'use client';

import { useState } from 'react';
import { getSignedContract } from '../utils/contract';
import { ethers } from 'ethers';

const WriteContract = ({ account }) => {
  const [newNumber, setNewNumber] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!newNumber || isNaN(Number(newNumber))) {
      setStatus({ type: 'error', message: 'Please enter a valid number' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: 'info', message: 'Initiating transaction...' });

      // Get a signer from the connected wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getSignedContract(signer);

      // Send transaction to blockchain and wait for user confirmation in wallet
      setStatus({
        type: 'info',
        message: 'Please confirm the transaction in your wallet...',
      });

      // Call the contract's setNumber function
      const tx = await contract.setNumber(newNumber);

      // Wait for transaction to be mined
      setStatus({
        type: 'info',
        message: 'Transaction submitted. Waiting for confirmation...',
      });
      const receipt = await tx.wait();

      setStatus({
        type: 'success',
        message: `Transaction confirmed! Transaction hash: ${receipt.hash}`,
      });
      setNewNumber('');
    } catch (err) {
      console.error('Error updating number:', err);

      // Error code 4001 is MetaMask's code for user rejection
      if (err.code === 4001) {
        setStatus({ type: 'error', message: 'Transaction rejected by user.' });
      } else {
        setStatus({
          type: 'error',
          message: `Error: ${err.message || 'Failed to send transaction'}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white text-gray-700 max-w-sm mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Place Bet on Price Up</h2>
      {/* Static info about the bet context */}
      <div className="text-sm text-gray-600 border-b border-gray-200 pb-2 mb-2">
        <p><strong>Shipment Route:</strong> Singapore to Rotterdam</p>
        <p><strong>Resolution Time:</strong> 2024-08-01 12:00 UTC</p>
      </div>
      {status.message && (
        <div
          className={`p-2 rounded-md break-words h-fit text-sm ${ 
            status.type === 'error'
              ? 'bg-red-100 text-red-700'
              : status.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Bet Amount (on Price Up)"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          disabled={isSubmitting || !account}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSubmitting || !account}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Bet...' : 'Bet Price Up'}
        </button>
      </form>
      {!account && (
        <p className="text-sm text-gray-500">
          Connect your wallet to place a bet.
        </p>
      )}
    </div>
  );
};

export default WriteContract;