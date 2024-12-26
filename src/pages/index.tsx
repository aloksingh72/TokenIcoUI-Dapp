import { useState } from 'react';
import "../app/globals.css";
import ConnectWallet from '../components/ConnectWallet';
import TokenBalance from '../components/TokenBalance';
import SendTokens from '../components/SendTokens';

const Home: React.FC = () => {
    const [address, setAddress] = useState<string>('');
// main method starts here
    return (
        <div className="min-h-screen  flex flex-col justify-center items-center text-white">
            <div className="bg-white text-gray-900 shadow-lg rounded-lg p-10 max-w-4xl w-full mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Token ICO App
                </h1>
                <ConnectWallet setAddress={setAddress} />
                {address && (
                    <div className="mt-10">
                        <TokenBalance address={address} />
                        <SendTokens address={address} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
