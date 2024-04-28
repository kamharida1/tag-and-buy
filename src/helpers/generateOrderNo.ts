export function generateOrderNumber(): string {
  // Get current timestamp
  const timestamp = Date.now();

  // Generate random number (between 1000 and 9999)
  const random = Math.floor(Math.random() * 9000) + 1000;

  // Combine timestamp and random number
  let orderNumber = timestamp.toString() + random.toString();

  // If order number length is greater than 9, trim it
  if (orderNumber.length > 9) {
    orderNumber = orderNumber.slice(0, 9);
  }
  // If order number length is less than 9, pad it with zeros
  else if (orderNumber.length < 9) {
    orderNumber = orderNumber.padEnd(9, '0');
  }

  return orderNumber;
}

// Example usage
const orderNumber = generateOrderNumber();
console.log(orderNumber);
