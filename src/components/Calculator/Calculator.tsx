import './Calculator.css'
import { useState } from 'react'
import { evaluate } from 'mathjs'
import DisplayMath from '../DisplayMath'
import classNames from 'classnames'

const Calculator = () => {
  const [expression, setExpression] = useState('')

  const isLastElementIn = (arr: string[]) =>
    arr.includes(expression[expression.length - 1])

  const isPenultimateElementIn = (arr: string[]) =>
    arr.includes(expression[expression.length - 2])

  const skip = () => {}

  const canBecomeValid = (expr: string) => {
    try {
      evaluate(expr)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message)
        console.log(expr.length)
        if (
          err.message.startsWith('Unexpected end of expression') ||
          err.message.startsWith(
            `Parenthesis ) expected (char ${expr.length + 1})`
          )
        ) {
          return true
        }
      }
    }
  }

  const setExpressionIfCanBecomeValid = (expression: string) => {
    if (canBecomeValid(expression)) {
      setExpression(expression)
    }
  }

  const append = (element: string) => {
    setExpressionIfCanBecomeValid(expression + element)
  }

  const replaceLastElement = (element: string) => {
    const newExpression = expression.slice(0, -1) + element
    setExpressionIfCanBecomeValid(newExpression)
  }

  const appendOperator = (element: string) => {
    if (isLastElementIn(['+', '-', '*', '/'])) {
      replaceLastElement(element)
    } else {
      append(element)
    }
  }

  const appendMinus = (element: string) => {
    if (isLastElementIn(['+', '-'])) {
      replaceLastElement(element)
    } else {
      append(element)
    }
  }

  const appendPlus = (element: string) => {
    if (isLastElementIn(['+', '*', '/'])) {
      replaceLastElement(element)
    } else if (isLastElementIn(['-'])) {
      if (!isPenultimateElementIn(['/', '*'])) {
        replaceLastElement(element)
      }
    } else {
      append(element)
    }
  }
  const sqr = () => {
    append('^')
  }
  const sqrt = () => {
    append('sqrt(')
  }

  const actions: [string | JSX.Element, (...args: any[]) => void, string?][] = [
    ['', skip],
    ['(', () => append('(')],
    [')', () => append(')')],
    ['%', skip],
    ['C', () => setExpression('')],
    ['', skip],
    ['7', () => append('7'), 'digit'],
    ['8', () => append('8'), 'digit'],
    ['9', () => append('9'), 'digit'],
    ['÷', () => appendOperator('/')],
    ['', skip],
    ['4', () => append('4'), 'digit'],
    ['5', () => append('5'), 'digit'],
    ['6', () => append('6'), 'digit'],
    ['×', () => appendOperator('*')],
    ['√', () => sqrt()],
    ['1', () => append('1'), 'digit'],
    ['2', () => append('2'), 'digit'],
    ['3', () => append('3'), 'digit'],
    ['-', () => appendMinus('-')],
    [
      <>
        x<sup>2</sup>
      </>,
      () => sqr(),
    ],
    ['0', () => append('0'), 'digit'],
    ['.', () => append('.'), 'point'],
    ['=', () => console.log(evaluate(expression)), 'equals-sign'],
    ['+', () => appendPlus('+')],
  ]

  return (
    <div className='calculator'>
      <div className='calculator__display'>
        <div className='calculator__display__previous'>{expression}</div>
        <div className='calculator__display__current'>
          <DisplayMath expression={expression} />
        </div>
      </div>
      <div className='calculator__dial'>
        {actions.map(
          (
            [symbol, handleClick, className]: [
              symbol: string | JSX.Element,
              handleClick: (...args: any[]) => void,
              className?: string
            ],
            index
          ) => (
            <button
              className={classNames('btn', 'calculator__dial__btn', {
                [`calculator__dial__btn--${className}`]: className,
              })}
              onClick={handleClick}
              key={index}
            >
              {symbol}
            </button>
          )
        )}
      </div>
    </div>
  )
}
export default Calculator
