export function resolvePowerups(powerups) {
  let form = "small"
  let abilities = []
  let modifiers = {
    jumpStrength: -12,
    gravity: 0.8,
    glideGravity: null,
    walkSpeed: 1.2,
    runSpeed: 2.2
  }

  let effects = {
    star: false
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

  if (powerups.includes("Star")) {
    effects.star = true
    abilities.push("invincible")
  }

  return {
    form,
    abilities,
    modifiers,
    effects
  }
}