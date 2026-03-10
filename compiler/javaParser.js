export function parseJava(code) {
  const classMatch = code.match(/class\s+(\w+)/)
  const extendsMatch = code.match(/extends\s+(\w+)/)
  const implementsMatch = code.match(/implements\s+([^{\n]+)/)

  let powerups = []

  if (implementsMatch) {
    powerups = implementsMatch[1]
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
  }

  return {
    className: classMatch ? classMatch[1] : null,
    extends: extendsMatch ? extendsMatch[1] : "Object",
    powerups
  }
}