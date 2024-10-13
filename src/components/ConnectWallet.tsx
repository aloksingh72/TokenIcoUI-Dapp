
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Interface for the props passed to the component
//realted to typescript
interface ConnectWalletProps {
    setAddress: (address: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ setAddress }) => {
    // useState to store balance, connection status, and loading status
    const [balance, setBalance] = useState<string>(''); 
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // here we are defining the Holsky network configuration for connecting
    const holskyChainId = `0x${Number(17000).toString(16)}`; // Convert Holsky network ID to hexadecimal format
    const holskyNetwork = {
        chainId: holskyChainId,
        chainName: 'Holsky', // Name of the Holsky network
        nativeCurrency: {
            name: 'holsky', // Name of the native currency
            symbol: 'ETH', // Symbol of the native currency
            decimals: 18, // Decimal places for the currency
        },
        rpcUrls: ["https://rpc.ankr.com/eth_holesky"], // RPC URL for connecting to Holsky network
        blockExplorerUrls: ["https://holesky.etherscan.io/"], // Explorer URL for viewing transactions on Holsky
    };

    // Function to switch or add the Holsky network to the user's wallet (MetaMask)
    const switchToHolskyNetwork = async () => {
        try {
            if ((window as any).ethereum) { // Check if MetaMask Wallet is available
                const provider = new ethers.BrowserProvider((window as any).ethereum); // Create provider using MetaMask
                const currentNetwork = await provider.send('eth_chainId', []); // Get the current network chain ID

                // If the user is not on the Holsky network, attempt to switch or add it
                if (currentNetwork !== holskyChainId) {
                    try {
                        // Switch to Holsky network if available
                        await (window as any).ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: holskyChainId }],
                        });
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            // If the network is not added to MetaMask, add it
                            await (window as any).ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [holskyNetwork],
                            });
                        } else {
                            throw switchError; // Rethrow error if it's not a network-related issue
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to switch or add Holsky network:', error); 
            // give details of  any error related to network switching
        }
    };

    // Function to connect the user's wallet and fetch account details
    const connectWallet = async () => {
        setLoading(true); // Set loading state to true while connecting
        try {
            if ((window as any).ethereum) { // Check if MetaMask  is available
                const provider = new ethers.BrowserProvider((window as any).ethereum); // Create provider using MetaMask
                // const accounts = await provider.send('eth_requestAccounts', []); // Request wallet connection and accounts
                const signer = await provider.getSigner(); // Get the signer (authorized user)
                // signer is basically a authorized user
                const walletAddress = await signer.getAddress(); // Get the user's wallet address
                setAddress(walletAddress); // Set the wallet address in the parent component

                const walletBalance = await provider.getBalance(walletAddress); // Fetch the wallet balance
                setBalance(ethers.formatEther(walletBalance)); // Format and set the balance in ETH

                await switchToHolskyNetwork(); // Switch to the Holsky network

                // Simulate delay for better UX and set connection status
                setTimeout(() => {
                    setIsConnected(true); // Set the connected status to true
                    setLoading(false); 
                }, 2000);
            } else {
                alert('MetaMask not detected!'); // Alert if MetaMask is not installed
                setLoading(false); 
            }
        } catch (error) {
            console.error(error); // give any details of  any errors during connection
            setLoading(false); // Stop loading in case of error
        }
    };

    // Function to disconnect the wallet by resetting state
    const disconnectWallet = () => {
        setLoading(true); // Start loading for a disconnect action
        setTimeout(() => {
            setAddress(''); // Clear the wallet address
            setBalance(''); // Clear the wallet balance
            setIsConnected(false); // Mark the wallet as disconnected
            setLoading(false); // Disable the loading state
        }, 2000);
    };

    // Auto-connect the wallet when the component is mounted
    // just jaise hi ui render hoga at that time connectWallet() call hoga trying to connect with metamsk wallet
    useEffect(() => {
        connectWallet(); // Attempt to connect the wallet on component mount
    }, [setAddress]);

    // JSX for rendering the component UI
    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-900 p-6 rounded-lg shadow-lg text-white w-full max-w-[1200px] mx-auto space-y-4 md:space-y-0">
            <h2 className="text-2xl font-semibold text-gray-300">
                ETH Balance: <span className="font-extrabold text-green-400">{balance} ETH</span> {/* Display the wallet balance */}
            </h2>

            {loading ? (
                <p className="loader text-gray-200">Loading...</p> // Show loading indicator while connecting/disconnecting
            ) : (
                !isConnected ? (
                    <button
                        onClick={connectWallet} // Call connect function when clicked
                        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <button
                        onClick={disconnectWallet} // Call disconnect function when clicked
                        className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-600 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 hover:scale-110 "
                    >
                        Disconnect Wallet
                    </button>
                )
            )}
        </div>
    );
};

export default ConnectWallet;
