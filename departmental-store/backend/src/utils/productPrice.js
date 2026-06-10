export const getSellingPrice = (product) => {
  const offer = product.offerPrice != null ? Number(product.offerPrice) : null;
  if (offer != null && offer > 0) return offer;
  return Number(product.price);
};

export const getListPrice = (product) => {
  const old = product.oldPrice != null ? Number(product.oldPrice) : null;
  if (old != null && old > 0) return old;

  const selling = getSellingPrice(product);
  const base = Number(product.price);
  if (selling < base) return base;

  return null;
};
