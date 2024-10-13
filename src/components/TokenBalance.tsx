import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "../app/globals.css";

interface TokenBalanceProps {
    address: string; // Type for the address prop
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ address }) => {
    const [tokenBalance, setTokenBalance] = useState<string>('0'); //  it will Initialize balance to '0'
    const tokenAddress = '0x7f2bD97D3875CC1028e095b20D251f46EBaf9762'; 

    const fetchTokenBalance = async () => {
        // Check if MetaMask is installed
        if (!(window as any).ethereum) {
            alert('MetaMask is not installed. Please install it to use this feature.');
            return; // Exit the function if MetaMask is not detected
        }

        const tokenABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];

        const provider = new ethers.BrowserProvider((window as any).ethereum); 
        const contract = new ethers.Contract(tokenAddress, tokenABI, provider); 

        try {
            const balance = await contract.balanceOf(address);
            const decimals = await contract.decimals();
            setTokenBalance(ethers.formatUnits(balance, decimals));
        } catch (error) {
            console.error('Error fetching token balance:', error);
           
        }
    };

    useEffect(() => {
        fetchTokenBalance(); 
    }, [address]); 

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-6 max-w-[1200px] mx-auto">
        <p className="text-xl md:text-2xl text-white font-semibold text-center">
            Token Balance: 
            <span className="font-extrabold text-green-400"> {tokenBalance} MTK</span>
        </p>
    </div>
    );
};

export default TokenBalance;