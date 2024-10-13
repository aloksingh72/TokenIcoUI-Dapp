import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface ConnectWalletProps {
    setAddress: (address: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ setAddress }) => {
    const [balance, setBalance] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const holskyChainId = `0x${Number(17000).toString(16)}`;
    const holskyNetwork = {
        chainId: holskyChainId,
        chainName: 'Holsky',
        nativeCurrency: {
            name: 'holsky',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ["https://rpc.ankr.com/eth_holesky"],
        blockExplorerUrls: ["https://holesky.etherscan.io/"],
    };

    const switchToHolskyNetwork = async () => {
        try {
            if ((window as any).ethereum) {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const currentNetwork = await provider.send('eth_chainId', []);
                if (currentNetwork !== holskyChainId) {
                    try {
                        await (window as any).ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: holskyChainId }],
                        });
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            await (window as any).ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [holskyNetwork],
                            });
                        } else {
                            throw switchError;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to switch or add Holsky network:', error);
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        try {
            if ((window as any).ethereum) {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                const signer = await provider.getSigner();
                const walletAddress = await signer.getAddress();
                setAddress(walletAddress);

                const walletBalance = await provider.getBalance(walletAddress);
                setBalance(ethers.formatEther(walletBalance));

                await switchToHolskyNetwork();

                setTimeout(() => {
                    setIsConnected(true);
                    setLoading(false);
                }, 2000);
            } else {
                alert('MetaMask not detected!');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const disconnectWallet = () => {
        setLoading(true);
        setTimeout(() => {
            setAddress('');
            setBalance('');
            setIsConnected(false);
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        connectWallet();
    }, [setAddress]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-900 p-6 rounded-lg shadow-lg text-white w-full max-w-[1200px] mx-auto space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-300">
            ETH Balance: <span className="font-bold text-white">{balance} ETH</span>
        </h2>

        {loading ? (
            <p className="loader text-gray-200">Loading...</p> // You can style your loader here
        ) : (
            !isConnected ? (
                <button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                >
                    Connect Wallet
                </button>
            ) : (
                <button
                    onClick={disconnectWallet}
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

/* HTML: <div class="loader"></div> */
/*
.loader {
    width: 50px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #25b09b;
    --_m: 
      conic-gradient(#0000 10%,#000),
      linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
            mask: var(--_m);
    -webkit-mask-composite: source-out;
            mask-composite: subtract;
    animation: l3 1s infinite linear;
  }
  @keyframes l3 {to{transform: rotate(1turn)}}
  */