import './ThemeSelector.css'
import classNames from 'classnames'

const ThemeSelector = ({
  currentTheme,
  themes,
  onSelect,
}: {
  currentTheme: string
  themes: { id: string; name: string }[]
  onSelect: (themeId: string) => void
}) => {
  return (
    <div className='theme-selector'>
      {themes.map(({ id, name }) => (
        <button
          onClick={() => onSelect(id)}
          className={classNames('btn', 'btn--theme', {
            'btn-selected': currentTheme === id,
          })}
          key={id}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
export default ThemeSelector
