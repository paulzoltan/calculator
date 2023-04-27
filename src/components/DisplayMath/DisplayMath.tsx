const format = (expr: string) => {
  const multiReplace = (str: string, rules: [string, string][]) =>
    rules.reduce((actStr, [from, to]) => actStr.replaceAll(from, to), str)

  const replaceRules: [string, string][] = [
    ['/', ' ÷ '],
    ['*', ' × '],
    ['+', ' + '],
    ['-', ' - '],
    ['×  - ', '× -'],
    ['×  -', '× -'],
    ['÷  - ', '÷ -'],
    ['÷  -', '÷ -'],
    ['sqrt', '√'],
  ]

  const formatted = multiReplace(expr, replaceRules)
  return formatted
}

const convert: (expr: string) => JSX.Element = (expr) => {
  const regex = /(\^[0-9|.|^]+|\^\(.*\))/g
  const matches = expr.match(regex)
  const exponents = matches === null ? [] : [...matches]

  const convertExpression: (
    expr: string,
    exponents: string[]
  ) => JSX.Element = (expr, exponents) => {
    const n = expr.search(regex)
    if (exponents.length === 0) {
      return <>{expr}</>
    }
    const exponent = exponents[0]
    return (
      <>
        {expr.slice(0, n)}
        <sup>{convertExponent(exponent.slice(1))}</sup>
        {convertExpression(
          expr.slice(n + exponent.length, expr.length),
          exponents.slice(1)
        )}
      </>
    )
  }

  const convertExponent = (expr: string) => {
    const n = expr.search(/\^/g)
    if (n === -1) return <>{expr}</>
    return (
      <>
        {expr.slice(0, n)}
        <sup>{convertExponent(expr.slice(n + 1, expr.length))}</sup>
      </>
    )
  }

  return convertExpression(expr, exponents)
}

const DisplayMath = ({ expression }: { expression: string }) => {
  return convert(format(expression))
}
export default DisplayMath
