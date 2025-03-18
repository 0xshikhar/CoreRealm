// hooks/useAuth.ts
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useCallback, useEffect, useState, useRef } from 'react';
import { generateNonce, SiweMessage } from 'siwe';
// import { createAuthMessage } from '@/lib/auth';
import { createSiweMessage } from '@/lib/auth-utils';

// Constants for debugging
const DEBUG_PREFIX = "🔐 AUTH";
const MAX_AUTH_ATTEMPTS = 2;

export function useAuth() {
    const { address, chain, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAutoSigningIn, setIsAutoSigningIn] = useState(false);
    const [authAttempts, setAuthAttempts] = useState(0);

    // Track authentication attempts to limit them
    const authAttemptsRef = useRef(0);

    // Track if we've already checked for existing users
    const hasCheckedExistingUserRef = useRef(false);

    // Track the current wallet address we're processing
    const currentAddressRef = useRef<string | null>(null);

    // Track if a check or login is in progress
    const isProcessingRef = useRef(false);

    // Track if we've initialized from localStorage
    const hasInitializedRef = useRef(false);

    // Enhanced logging function
    const logAuth = useCallback((message: string, data?: any) => {
        if (data) {
            console.log(`${DEBUG_PREFIX}: ${message}`, data);
        } else {
            console.log(`${DEBUG_PREFIX}: ${message}`);
        }
    }, []);

    // Reset the processing state if it gets stuck
    const resetProcessingState = useCallback(() => {
        logAuth('Resetting processing state due to timeout');
        isProcessingRef.current = false;
        setIsAutoSigningIn(false);
        setIsLoading(false);
    }, [logAuth]);

    // Initialize auth state from localStorage on mount - only once
    useEffect(() => {
        if (hasInitializedRef.current) return;

        hasInitializedRef.current = true;
        const token = localStorage.getItem('auth_token');

        if (token) {
            logAuth('Found token in localStorage, setting authenticated state');
            setIsAuthenticated(true);
        } else {
            logAuth('No token found in localStorage');
        }
    }, [logAuth]);

    // Check for existing token when address changes
    useEffect(() => {
        // Skip if no address or already processing
        if (!address || isProcessingRef.current) {
            return;
        }

        // Skip if the address hasn't changed and we've already checked
        if (address === currentAddressRef.current && hasCheckedExistingUserRef.current) {
            return;
        }

        // Update the current address we're processing
        currentAddressRef.current = address;

        const checkAuth = async () => {
            // Prevent concurrent auth checks
            if (isProcessingRef.current) {
                logAuth('Auth check already in progress, skipping');
                return;
            }

            try {
                isProcessingRef.current = true;
                logAuth(`Checking auth for address: ${address}`);

                // Check if we already have a token
                const token = localStorage.getItem('auth_token');
                if (token) {
                    // Validate the token
                    try {
                        logAuth('Validating existing token');
                        const response = await fetch('/api/protected/check', {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setUser(data.user);
                            setIsAuthenticated(true);
                            logAuth('Token validated successfully');
                            hasCheckedExistingUserRef.current = true;
                            return;
                        } else {
                            // Token is invalid, remove it
                            logAuth('Token validation failed, removing token');
                            localStorage.removeItem('auth_token');
                            setIsAuthenticated(false);
                        }
                    } catch (error) {
                        logAuth('Error validating token:', error);
                        localStorage.removeItem('auth_token');
                        setIsAuthenticated(false);
                    }
                }

                // Only check for existing user once per address
                if (!hasCheckedExistingUserRef.current) {
                    hasCheckedExistingUserRef.current = true;

                    // Check if user exists but don't auto-sign in
                    try {
                        logAuth(`Checking if user exists for address: ${address}`);
                        const response = await fetch(`/api/user/check?address=${address}`);
                        if (response.ok) {
                            const data = await response.json();
                            logAuth(`User exists check: ${data.exists}`);
                            // We're not auto-signing in anymore to prevent multiple prompts
                        }
                    } catch (error) {
                        logAuth('Error checking user:', error);
                    }
                }
            } finally {
                isProcessingRef.current = false;
            }
        };

        checkAuth();
    }, [address, logAuth]);

    const login = useCallback(async () => {
        if (!address || !isConnected) {
            throw new Error('Wallet not connected');
        }

        setAuthAttempts(prev => prev + 1);

        try {
            setIsLoading(true);
            logAuth('Starting login process');

            // Generate nonce
            const nonce = generateNonce();
            logAuth(`Generated nonce: ${nonce}`);

            // Generate message with the correct chain ID
            const chainId = chain?.id || 1; // Use connected chain ID or default to 1
            const message = createSiweMessage(address, nonce, chainId);
            logAuth('Generated SIWE message');
            logAuth('Message content:', message); // Add detailed logging

            // Request signature
            const signature = await signMessageAsync({ message });
            logAuth('Got signature from wallet');
            logAuth('Signature (first 20 chars):', signature.substring(0, 20) + '...');

            // Send to server for verification
            logAuth('Sending signature to server for verification');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    message,
                    signature,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                logAuth(`Authentication failed on server ${JSON.stringify(errorData)}`);
                throw new Error(errorData.error || 'Authentication failed');
            }

            const data = await response.json();
            logAuth('Authentication successful');

            // Store token
            localStorage.setItem('auth_token', data.token);
            setIsAuthenticated(true);
            setUser(data.user);

            return data;
        } catch (error) {
            logAuth(`Login error: ${error}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, isConnected, logAuth, signMessageAsync, chain]);

    const logout = useCallback(() => {
        logAuth('Logging out');
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
        hasCheckedExistingUserRef.current = false;
        currentAddressRef.current = null;
        isProcessingRef.current = false;
        authAttemptsRef.current = 0; // Reset auth attempts on logout
        disconnect();
        logAuth('Logout complete');
    }, [disconnect, logAuth]);

    // Add a function to check if a user is authenticated for a protected route
    const checkProtectedRouteAccess = useCallback(async () => {
        if (!address || !isAuthenticated) {
            return false;
        }

        try {
            // Try to access a protected endpoint to verify the token is valid
            const token = localStorage.getItem('auth_token');
            if (!token) return false;

            const response = await fetch('/api/protected/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Failed to check protected route access:', error);
            return false;
        }
    }, [address, isAuthenticated]);

    const testSiweVerification = useCallback(async () => {
        if (!address || !isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            logAuth('Starting SIWE test');

            // Generate nonce
            const nonce = generateNonce();
            logAuth(`Generated nonce: ${nonce}`);

            // Generate message
            const chainId = chain?.id || 1;
            const message = createSiweMessage(address, nonce, chainId);
            logAuth('Generated SIWE message:', message);

            // Request signature
            const signature = await signMessageAsync({ message });
            logAuth('Got signature from wallet');

            // Send to test endpoint
            const response = await fetch('/api/auth/test-siwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    signature,
                }),
            });

            const data = await response.json();
            logAuth('Test SIWE verification result:', data);

            return data;
        } catch (error) {
            logAuth('Test SIWE error:', error);
            throw error;
        }
    }, [address, isConnected, chain, logAuth, signMessageAsync]);

    return {
        login,
        logout,
        isLoading,
        isAuthenticated,
        user,
        isAutoSigningIn,
        authAttempts,
        checkProtectedRouteAccess,
        testSiweVerification
    };
}

// Create a SIWE message for signing
// export function createSiweMessage(address: string, nonce: string, chainId?: number): string {
//     const message = new SiweMessage({
//         domain: window.location.host, // or your domain
//         address,
//         statement: 'Sign this message to authenticate with CoreRealm.',
//         uri: window.location.origin,
//         version: '1',
//         chainId: chainId || 1,
//         nonce,
//         issuedAt: new Date().toISOString(),
//     });

//     return message.prepareMessage();
// }
