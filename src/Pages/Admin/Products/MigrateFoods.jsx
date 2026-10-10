import React, { useState } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../Firebase/Firebase.config";
import foods from "../../../Data/foods";

const MigrateFoods = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const migrateFoods = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "Import the 23 Cha Buzz foods into Firestore?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const batch = writeBatch(db);
      const productsRef = collection(db, "products");

      for (const food of foods) {
        // Stable ID prevents duplicate products on repeated runs.
        const productRef = doc(productsRef, String(food.id));
        const existing = await getDoc(productRef);
        const oldData = existing.exists()
          ? existing.data()
          : {};

        batch.set(
          productRef,
          {
            ...food,
            price: Number(food.price),
            discountActive:
              oldData.discountActive ?? false,
            discountType:
              oldData.discountType ?? "fixed",
            discountValue:
              Number(oldData.discountValue ?? 0),
          },
          { merge: true }
        );
      }

      await batch.commit();

      setMessage(
        `Success! ${foods.length} foods imported into Firestore.`
      );
    } catch (error) {
      console.error("Food migration failed:", error);
      setMessage(
        "Import failed. Check the browser console and Firestore permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold text-[#5A2E16]">
          Cha Buzz Food Import
        </h1>

        <p className="mt-3 text-gray-600">
          This will import the 23 foods from foods.js
          into the Firestore products collection.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Existing product IDs are updated without
          resetting saved discount settings.
        </p>

        <button
          type="button"
          onClick={migrateFoods}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-[#5A2E16] py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Importing..." : "Import 23 Foods"}
        </button>

        {message && (
          <p role="status" className="mt-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
};

export default MigrateFoods;