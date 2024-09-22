import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  AuthError,
  sendEmailVerification,
  User,
} from "firebase/auth";

import { firebaseAuthenticationAPIErrors } from "./auth-with-email";

export async function firebaseUpdateCredentials(
  currentPassword: string,
  newCred: string,
  credType: "email" | "password"
) {
  const data: { error: boolean; detail: object | string } = {
    error: false,
    detail: {},
  };

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    data.error = true;
    data.detail = "No user is signed in!";
    return data;
  }
  // Re-authenticate the user
  await reauthenticateUser(user, credType, currentPassword);
  try {
    if (credType === "email") {
      // Send email verification first if updating email
      await updateEmail(user, newCred);
      await sendEmailVerification(user);
      data.detail = "Email updated successfully! Verification email sent.";
    } else if (credType === "password") {
      await updatePassword(user, newCred);
      data.detail = "Password updated successfully!";
    }
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function reauthenticateUser(
  user: User,
  email: string,
  password: string
) {
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const UserCredential = await reauthenticateWithCredential(user, credential);
    return { error: false, detail: UserCredential };
  } catch (error) {
    return { error: true, detail: error };
  }
}
