export const createUniqueKey = (() => {
  let id = 0
  return () => Symbol(`_effect_${id++}`)
})()
