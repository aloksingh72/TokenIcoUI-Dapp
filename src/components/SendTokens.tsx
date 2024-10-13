import { useState, FormEvent } from 'react';
import { ethers } from 'ethers';
import "../app/globals.css"; // Import global CSS
import { toast, ToastContainer } from 'react-toastify'; // Import Toast notifications for feedback
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

// Define the interface for the props passed to the component
// this is due to typescript
interface SendTokensProps {
    address: string; 
}

// The SendTokens component that allows sending tokens
const SendTokens: React.FC<SendTokensProps> = ({ }) => {
    // State to store recipient address and token amount
    const [recipient, setRecipient] = useState<string>(''); 
    const [amount, setAmount] = useState<string>('');

    // Token contract address on Ethereum (replace with actual contract address)
    const tokenAddress = '0x7f2bD97D3875CC1028e095b20D251f46EBaf9762'; 

    // Function to handle sending tokens on form submission
    const sendTokens = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        // ABI for the ERC-20 token's `transfer` function
        const tokenABI = ["function transfer(address to, uint256 value) returns (bool)"];
        const provider = new ethers.BrowserProvider((window as any).ethereum); // Use MetaMask's provider
        const signer = await provider.getSigner(); // Get the user's wallet signer (authorized account)
        const contract = new ethers.Contract(tokenAddress, tokenABI, signer); // Initialize the contract with signer

        try {
            // Parse the token amount and send tokens to the recipient address
            const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18)); // 18 decimals for ETH-based tokens
            await tx.wait(); // Wait for the transaction to be confirmed
            toast.success("Tokens sent successfully"); // Show success toast
        } catch (error) {
            console.error('Transaction failed', error); // Log any errors during the transaction
            toast.error("Transaction failed. Check console for details."); // Show error toast
        }
    };

    return (
        <form 
            onSubmit={sendTokens} // Form submit handler
            className="bg-gray-800 shadow-lg rounded-lg p-8 space-y-6 mt-10 max-w-3xl mx-auto" 
        >
         
            <h2 className="text-3xl font-bold text-center text-white mb-4">Send Tokens</h2>
            
            {/* Inputs for recipient address and amount */}
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    className="bg-gray-700 border border-gray-600 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Recipient Address" // Input for recipient's wallet address
                    value={recipient} // Bind input value to recipient state
                    onChange={(e) => setRecipient(e.target.value)} // Update recipient state on input change
                />
                <input
                    className="bg-gray-700 border border-gray-600 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Amount" // Input for token amount
                    value={amount} // Bind input value to amount state
                    onChange={(e) => setAmount(e.target.value)} // Update amount state on input change
                />
            </div>
            
           
            <button
                type="submit" 
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-800 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out"
            >
                Send Tokens
            </button>

            {/* Toaster */}
            <ToastContainer />
        </form>
    );
};

export default SendTokens;
