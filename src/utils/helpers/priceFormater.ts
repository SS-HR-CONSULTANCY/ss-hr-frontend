export const formatNumberToPrice = (amount: number, decimal = 2): string => {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimal,
  }).format(amount);

};