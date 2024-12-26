import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "../app/globals.css"; // Import global CSS

// Define the interface for props passed to the component
interface TokenBalanceProps {
    address: string; // Address prop passed to the component
}

// TokenBalance component to fetch and display a user's token balance
const TokenBalance: React.FC<TokenBalanceProps> = ({ address }) => {
    // State to store the token balance, initialized to '0'
    const [tokenBalance, setTokenBalance] = useState<string>('0'); 
    // ERC-20 token contract address (replace with actual contract address)
    const tokenAddress = '0x7f2bD97D3875CC1028e095b20D251f46EBaf9762'; 

    // Function to fetch the token balance from the blockchain
    const fetchTokenBalance = async () => {
        // Check if MetaMask is installed in the browser
        if (!(window as any).ethereum) {
            alert('MetaMask is not installed. Please install it to use this feature.');
            return; // Exit the function if MetaMask is not detected
        }

        // ABI for the token contract's `balanceOf` and `decimals` functions
        const tokenABI = [
            "function balanceOf(address owner) view returns (uint256)", // Fetches balance
            "function decimals() view returns (uint8)" // Fetches token decimals
        ];

        // Use ethers to connect to MetaMask provider
        const provider = new ethers.BrowserProvider((window as any).ethereum); 
        const contract = new ethers.Contract(tokenAddress, tokenABI, provider); // Create contract instance

        try {
            // Fetch the user's token balance and decimals from the contract
            const balance = await contract.balanceOf(address); // Call the balanceOf function for the given address
            const decimals = await contract.decimals(); // Call the decimals function to get token precision
            // Format the token balance using ethers.js based on the decimals
            setTokenBalance(ethers.formatUnits(balance, decimals)); 
        } catch (error) {
            console.error('Error fetching token balance:', error); 
        }
    };

    // useEffect hook is used to fetch token balance whenever the address prop changes
    useEffect(() => {
        fetchTokenBalance(); // Call fetchTokenBalance when the component mounts or address changes
    }, [address]); // Add address as a dependency

    
    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-6 max-w-[1200px] mx-auto">
            {/* Display the token balance */}
            <p className="text-xl md:text-2xl text-white font-semibold text-center">
                Token Balance: 
              
                <span className="font-extrabold text-green-400"> {tokenBalance} MTK</span>
            </p>
        </div>
    );
};

export default TokenBalance;
