import {
  OAuthProvider,
  signInWithPopup,
  getAuth,
  AuthError,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

import { firebaseAuthenticationAPIErrors } from "./auth-with-email";

export async function firebaseGoogleSignin() {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  try {
    // Signed in
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    data.error = false;
    data.detail = res.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function firebaseGithubSignin() {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  try {
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    // Add custom OAuth parameter
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const res = await signInWithPopup(auth, provider);

    data.error = false;
    data.detail = res.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function firebaseFacebookSignin() {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  try {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    // Add custom OAuth parameter
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const res = await signInWithPopup(auth, provider);
    data.error = false;
    data.detail = res.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function firebaseTwitterSignin() {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  try {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();
    // Add custom OAuth parameter
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const res = await signInWithPopup(auth, provider);
    data.error = false;
    data.detail = res.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function firebaseMicrosoftSignin() {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  try {
    const auth = getAuth();
    const provider = new OAuthProvider("microsoft.com");
    // Add custom OAuth parameter
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const res = await signInWithPopup(auth, provider);
    data.error = false;
    data.detail = res.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}
