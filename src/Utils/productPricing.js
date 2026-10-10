
export const getProductPricing = (product) => {
  const regularPrice = Math.max(
    0,
    Number(product.price) || 0
  );

  const discountActive = product.discountActive === true;
  const discountType = product.discountType || "fixed";
  const discountValue = Math.max(
    0,
    Number(product.discountValue) || 0
  );

  let discountPerItem = 0;

  if (discountActive) {
    if (discountType === "percentage") {
      discountPerItem =
        regularPrice * Math.min(discountValue, 100) / 100;
    } else {
      discountPerItem = Math.min(
        discountValue,
        regularPrice
      );
    }
  }

  // Keep amounts in two decimal places.
  discountPerItem = Math.round(
    discountPerItem * 100
  ) / 100;

  const discountedPrice = Math.max(
    0,
    Math.round((regularPrice - discountPerItem) * 100) / 100
  );

  return {
    regularPrice,
    discountPerItem,
    discountedPrice,
    hasDiscount: discountActive && discountPerItem > 0,
  };
};
