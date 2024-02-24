type CombinedData = { category: string; imageUrl: any }[];

export function getCategoriesAndImages(
  categories: string[],
  imageImports: any[]
): CombinedData {
  return categories.map((category, index) => ({
    category,
    imageUrl: imageImports[index]?.default || null,
  }));
}
