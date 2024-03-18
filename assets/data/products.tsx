import { faker } from "@faker-js/faker";

export const products = Array(10)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    image: faker.image.urlPicsumPhotos({ width: 600, height: 600 }),
    // images: [faker.image.urlPicsumPhotos({ width: 600, height: 600 }).repeat(4)],
    images: `${faker.image.urlPicsumPhotos({width: 600, height: 600})},`.repeat(4).split(','),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    oldPrice: faker.commerce.price(),
    rating: faker.number.int(),
    reviews: faker.number.int(),
    favorite: faker.datatype.boolean(),
    category: faker.commerce.department(),
    count: faker.number.int(),
    inStock: faker.datatype.boolean(),
    sub_category: faker.commerce.productMaterial(),
  }));