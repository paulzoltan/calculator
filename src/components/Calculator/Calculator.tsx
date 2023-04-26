import './Calculator.css'
import { useState } from 'react'
import { evaluate } from 'mathjs'

const Calculator = () => {
  const [expression, setExpression] = useState('')
  const skip = () => {}

  const add = (str: string) => {
    try {
      evaluate(expression + str)
      setExpression((e) => e + str)
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (
          err.message.startsWith('Unexpected end of expression') ||
          err.message.startsWith('Parenthesis ) expected')
        ) {
          setExpression((e) => e + str)
        }
      }
    }
  }

  const actions: [string | JSX.Element, (...args: any[]) => void][] = [
    ['', skip],
    ['(', () => add('(')],
    [')', () => add(')')],
    ['%', skip],
    ['C', () => setExpression('')],
    ['', skip],
    ['7', () => add('7')],
    ['8', () => add('8')],
    ['9', () => add('9')],
    ['÷', () => add('/')],
    ['', skip],
    ['4', () => add('4')],
    ['5', () => add('5')],
    ['6', () => add('6')],
    ['×', () => add('*')],
    ['√', skip],
    ['1', () => add('1')],
    ['2', () => add('2')],
    ['3', () => add('3')],
    ['-', () => add('-')],
    [
      <>
        x<sup>2</sup>
      </>,
      skip,
    ],
    ['0', () => add('0')],
    ['.', skip],
    ['=', () => console.log(evaluate(expression))],
    ['+', () => add('+')],
  ]

  return (
    <div className='calculator'>
      {expression}
      <div className='calculator__dial'>
        {actions.map(
          (
            [symbol, handleClick]: [
              symbol: string | JSX.Element,
              handleClick: (...args: any[]) => void
            ],
            index
          ) => (
            <button
              className='btn calculator__dial__btn'
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
