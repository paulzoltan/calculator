const separator = (1.1).toLocaleString()[1]

export const getDecimalSeparator = () => {
  return separator
}

const options = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
}

export const localize = (num: string) => {
  return Number(num).toLocaleString(navigator.language, options)
}
