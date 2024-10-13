import { useState, FormEvent } from 'react';
import { ethers } from 'ethers';
import "../app/globals.css";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface SendTokensProps {
    address: string;
}

const SendTokens: React.FC<SendTokensProps> = ({ address }) => {
    const [recipient, setRecipient] = useState<string>(''); 
    const [amount, setAmount] = useState<string>('');
    const tokenAddress = '0x7f2bD97D3875CC1028e095b20D251f46EBaf9762'; 

    const sendTokens = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const tokenABI = ["function transfer(address to, uint256 value) returns (bool)"];
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, tokenABI, signer);

        try {
            const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18)); 
            await tx.wait();
            toast.success("Tokens sent successfully");
        } catch (error) {
            console.error('Transaction failed', error);
            toast.error("Transaction failed. Check console for details.");
        }
    };

    return (
        <form 
            onSubmit={sendTokens} 
            className="bg-gray-800 shadow-lg rounded-lg p-8 space-y-6 mt-10 max-w-3xl mx-auto"
        >
            <h2 className="text-3xl font-bold text-center text-white mb-4">Send Tokens</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    className="bg-gray-700 border border-gray-600 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    className="bg-gray-700 border border-gray-600 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-800 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out"
            >
                Send Tokens
            </button>
            <ToastContainer />
        </form>
    );
};

export default SendTokens;
