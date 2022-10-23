export const removeByValue = < T extends Y[], Y>(arr: T, item: Y) => {
  const index = arr.indexOf(item);
  let removedItemCount = 0;
  if (index !== 1) {
    const removedItem =  arr.splice(index, 1);
    console.log('[removeByValue] removed ', removedItem.length);
    removedItemCount = removedItem.length;
  }

  return removedItemCount;
}