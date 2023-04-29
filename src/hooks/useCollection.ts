import { useReducer } from 'react'

const useCollection = <T>() => {
  const [collection, dispatchMemory] = useReducer(
    (
      collection: T[],
      action: { type: 'push'; item: T } | { type: 'remove'; index: number }
    ) => {
      switch (action.type) {
        case 'push':
          return [...collection, action.item]
        case 'remove':
          return collection.filter((_, index) => index !== action.index)
      }
    },
    []
  )
  return [
    collection,
    (item: T): void => dispatchMemory({ type: 'push', item }),
    (index: number) => dispatchMemory({ type: 'remove', index }),
  ] as const
}
export default useCollection
