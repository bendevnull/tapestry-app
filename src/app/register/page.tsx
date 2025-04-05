'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import RootLayout from "@/RootLayout";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const allFieldsFilled = username && email && password && confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isEmailValid(email)) {
      setError("Invalid email address");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RootLayout>
      <div className="container mt-5">
        <h1 className="text-center">Register</h1>
        <form onSubmit={handleRegister} className="mt-4">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${email && !isEmailValid(email) ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {email && !isEmailValid(email) && (
              <div className="invalid-feedback">Please enter a valid email address</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${confirmPassword && !passwordsMatch ? 'is-invalid' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && !passwordsMatch && (
              <div className="invalid-feedback">Passwords do not match</div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!allFieldsFilled || !passwordsMatch || !isEmailValid(email)}
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login here</a>.
        </p>
      </div>
    </RootLayout>
  );
}
