import { useReducer } from 'react'

const useCollection = <T>() => {
  const [collection, dispatch] = useReducer(
    (
      collection: T[],
      action:
        | { type: 'push'; item: T }
        | { type: 'remove'; index: number }
        | { type: 'pop' }
        | { type: 'clear' }
    ) => {
      switch (action.type) {
        case 'push':
          return [...collection, action.item]
        case 'remove':
          return collection.filter((_, index) => index !== action.index)
        case 'pop':
          return collection.slice(0, collection.length - 1)
        case 'clear':
          return []
      }
    },
    []
  )
  return {
    collection,
    push: (item: T): void => dispatch({ type: 'push', item }),
    remove: (index: number) => dispatch({ type: 'remove', index }),
    pop: () => dispatch({ type: 'pop' }),
    clear: () => dispatch({ type: 'clear' }),
    lastElement: collection[collection.length - 1],
  }
}
export default useCollection
