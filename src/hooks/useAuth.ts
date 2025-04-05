import { useState, useEffect } from 'react';

// Define a type for the user object
export interface User {
    username: string;
    email: string;
    [key: string]: any; // Allow additional user-specific fields
}

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // To handle loading state
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        function fetchAuthData() {
            fetch('/api/auth/session')
                .then((response) => response.json())
                .then((data) => {
                    setIsLoggedIn(data.isLoggedIn);
                    setUser(data.isLoggedIn ? data.user : null);
                })
                .catch((err) => {
                    console.error('Failed to fetch auth data:', err);
                    setIsLoggedIn(false);
                    setUser(null);
                    setError('Failed to fetch authentication data');
                })
                .finally(() => {
                    setIsLoading(false); // Set loading to false after the fetch is complete
                }
            );
        }

        fetchAuthData();
    }, []);

    return { isLoggedIn, isLoading, user, error };
}
