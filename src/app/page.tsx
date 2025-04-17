'use client'

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to ARTI Notes</h1>
        <p className="text-lg text-gray-600">Your intelligent meeting assistant</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300
                     bg-gradient-to-r from-violet-600 via-fuchsia-600 to-sky-600
                     hover:scale-105 hover:shadow-xl hover:shadow-violet-600/20
                     text-white"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300
                     bg-white hover:bg-gray-50 border border-gray-200
                     hover:scale-105 hover:shadow-xl hover:shadow-violet-600/20
                     text-gray-900"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
} 