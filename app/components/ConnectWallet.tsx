"use client";
import { ConnectWallet as OnchainKitConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

export default function ConnectWallet() {
    const { address, isConnected } = useAccount();

    return (
        <div className="flex items-center gap-3">
            <Wallet>
                <OnchainKitConnectWallet
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                    <Avatar className="h-6 w-6" />
                    <Name className="text-white" />
                </OnchainKitConnectWallet>
                <WalletDropdown>
                    <Identity className="px-4 py-3 hover:bg-gray-50 rounded-lg">
                        <Avatar />
                        <Name />
                        <Address />
                    </Identity>
                    <WalletDropdownDisconnect className="hover:bg-red-50 text-red-600 font-medium" />
                </WalletDropdown>
            </Wallet>
        </div>
    );
}
