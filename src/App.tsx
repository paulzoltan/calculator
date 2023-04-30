import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Calculator } from './components'
import { ThemeSelector } from './components'

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'theme--dark')

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight / 100}px`
    )
  }, [])

  return (
    <div className={classNames('App', theme)}>
      <ThemeSelector
        currentTheme={theme}
        themes={[
          { id: 'theme--simple', name: 'Simple' },
          { id: 'theme--dark', name: 'Dark' },
          { id: 'theme--neumorphic', name: 'Neumorphic' },
        ]}
        onSelect={setTheme}
      />
      <Calculator {...{ theme }} />
    </div>
  )
}

export default App
