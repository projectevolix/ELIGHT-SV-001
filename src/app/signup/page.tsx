
import { SignupForm } from '@/components/auth/signup-form';
import { Shield } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground">Fill in the details below to get started</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
