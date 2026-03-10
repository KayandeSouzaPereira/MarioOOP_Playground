import {World} from "./engine/world.js"
import {parseJava} from "./compiler/javaParser.js"
import {Mario} from "./domain/mario.js"
import {loadSprite} from "./engine/spriteLoader.js"

const world = new World("world")
let mario

async function init() {
  const sprite = await loadSprite("./assets/sprites/mario/mario_small.png")

  const animations = await fetch("./assets/sprites/mario/mario.animations.json")
    .then(r => r.json())

  mario = new Mario(sprite, animations)
  world.spawn(mario)
}

init()

document.getElementById("compile").onclick = () => {
  if (!mario) return

  const code = document.getElementById("javaCode").value
  const classModel = parseJava(code)

  mario.applyClassModel(classModel)
}