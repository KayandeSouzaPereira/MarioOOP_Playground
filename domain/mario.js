import {Entity} from "./entity.js"
import {resolvePowerups} from "./powerups.js"
import {Animator} from "../engine/animation.js"

export class Mario extends Entity {
  constructor(sprites, animationConfig) {
    super()

    this.sprites = sprites
    this.animationConfig = animationConfig
    this.form = "small"
    this.entityType = "Character"

    this.sprite = sprites.small
    this.powerups = []

    this.animator = new Animator(
      this.sprite,
      this.animationConfig.forms.small
    )

    this.x = 560
    this.bounds = {
      left: 450,
      right: 780,
      top: 220,
      bottom: 430
    }

    this.renderHeight = this.animationConfig.forms.small.frameHeight * this.animationConfig.forms.small.scale
    this.y = this.bounds.bottom
    this.groundY = this.bounds.bottom

    this.velocityX = 0
    this.velocityY = 0

    this.gravity = 0.8
    this.defaultGravity = 0.8
    this.glideGravity = null
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
    this.entityType = model.extends || "Object"

    const result = resolvePowerups(model.powerups)

    this.powerups = result.abilities || []
    this.applyForm(result.form, result.modifiers)

    if (this.isObjectType()) {
      this.velocityX = 0
      this.velocityY = 0
      this.onGround = true
      this.y = this.groundY
      this.currentAction = "idle"
      this.animator.set("idle")
    }
  }

  isObjectType() {
    return this.entityType === "Object"
  }

  applyForm(form, modifiers) {
    this.form = form

    const sprite = this.sprites[form]
    const formConfig = this.animationConfig.forms[form]

    if (!sprite || !formConfig) return

    this.sprite = sprite
    this.animator.setForm(sprite, formConfig)

    this.defaultGravity = modifiers.gravity
    this.gravity = modifiers.gravity
    this.jumpStrength = modifiers.jumpStrength
    this.glideGravity = modifiers.glideGravity

    this.renderHeight = formConfig.frameHeight * formConfig.scale
  }

  randomAction() {
    if (this.isObjectType()) {
      this.currentAction = "idle"
      this.velocityX = 0
      this.animator.set("idle")
      return
    }

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
    if (this.isObjectType()) {
      this.currentAction = "idle"
      this.velocityX = 0
      this.animator.set("idle")
      return
    }

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
    if (this.isObjectType()) return
    if (!this.onGround) return

    this.currentAction = "jump"
    this.velocityY = this.jumpStrength
    this.onGround = false
    this.animator.set("jump")
    this.actionInterval = 1200
  }

  clampHorizontalBounds() {
    const renderWidth =
      this.animationConfig.forms[this.form].frameWidth *
      this.animationConfig.forms[this.form].scale

    if (this.x <= this.bounds.left) {
      this.x = this.bounds.left
      this.direction = 1

      if (this.velocityX < 0) {
        this.velocityX = Math.abs(this.velocityX)
      }
    }

    if (this.x + renderWidth >= this.bounds.right) {
      this.x = this.bounds.right - renderWidth
      this.direction = -1

      if (this.velocityX > 0) {
        this.velocityX = -Math.abs(this.velocityX)
      }
    }
  }

  update(delta) {
    if (this.isObjectType()) {
      this.velocityX = 0
      this.velocityY = 0
      this.onGround = true
      this.y = this.groundY
      this.animator.set("idle")
      this.animator.update(delta)
      return
    }

    this.actionTimer += delta

    if (this.actionTimer >= this.actionInterval) {
      this.randomAction()
      this.actionTimer = 0
    }

    this.x += this.velocityX
    this.clampHorizontalBounds()

    if (!this.onGround) {
      const falling = this.velocityY > 0

      if (this.form === "cape" && falling && this.currentAction === "jump") {
        this.gravity = this.glideGravity ?? this.defaultGravity
      } else {
        this.gravity = this.defaultGravity
      }

      this.velocityY += this.gravity
      this.y += this.velocityY

      if (this.velocityY > 0) {
        this.animator.set("fall")
      }

      if (this.y >= this.groundY) {
        this.y = this.groundY
        this.velocityY = 0
        this.onGround = true
        this.gravity = this.defaultGravity

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
      this.direction,
      { grayscale: this.isObjectType() }
    )
  }
}