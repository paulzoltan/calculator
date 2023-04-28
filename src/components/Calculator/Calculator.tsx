import './Calculator.css'
import { useState } from 'react'
import { evaluate } from 'mathjs'
import DisplayMath from '../DisplayMath'
import classNames from 'classnames'

const Calculator = () => {
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState('')

  const isLastElementIn = (arr: string[]) =>
    arr.includes(expression[expression.length - 1])

  const isPenultimateElementIn = (arr: string[]) =>
    arr.includes(expression[expression.length - 2])

  const canBecomeValidExpression = (expr: string) => {
    try {
      evaluate(expr)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        // console.log(err.message)
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
    if (canBecomeValidExpression(expression)) {
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

  const appendMinus = () => {
    if (isLastElementIn(['+', '-'])) {
      replaceLastElement('-')
    } else {
      append('-')
    }
  }

  const appendPlus = () => {
    if (isLastElementIn(['+', '*', '/'])) {
      replaceLastElement('+')
    } else if (isLastElementIn(['-'])) {
      if (!isPenultimateElementIn(['/', '*'])) {
        replaceLastElement('+')
      }
    } else {
      append('+')
    }
  }

  const controller = (symbol: string) => {
    const isFirtActionAfterEvaluation = history[history.length - 1] === '='

    if (symbol !== '=' && isFirtActionAfterEvaluation) {
      setHistory(`Ans = ${expression}`)
    }

    if (
      [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '(',
        ')',
        '.',
      ].includes(symbol)
    ) {
      if (isFirtActionAfterEvaluation) {
        setExpressionIfCanBecomeValid(symbol)
      } else {
        append(symbol)
      }
    } else if (['*', '/'].includes(symbol)) {
      appendOperator(symbol)
    } else if (symbol === '-') {
      appendMinus()
    } else if (symbol === '+') {
      appendPlus()
    } else if (symbol === 'sqr') {
      append('^')
    } else if (symbol === 'sqrt') {
      append('sqrt(')
    } else if (symbol === '=') {
      let result
      try {
        result = evaluate(expression)
        setHistory(expression + ' =')
        setExpression(result.toString())
      } catch {
        console.log('Not valid expression')
      }
    } else if (symbol === 'C') {
      setExpression('')
      setHistory('')
    }
  }

  const actions: [string | JSX.Element, string, string?][] = [
    ['', ''],
    ['(', '('],
    [')', ')'],
    ['%', ''],
    ['C', 'C'],
    ['', ''],
    ['7', '7', 'digit'],
    ['8', '8', 'digit'],
    ['9', '9', 'digit'],
    ['÷', '/'],
    ['', ''],
    ['4', '4', 'digit'],
    ['5', '5', 'digit'],
    ['6', '6', 'digit'],
    ['×', '*'],
    ['√', 'sqrt'],
    ['1', '1', 'digit'],
    ['2', '2', 'digit'],
    ['3', '3', 'digit'],
    ['-', '-'],
    [
      <>
        x<sup>2</sup>
      </>,
      'sqr',
    ],
    ['0', '0', 'digit'],
    ['.', '.', 'point'],
    ['=', '=', 'equals-sign'],
    ['+', '+'],
  ]

  return (
    <div className='calculator'>
      <div className='calculator__display'>
        <div className='calculator__display__current'>{expression}</div>
        <div className='calculator__display__previous'>
          <DisplayMath expression={history} />
        </div>
        <div className='calculator__display__current'>
          <DisplayMath expression={expression} />
        </div>
      </div>
      <div className='calculator__dial'>
        {actions.map(
          (
            [label, symbol, className]: [
              label: string | JSX.Element,
              symbol: string,
              className?: string
            ],
            index
          ) => (
            <button
              className={classNames('btn', 'calculator__dial__btn', {
                [`calculator__dial__btn--${className}`]: className,
              })}
              onClick={() => controller(symbol)}
              key={index}
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
  )
}
export default Calculator
