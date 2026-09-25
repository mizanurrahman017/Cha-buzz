import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../Firebase/Firebase.config";

// ========================================
// CREATE AUTH CONTEXT
// ========================================
const AuthContext = createContext();

// ========================================
// CUSTOM HOOK
// ========================================
export const useAuth = () => {
  return useContext(AuthContext);
};

// ========================================
// AUTH PROVIDER
// ========================================
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================
  // LOGIN
  // ======================================
  const loginUser = async (email, password) => {
    // Firebase login browser-এ persist করবে
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  };

  // ======================================
  // LOGOUT
  // ======================================
  const logoutUser = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // ======================================
  // CHECK USER + ROLE
  // ======================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          setLoading(true);

          // ==================================
          // USER LOGGED IN
          // ==================================
          if (currentUser) {
            setUser(currentUser);

            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();

              setUserRole(
                userData.role || "customer"
              );
            } else {
              setUserRole("customer");
            }

          } else {
            // ==================================
            // USER LOGGED OUT
            // ==================================
            setUser(null);
            setUserRole(null);
          }

        } catch (error) {
          console.error(
            "Authentication error:",
            error
          );

          setUser(null);
          setUserRole(null);

        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ======================================
  // CONTEXT VALUE
  // ======================================
  const authInfo = {
    user,
    userRole,
    loading,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;