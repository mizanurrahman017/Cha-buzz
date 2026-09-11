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
    await signOut(auth);
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

          if (currentUser) {

            setUser(currentUser);

            // ------------------------------
            // Get user role from Firestore
            // ------------------------------
            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {

              const userData = userSnap.data();

              setUserRole(userData.role || "customer");

            } else {

              // যদি Firestore user document না থাকে
              setUserRole("customer");

            }

          } else {

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