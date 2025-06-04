"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const { signup, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();
  const auth = getAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError("");
    
    // Basic validation
    if (password.length < 8) {
      setRegisterError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signup(email, password);
      if (result.success) {
        // Update user profile with display name
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name
          });
        }
        // Since it's a new user, we'll let the TutorialManager handle the redirect
        // No need to explicitly redirect here
      } else {
        setRegisterError(result.error || "Failed to create account. Please try again.");
      }
    } catch (error) {
      setRegisterError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lingento</h1>
        </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create your account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                At least 8 characters with letters, numbers, and special characters
              </p>
            </div>
            
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  terms of service
                </a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  privacy policy
                </a>
              </label>
            </div>
              {registerError && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm mb-4">
                {registerError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? "Creating account..." : "Create a free account"}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with</span>
            </div>
          </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={async () => {
                if (isLoading) return; // Prevent multiple clicks
                setIsLoading(true);
                setRegisterError("");
                try {
                  const result = await loginWithGoogle();
                  if (result.success) {
                    // If it's a new user, we'll let the TutorialManager handle the redirect
                    // Otherwise, we'll redirect to the flashcards page
                    if (!result.isNewUser) {
                      router.push("/flashcards");
                    }
                  } else {
                    // Show user-friendly error message
                    if (result.error && (result.error.includes('popup-closed') || result.error.includes('cancelled'))) {
                      setRegisterError("Sign up was cancelled. Please try again.");
                    } else if (result.error && result.error.includes('popup-blocked')) {
                      setRegisterError("Popup was blocked. Please enable popups for this website.");
                    } else {
                      setRegisterError(result.error || "Failed to sign up with Google");
                    }
                  }
                } catch (error) {
                  setRegisterError("An error occurred during Google sign up");
                  console.error("Google login error:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              className={`w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium ${
                isLoading ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                  <span>Signing up...</span>
                </div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
            </button>
            <button 
              onClick={async () => {
                if (isLoading) return; // Prevent multiple clicks
                setIsLoading(true);
                setRegisterError("");
                try {
                  const result = await loginWithFacebook();
                  if (result.success) {
                    // If it's a new user, we'll let the TutorialManager handle the redirect
                    // Otherwise, we'll redirect to the flashcards page
                    if (!result.isNewUser) {
                      router.push("/flashcards");
                    }
                  } else {
                    // Show user-friendly error message
                    if (result.error && (result.error.includes('popup-closed') || result.error.includes('cancelled'))) {
                      setRegisterError("Sign up was cancelled. Please try again.");
                    } else if (result.error && result.error.includes('popup-blocked')) {
                      setRegisterError("Popup was blocked. Please enable popups for this website.");
                    } else {
                      setRegisterError(result.error || "Failed to sign up with Facebook");
                    }
                  }
                } catch (error) {
                  setRegisterError("An error occurred during Facebook login");
                  console.error("Facebook login error:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              className={`w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium ${
                isLoading ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>
          <p className="mt-6 text-center text-base text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
