import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from "../firebase"; // adjust the path as needed

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user.getIdToken(); // Return the ID token
  };

  const logout = async () => {
    await signOut(auth); // Sign out the user
    setUser(null); // Clear the user state
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error("No user is logged in");

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential); // Reauthenticate the user
    await updatePassword(user, newPassword); // Update the password
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}