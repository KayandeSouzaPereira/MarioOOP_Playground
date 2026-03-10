export function resolvePowerups(powerups) {
  let form = "small"
  let abilities = []
  let modifiers = {
    jumpStrength: -12,
    gravity: 0.8,
    glideGravity: null
  }

  if (powerups.includes("SuperMushroom")) {
    form = "big"
    modifiers.jumpStrength = -13
  }

  if (powerups.includes("Cape")) {
    form = "cape"
    abilities.push("fly")
    modifiers.glideGravity = 0.28
  }

  return {
    form,
    abilities,
    modifiers
  }
}