export function resolvePowerups(powerups, sprites) {
  let sprite = sprites.small
  let abilities = []

  if (powerups.includes("SuperMushroom")) {
    sprite = sprites.big
  }
  
  if (powerups.includes("Cape")) {
    sprite = sprites.cape
    abilities.push("fly")
  }

  return {
    sprite,
    abilities
  }
}