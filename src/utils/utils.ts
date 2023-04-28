export const getDecimalSeparator = () => {
  const subject = (1.1).toLocaleString()
  return subject[1]
}
