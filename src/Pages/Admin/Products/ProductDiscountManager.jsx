
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../Firebase/Firebase.config";
import { getProductPricing } from "../../../Utils/productPricing";

const ProductDiscountManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Products could not be loaded.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateField = (id, field, value) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === id
          ? { ...product, [field]: value }
          : product
      )
    );
  };

  const saveDiscount = async (product) => {
    setError("");
    setSuccess("");

    const discountValue = Number(product.discountValue || 0);

    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0
    ) {
      setError("Discount must be a valid non-negative number.");
      return;
    }

    if (
      product.discountType === "percentage" &&
      discountValue > 100
    ) {
      setError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (
      product.discountType === "fixed" &&
      discountValue > Number(product.price)
    ) {
      setError("Fixed discount cannot exceed the product price.");
      return;
    }

    try {
      setSavingId(product.id);

      const productId = String(product.id);

      await updateDoc(doc(db, "products", productId), {
        discountType: product.discountType || "fixed",
        discountValue,
        discountActive: Boolean(product.discountActive),
      });
      setSuccess(`Discount saved for ${product.name}.`);
    } catch (err) {
      console.error("Discount save error:", err);
      setError(
        `Save failed: ${err.code || "unknown"} - ${err.message}`
      );
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return <p className="p-6">Loading products...</p>;
  }

  return (
    <section className="min-h-screen bg-[#F7F5EF] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[#5A2E16]">
          Product Discounts
        </h1>

        <p className="text-sm text-[#8A806B] mt-1 mb-6">
          Set a fixed discount or percentage for each product.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        {products.length === 0 && (
          <p className="bg-white rounded-xl p-5">
            No products found in the Firestore products collection.
          </p>
        )}

        <div className="space-y-4">
          {products.map((product) => {
            const pricing = getProductPricing(product);

            return (
              <article
                key={product.id}
                className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <h2 className="font-bold text-[#252525]">
                      {product.name}
                    </h2>

                    <p className="text-sm text-[#8A806B]">
                      Regular price: ৳{pricing.regularPrice}
                    </p>

                    <p className="text-sm font-semibold text-green-700">
                      Current selling price: ৳{pricing.discountedPrice}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Discount type
                    </label>

                    <select
                      value={product.discountType || "fixed"}
                      onChange={(e) =>
                        updateField(
                          product.id,
                          "discountType",
                          e.target.value
                        )
                      }
                      className="w-full h-11 rounded-lg border border-[#D8D5CC] px-3 bg-white"
                    >
                      <option value="fixed">Fixed amount (৳)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Discount value
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={
                        product.discountType === "percentage"
                          ? 100
                          : Number(product.price)
                      }
                      step="any"
                      value={product.discountValue ?? 0}
                      onChange={(e) =>
                        updateField(
                          product.id,
                          "discountValue",
                          e.target.value
                        )
                      }
                      className="w-full h-11 rounded-lg border border-[#D8D5CC] px-3"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-4 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(product.discountActive)}
                    onChange={(e) =>
                      updateField(
                        product.id,
                        "discountActive",
                        e.target.checked
                      )
                    }
                    className="accent-[#8B4F26] w-4 h-4"
                  />
                  Enable discount for this product
                </label>

                <button
                  type="button"
                  onClick={() => saveDiscount(product)}
                  disabled={savingId === product.id}
                  className="mt-4 w-full sm:w-auto px-5 h-11 rounded-lg bg-[#5A2E16] text-white font-semibold hover:bg-[#75431F] disabled:opacity-60"
                >
                  {savingId === product.id
                    ? "Saving..."
                    : "Save Discount"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductDiscountManager;
