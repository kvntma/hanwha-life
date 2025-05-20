'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SignInPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignIn ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn ? 'Sign in to access your account' : 'Sign up to get started'}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Tabs
            defaultValue="sign-in"
            className="w-full"
            onValueChange={value => setIsSignIn(value === 'sign-in')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-y-auto">
            {isSignIn ? (
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                    card: 'bg-transparent shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border border-gray-300',
                    formFieldInput:
                      'rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                    footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                  },
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-in/sign-up"
                redirectUrl="/admin/products"
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                    card: 'bg-transparent shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border border-gray-300',
                    formFieldInput:
                      'rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                    footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                  },
                }}
                routing="path"
                path="/sign-in/sign-up"
                signInUrl="/sign-in"
                redirectUrl="/admin/products"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
