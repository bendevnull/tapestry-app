'use client'; // Ensure this file is treated as a client component in Next.js
import { useAuth } from '@/hooks/useAuth'; // Assume a custom hook for authentication
import { useRouter } from 'next/navigation'; // Use next/navigation for navigation
import { useEffect } from 'react';
import RootLayout from '@/RootLayout'; // Import the Root Layout component

export default function ProfilePage() {
    const { user, isLoading, isLoggedIn } = useAuth(); // Fetch session and loading state from the hook
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login'); // Redirect to login if the user is not authenticated
        }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading) {
        return (
            <RootLayout>
                <div className="container mt-5 text-center">
                    <h1 className="display-4">Loading...</h1>
                </div>
            </RootLayout>
        ); // Show a loading state while fetching session
    }

    if (!isLoggedIn) {
        return null; // Prevent rendering while redirecting
    }

    return (
        <RootLayout>
            <div>
                <h1>Profile Page</h1>
                <p>Welcome, {user?.username || 'User'}!</p>
                <p>Email: {user?.email || 'Not available'}</p>
                <p>This is the profile page. You can add user-specific information here.</p>
            </div>
        </RootLayout>
    );
}