'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
    getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiConfig } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import 'dotenv/config'

import {
    sepolia
} from 'wagmi/chains';
import { agentChain } from '@/lib/customChain';
// import { ProtectedRouteWrapper } from "@/components/ProtectedRouteWrapper"

// const projectId = process.env.WALLET_CONNECT_PROJECT_ID || '';
const projectId = '9811958bd307518b364ff7178034c435';

const config = getDefaultConfig({
    appName: 'Core Realm',
    projectId: projectId,
    chains: [agentChain, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const { wallets } = getDefaultWallets({
    appName: 'RainbowKit demo',
    projectId,
});

const demoAppInfo = {
    appName: 'My Wallet Demo',
};

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider appInfo={demoAppInfo}>
                    {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
}
