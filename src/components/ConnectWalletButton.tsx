"use client"
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export function ConnectWalletButton() {
    const { isRegistering, error } = useWalletConnection();

    return (
        <div className="relative">
            <RainbowConnectButton />

            {isRegistering && (
                <div className="absolute top-full mt-1 right-0 text-xs text-gray-400">
                    Registering wallet...
                </div>
            )}

            {error && (
                <div className="absolute top-full mt-1 right-0 text-xs text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
} 