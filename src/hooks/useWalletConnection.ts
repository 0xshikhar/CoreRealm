"use client"
import { useAccount } from 'wagmi';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_LAST_ADDRESS_KEY } from '@/lib/storage-utils';

export function useWalletConnection() {
    const { address, isConnected } = useAccount();
    const { login, isAuthenticated } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutoAuthenticating, setIsAutoAuthenticating] = useState(false);

    // Track the last address we processed
    const lastAddressRef = useRef<string | null>(null);
    // Track registration attempts to prevent infinite loops
    const attemptsRef = useRef(0);
    // Track if we've attempted auto-authentication
    const hasAttemptedAuthRef = useRef(false);

    // Register the user when they connect their wallet
    useEffect(() => {
        if (!isConnected || !address) {
            return;
        }

        // Skip if we've already processed this address
        if (address === lastAddressRef.current) {
            return;
        }

        // Limit registration attempts to prevent infinite loops
        if (attemptsRef.current >= 3) {
            console.log(`🔌 Wallet: Too many registration attempts for ${address}, giving up`);
            return;
        }

        // Update the last address we processed
        lastAddressRef.current = address;
        attemptsRef.current++;

        const registerUser = async () => {
            try {
                setIsRegistering(true);
                setError(null);

                console.log(`🔌 Wallet: Registering address ${address}`);

                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address })
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error(`🔌 Wallet: Registration failed with status ${response.status}`, data);
                    throw new Error(data.error || `Failed to register wallet (${response.status})`);
                }

                const data = await response.json();
                setIsRegistered(true);
                // Reset attempts on success
                attemptsRef.current = 0;
                console.log(`🔌 Wallet: Registration successful, user ${data.exists ? 'already exists' : 'created'}`);

                // Store the address in localStorage to track the last connected wallet
                localStorage.setItem(AUTH_LAST_ADDRESS_KEY, address);

                // After successful registration, attempt to authenticate if not already authenticated
                if (!isAuthenticated && !hasAttemptedAuthRef.current) {
                    await attemptAutoAuthentication();
                }
            } catch (err) {
                console.error('🔌 Wallet: Registration error', err);
                setError(err instanceof Error ? err.message : 'Failed to register wallet');
            } finally {
                setIsRegistering(false);
            }
        };

        registerUser();
    }, [address, isConnected, isAuthenticated]);

    // Attempt to automatically authenticate the user
    const attemptAutoAuthentication = async () => {
        if (isAutoAuthenticating || !address || hasAttemptedAuthRef.current) {
            return;
        }

        try {
            setIsAutoAuthenticating(true);
            console.log('🔌 Wallet: Attempting automatic authentication');

            // Mark that we've attempted authentication for this session
            hasAttemptedAuthRef.current = true;

            // Use the login function from useAuth
            await login();

            console.log('🔌 Wallet: Automatic authentication successful');
        } catch (error) {
            console.error('🔌 Wallet: Automatic authentication failed', error);
            // We don't set an error here to avoid showing it to the user
            // This is an automatic process and shouldn't interrupt the user experience
        } finally {
            setIsAutoAuthenticating(false);
        }
    };

    return {
        address,
        isConnected,
        isRegistered,
        isRegistering,
        isAutoAuthenticating,
        error
    };
} 