import { useState } from "react";

import {
  firebaseConfirmPasswordReset,
  firebaseEmailSignin,
  firebaseEmailSignup,
  firebasePasswordResetEmail,
} from "@/lib/firebase/auth/auth-with-email";
import {
  firebaseMicrosoftSignin,
  firebaseFacebookSignin,
  firebaseTwitterSignin,
  firebaseGithubSignin,
  firebaseGoogleSignin,
} from "@/lib/firebase/auth/auth-with-provider";
import { firebaseUpdateCredentials } from "@/lib/firebase/auth/change-credentials";

import { toast } from "@/components/ui/use-toast";

type AuthFunction = (
  email: string,
  password: string
) => Promise<{ error: boolean; detail: object | string | null }>;

type ProviderAuthFunction = () => Promise<{
  error?: boolean;
  detail?: string | object;
}>;

export function useFirebaseAuth() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (
    onAuth: AuthFunction,
    email: string,
    password: string
  ) => {
    setIsPending(true);
    const data = await onAuth(email, password);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const handleOAuth = async (onAuth: ProviderAuthFunction) => {
    setIsPending(true);
    const data = await onAuth();
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const onFirebaseEmailSignup = (email: string, password: string) => {
    if (!email || !password) {
      return setError("Email and password are required!");
    }
    return handleAuth(firebaseEmailSignup, email, password);
  };

  const onFirebaseEmailSignin = (email: string, password: string) => {
    if (!email || !password) {
      return setError("Email and password are required!");
    }
    return handleAuth(firebaseEmailSignin, email, password);
  };

  const onFirebaseGoogleSignin = () => handleOAuth(firebaseGoogleSignin);

  const onFirebaseGithubSignin = () => handleOAuth(firebaseGithubSignin);

  const onFirebaseTwitterSignin = () => handleOAuth(firebaseTwitterSignin);

  const onFirebaseFacebookSignin = () => handleOAuth(firebaseFacebookSignin);

  const onFIrebaserMicrosoftSignin = () => handleOAuth(firebaseMicrosoftSignin);

  const onFirebasePasswordResetEmail = async (email: string) => {
    setIsPending(true);
    const data = await firebasePasswordResetEmail(email);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const onFirebaseConfirmPasswordReset = async (
    oobCode: string,
    newPassword: string
  ) => {
    setError(null);
    setIsPending(true);
    const data = await firebaseConfirmPasswordReset(oobCode, newPassword);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const onFirebaseUpdateCredentials = async (
    currentPassword: string,
    newCred: string,
    credType: "email" | "password"
  ) => {
    setError(null);
    setIsPending(true);
    const data = await firebaseUpdateCredentials(
      currentPassword,
      newCred,
      credType
    );
    if (data.error) {
      setError(data.detail as string);
    }
    if (credType === "email") {
      toast({
        description: "Verification email sent to Your Inbox!",
      });
    }
    setIsPending(false);
    return data;
  };

  return {
    isPending,
    error,
    onFirebaseEmailSignup,
    onFirebaseEmailSignin,
    onFirebaseGoogleSignin,
    onFirebaseGithubSignin,
    onFirebaseTwitterSignin,
    onFirebaseFacebookSignin,
    onFIrebaserMicrosoftSignin,
    onFirebasePasswordResetEmail,
    onFirebaseConfirmPasswordReset,
    onFirebaseUpdateCredentials,
  };
}
