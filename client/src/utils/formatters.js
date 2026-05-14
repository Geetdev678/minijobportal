// Formatters
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatCurrency = (amount, currency = 'INR') => {
  return `${currency} ${amount}`;
};