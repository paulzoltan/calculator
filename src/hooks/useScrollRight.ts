import { useEffect, useRef } from 'react'

const useScrollRight = (dependencyArray: any[]) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      const div = ref.current
      div.scrollLeft = div.scrollWidth
    }
  }, dependencyArray)

  return ref
}
export default useScrollRight
