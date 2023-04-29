import './MemoryDropdown.css'
import { RiDeleteBinLine } from 'react-icons/ri'
import { localize } from '../../utils'

const MemoryDropdown = ({
  memory,
  visible,
  onSelectItem,
  onRemoveItem,
  onClose,
}: {
  memory: string[]
  visible: boolean
  onSelectItem: (mem: string) => void
  onRemoveItem: (index: number) => void
  onClose: () => void
}) => {
  return (
    <>
      {visible && (
        <>
          <div className='memory-dropdown-backdrop' onClick={onClose}></div>
          <div className='memory-dropdown'>
            {memory.map((mem, index) => (
              <div className='memory-dropdown__item' key={index}>
                <div
                  className='memory-dropdown__item__text'
                  onClick={() => {
                    onClose()
                    onSelectItem(mem)
                  }}
                >
                  {localize(mem)}
                </div>
                <RiDeleteBinLine onClick={() => onRemoveItem(index)} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
export default MemoryDropdown
