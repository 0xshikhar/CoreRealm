"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/hooks/useAuth';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export function AuthButton() {
    const { address } = useAccount();
    const { login, logout, isLoading, isAuthenticated, user, authAttempts } = useAuth();
    const [error, setError] = useState<string>();
    const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log("🔘 AuthButton: Render state", {
            address,
            isAuthenticated,
            isLoading,
            hasAttemptedLogin,
            authAttempts
        });
    }, [address, isAuthenticated, isLoading, hasAttemptedLogin, authAttempts]);

    const handleLogin = async () => {
        if (hasAttemptedLogin) {
            console.log("🔘 AuthButton: Preventing duplicate login attempt");
            return;
        }

        try {
            setError(undefined);
            setHasAttemptedLogin(true);
            console.log("🔘 AuthButton: Starting login process");
            await login();
            console.log("🔘 AuthButton: Login successful");
        } catch (err) {
            console.error("🔘 AuthButton: Login error", err);
            setError(err instanceof Error ? err.message : 'Failed to login');
        } finally {
            // Reset after a delay to prevent rapid re-attempts
            setTimeout(() => {
                setHasAttemptedLogin(false);
            }, 2000);
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <ConnectButton />

            {/* Show sign-in button only if wallet is connected and user is not authenticated */}
            {address && !isAuthenticated && (
                <button
                    onClick={handleLogin}
                    disabled={isLoading || hasAttemptedLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Signing...' : 'Sign-In'}
                </button>
            )}

            {isAuthenticated && (
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
            )}

            {error && <p className="text-red-500 w-full mt-2">{error}</p>}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="w-full mt-2 text-xs text-gray-500">
                    <div>Auth attempts: {authAttempts}</div>
                    <div>Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
                    {user && <div>User ID: {user.id}</div>}
                </div>
            )}
        </div>
    );
}
