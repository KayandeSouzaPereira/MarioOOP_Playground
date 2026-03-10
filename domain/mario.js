import {Entity} from "./entity.js"
import {resolvePowerups} from "./powerups.js"
import {Animator} from "../engine/animation.js"

export class Mario extends Entity {
  constructor(sprite, animations) {
    super()

    this.sprite = sprite
    this.powerups = []
    this.animator = new Animator(sprite, animations)

    this.renderWidth = 64
    this.renderHeight = 64

    this.bounds = {
      left: 450,
      right: 780,
      top: 220,
      bottom: 430
    }

    this.x = 560
    this.y = this.bounds.bottom + 20

    this.groundY = this.bounds.bottom + 20

    this.velocityX = 0
    this.velocityY = 0

    this.gravity = 0.8
    this.jumpStrength = -12

    this.walkSpeed = 1.2
    this.runSpeed = 2.2

    this.onGround = true
    this.direction = 1

    this.actions = ["idle", "walk", "run", "jump"]
    this.actionTimer = 0
    this.actionInterval = 2200

    this.currentAction = "idle"
  }

  applyClassModel(model) {
    const result = resolvePowerups(model.powerups)
    this.powerups = result.abilities || []
  }

  randomAction() {
    const pool = [
      "idle", "idle", "idle",
      "walk", "walk",
      "run",
      "jump"
    ]

    const action = pool[Math.floor(Math.random() * pool.length)]

    if (action === "jump" && this.onGround) {
      this.jump()
      return
    }

    this.setAction(action)
  }

  setAction(action) {
    this.currentAction = action

    if (action === "idle") {
      this.velocityX = 0
      this.animator.set("idle")
      this.actionInterval = 2200
      return
    }

    if (action === "walk") {
      this.velocityX = this.walkSpeed * this.direction
      this.animator.set("walk")
      this.actionInterval = 1800
      return
    }

    if (action === "run") {
      this.velocityX = this.runSpeed * this.direction
      this.animator.set("run")
      this.actionInterval = 1400
      return
    }
  }

  jump() {
    if (!this.onGround) return

    this.currentAction = "jump"
    this.velocityY = this.jumpStrength
    this.onGround = false
    this.animator.set("jump")
    this.actionInterval = 1200
  }

  clampHorizontalBounds() {
    if (this.x <= this.bounds.left) {
      this.x = this.bounds.left
      this.direction = 1

      if (this.velocityX < 0) {
        this.velocityX = Math.abs(this.velocityX)
      }
    }

    if (this.x + this.renderWidth >= this.bounds.right) {
      this.x = this.bounds.right - this.renderWidth
      this.direction = -1

      if (this.velocityX > 0) {
        this.velocityX = -Math.abs(this.velocityX)
      }
    }
  }

  update(delta) {
    this.actionTimer += delta

    if (this.actionTimer >= this.actionInterval) {
      this.randomAction()
      this.actionTimer = 0
    }

    this.x += this.velocityX
    this.clampHorizontalBounds()

    if (!this.onGround) {
      this.velocityY += this.gravity
      this.y += this.velocityY

      if (this.velocityY > 0) {
        this.animator.set("fall")
      }

      if (this.y >= this.groundY) {
        this.y = this.groundY
        this.velocityY = 0
        this.onGround = true

        if (Math.abs(this.velocityX) > this.walkSpeed) {
          this.animator.set("run")
        } else if (Math.abs(this.velocityX) > 0) {
          this.animator.set("walk")
        } else {
          this.animator.set("idle")
        }
      }
    }

    this.animator.update(delta)
  }

  draw(ctx) {
    this.animator.draw(
      ctx,
      this.x,
      this.y - this.renderHeight,
      this.direction
    )

    ctx.strokeStyle = "yellow"
    ctx.strokeRect(
      this.bounds.left,
      this.bounds.top,
      this.bounds.right - this.bounds.left,
      this.bounds.bottom - this.bounds.top
    )
  }
}