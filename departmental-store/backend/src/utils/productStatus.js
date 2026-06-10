export const deriveProductStatus = (stock, requestedStatus) => {
  if (requestedStatus === 'INACTIVE') return 'INACTIVE';
  if (requestedStatus === 'OUT_OF_STOCK') return 'OUT_OF_STOCK';
  return stock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
};

export const applyStockChange = async (tx, productId, change) => {
  const product = await tx.product.update({
    where: { id: productId },
    data: { stock: { increment: change } },
  });

  if (product.status === 'INACTIVE') return product;

  if (product.stock <= 0 && product.status !== 'OUT_OF_STOCK') {
    return tx.product.update({
      where: { id: productId },
      data: { status: 'OUT_OF_STOCK' },
    });
  }

  return product;
};
