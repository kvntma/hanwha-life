'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const clerk = useClerk();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    return clerk.addListener(event => {
      // Handle sign in and sign up completion
      if ('status' in event && event.status === 'complete') {
        onClose();
      }
    });
  }, [clerk, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-2xl font-bold text-center">
          Welcome to Bruh, Chicken
        </DialogTitle>
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
            {isSignIn ? <SignIn routing="virtual" /> : <SignUp routing="virtual" />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
