import './Calculator.scss'
import './themes.scss'
import { useState } from 'react'
import { evaluate } from 'mathjs'
import { DisplayMath } from '..'
import classNames from 'classnames'
import { getDecimalSeparator } from '../../utils'
import { TbArrowNarrowRight, TbArrowNarrowLeft } from 'react-icons/tb'
import { useCollection } from '../../hooks'
import { MemoryDropdown } from '..'
import { BsBackspace } from 'react-icons/bs'
import { useComponentSize } from 'react-use-size'
import { useScrollRight } from '../../hooks'

const Calculator = ({ theme }: { theme: string }) => {
  const [expression, setExpression] = useState('')
  const [extraInfo, setExtraInfo] = useState('')
  const isFirtActionAfterEvaluation = extraInfo[extraInfo.length - 1] === '='
  const {
    collection: memory,
    push: memoryPush,
    remove: memoryRemove,
  } = useCollection<string>()
  const [isMemoryDropdownVisible, setIsMemoryDropdownVisible] = useState(false)

  const {
    push: historyPush,
    pop: historyPop,
    clear: historyClear,
    lastElement: lastElementOfHistory,
  } = useCollection<string>()

  const { ref: calculatorRef, width } = useComponentSize()
  const displayPrimaryRef = useScrollRight([expression])
  const displaySecondaryRef = useScrollRight([expression])

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

  const setExpressionIfCanBecomeValid = (expr: string) => {
    if (canBecomeValidExpression(expr)) {
      historyPush(expression)
      setExpression(expr)
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
      setExtraInfo(`Ans = ${expression}`)
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
        setExtraInfo(expression + ' =')
        setExpression(result.toString())
      } catch {
        console.log('Not valid expression')
      }
    } else if (symbol === 'C') {
      setExpression('')
      setExtraInfo('')
      historyClear()
    } else if (symbol === 'mIn') {
      memoryPush(expression)
    } else if (symbol === 'mOut') {
      setIsMemoryDropdownVisible(true)
    } else if (symbol === 'back') {
      if (lastElementOfHistory !== undefined) {
        setExpression(lastElementOfHistory)
        historyPop()
      }
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
    [
      <>
        <BsBackspace />
      </>,
      'back',
      'back',
    ],
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
    <div
      className={classNames('calculator', { mobile: width < 400 })}
      ref={calculatorRef}
    >
      <div className='calculator__display'>
        {/* <div className='calculator__display__primary'>{expression}</div> */}
        <div
          className='calculator__display__secondary'
          ref={displaySecondaryRef}
        >
          <DisplayMath expression={extraInfo} />
        </div>
        <div className='calculator__display__primary' ref={displayPrimaryRef}>
          <DisplayMath expression={expression} />
        </div>
      </div>
      <div className='calculator__dial'>
        {buttonData.map(
          ([label, symbol, className, buttonProps]: buttonDataT, index) => (
            <button
              id={`dial-btn-${index}`}
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
          onRemoveItem={memoryRemove}
          onClose={() => setIsMemoryDropdownVisible(false)}
        />
      </div>
      {/* {navigator.language} */}
    </div>
  )
}
export default Calculator
