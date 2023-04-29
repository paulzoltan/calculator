import './Calculator.css'
import { useState } from 'react'
import { evaluate } from 'mathjs'
import { DisplayMath } from '..'
import classNames from 'classnames'
import { getDecimalSeparator } from '../../utils'
import { TbArrowNarrowRight, TbArrowNarrowLeft } from 'react-icons/tb'
import { useCollection } from '../../hooks'
import { MemoryDropdown } from '..'

const Calculator = () => {
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState('')
  const isFirtActionAfterEvaluation = history[history.length - 1] === '='
  const [memory, pushMem, removeMem] = useCollection<string>()
  const [isMemoryDropdownVisible, setIsMemoryDropdownVisible] = useState(false)

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
      return false
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
        '%',
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
    } else if (symbol === 'mIn') {
      pushMem(expression)
    } else if (symbol === 'mOut') {
      setIsMemoryDropdownVisible(true)
    }
  }

  type buttonDataT = [
    label: string | JSX.Element,
    symbol: string,
    className?: string,
    buttonProps?: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  ]

  const buttonData: buttonDataT[] = [
    [
      <>
        M <TbArrowNarrowRight />
      </>,
      'mOut',
      'memory',
      { disabled: memory.length === 0 },
    ],
    ['(', '('],
    [')', ')'],
    ['', ''],
    ['C', 'C'],
    [
      <>
        M <TbArrowNarrowLeft />
      </>,
      'mIn',
      'memory',
      { disabled: !isFirtActionAfterEvaluation },
    ],
    ['7', '7', 'digit'],
    ['8', '8', 'digit'],
    ['9', '9', 'digit'],
    ['÷', '/'],
    ['%', '%'],
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
        x<sup>y</sup>
      </>,
      'sqr',
    ],
    ['0', '0', 'digit'],
    [getDecimalSeparator(), '.', 'point'],
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
        {buttonData.map(
          ([label, symbol, className, buttonProps]: buttonDataT, index) => (
            <button
              className={classNames('btn', 'calculator__dial__btn', {
                [`calculator__dial__btn--${className}`]: className,
              })}
              onClick={() => controller(symbol)}
              key={index}
              {...buttonProps}
            >
              {label}
            </button>
          )
        )}
        <MemoryDropdown
          memory={memory}
          visible={isMemoryDropdownVisible}
          onSelectItem={append}
          onRemoveItem={removeMem}
          onClose={() => setIsMemoryDropdownVisible(false)}
        />
      </div>

      {navigator.language}
    </div>
  )
}
export default Calculator
