'use client'
import RootLayout from "@/RootLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container mt-5 text-center">
          <h1 className="display-4">Loading...</h1>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="container mt-5 text-center">
        {isLoggedIn ? (
          <div className="row">
            <div className="col">
              <h1 className="display-4">Welcome Back!</h1>
              <p className="lead">Continue your journaling journey.</p>
              <a href="/profile" className="btn btn-success">Go to Profile</a>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => {
                  // Handle logout by calling the API or redirecting to a logout endpoint
                  fetch('/api/auth/logout', {
                    method: 'POST',
                  }).then(() => {
                    window.location.href = '/'; // Redirect to home after logout
                  }).catch((error) => {
                    console.error('Logout failed:', error);
                  });
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col">
                <h1 className="display-4">Welcome to Tapestry</h1>
                <p className="lead">A daily journaling app.</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <a href="/register" className="btn btn-primary">Get Started</a>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <small className="text-muted mt-2">Already have an account? <a href="/login">Click here to login!</a></small>
              </div>
            </div>
          </>
        )}
      </div>
    </RootLayout>
  );
}
