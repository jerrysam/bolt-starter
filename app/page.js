// To integrate this component to your dApp, you need to overwrite the existing boilerplate in app/page.js with the following code
'use client';

import { useState } from 'react';

import WalletConnect from './components/WalletConnect';
import ReadContract from './components/ReadContract';
import WriteContract from './components/WriteContract';

export default function Home() {
  const [account, setAccount] = useState(null);

  const handleConnect = (connectedAccount) => {
    setAccount(connectedAccount);
  };

  return (
    <section className="min-h-screen bg-gray-100 text-gray-800 flex flex-col justify-center items-center gap-6 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Shipment Price Prediction Market (Demo)
      </h1>
      <WriteContract account={account} />
      <ReadContract />
      <WalletConnect onConnect={handleConnect} />
    </section>
  );
}
