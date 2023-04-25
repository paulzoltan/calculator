import './Calculator.css'

const Calculator = () => {
  return (
    <div className='calculator'>
      <div className='calculator__dial'>
        <button className='btn calculator__dial__btn'>(</button>
        <button className='btn calculator__dial__btn'>)</button>
        <button className='btn calculator__dial__btn'>%</button>
        <button className='btn calculator__dial__btn'>CE</button>
        <button className='btn calculator__dial__btn'>7</button>
        <button className='btn calculator__dial__btn'>8</button>
        <button className='btn calculator__dial__btn'>9</button>
        <button className='btn calculator__dial__btn'>÷</button>
        <button className='btn calculator__dial__btn'>4</button>
        <button className='btn calculator__dial__btn'>5</button>
        <button className='btn calculator__dial__btn'>6</button>
        <button className='btn calculator__dial__btn'>×</button>
        <button className='btn calculator__dial__btn'>1</button>
        <button className='btn calculator__dial__btn'>2</button>
        <button className='btn calculator__dial__btn'>3</button>
        <button className='btn calculator__dial__btn'>-</button>
        <button className='btn calculator__dial__btn'>0</button>
        <button className='btn calculator__dial__btn'>.</button>
        <button className='btn calculator__dial__btn'>=</button>
        <button className='btn calculator__dial__btn'>+</button>
      </div>
    </div>
  )
}
export default Calculator
