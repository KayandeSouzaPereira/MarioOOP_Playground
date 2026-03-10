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
      bottom: 433
    }

    this.renderHeight =
      this.animationConfig.forms.small.frameHeight *
      this.animationConfig.forms.small.scale

    this.y = this.bounds.bottom
    this.groundY = this.bounds.bottom

    this.velocityX = 0
    this.velocityY = 0

    this.gravity = 0.8
    this.defaultGravity = 0.8
    this.glideGravity = null
    this.jumpStrength = -12

    this.baseWalkSpeed = 1.2
    this.baseRunSpeed = 2.2

    this.walkSpeed = this.baseWalkSpeed
    this.runSpeed = this.baseRunSpeed

    this.onGround = true
    this.direction = 1

    this.actions = ["idle", "walk", "run", "jump"]
    this.actionTimer = 0
    this.actionInterval = 2200
    this.currentAction = "idle"

    this.isTransforming = false
    this.transformTimer = 0
    this.transformDuration = 1000
    this.transformInterval = 120
    this.transformBlinkTimer = 0
    this.transformFromForm = "small"
    this.transformToForm = "small"

    this.starActive = false
    this.starTimer = 0
    this.starDuration = 4000
  }

  applyClassModel(model) {
    this.entityType = model.extends || "Object"

    const result = resolvePowerups(model.powerups)

    this.powerups = result.abilities || []

    if (result.form !== this.form) {
      this.startTransformation(result.form, result.modifiers)
    } else {
      this.applyForm(result.form, result.modifiers)
    }

    if (result.effects?.star) {
      this.activateStar()
    } else {
      this.starActive = false
      this.starTimer = 0
      this.walkSpeed = this.baseWalkSpeed
      this.runSpeed = this.baseRunSpeed
    }

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

  startTransformation(targetForm, modifiers) {
    this.isTransforming = true
    this.transformTimer = 0
    this.transformBlinkTimer = 0
    this.transformFromForm = this.form
    this.transformToForm = targetForm
    this.pendingModifiers = modifiers

    this.velocityX = 0
    this.velocityY = 0
    this.onGround = true
    this.y = this.groundY
    this.currentAction = "idle"
    this.animator.set("idle")
  }

  applyForm(form, modifiers) {
    this.form = form

    const sprite = this.sprites[form]
    const formConfig = this.animationConfig.forms[form]

    if (!sprite || !formConfig) return

    this.sprite = sprite
    this.animator.setForm(sprite, formConfig)

    this.defaultGravity = modifiers.gravity ?? 0.8
    this.gravity = this.defaultGravity
    this.jumpStrength = modifiers.jumpStrength ?? -12
    this.glideGravity = modifiers.glideGravity ?? null
    this.baseWalkSpeed = modifiers.walkSpeed ?? 1.2
    this.baseRunSpeed = modifiers.runSpeed ?? 2.2

    this.walkSpeed = this.baseWalkSpeed
    this.runSpeed = this.baseRunSpeed

    this.renderHeight = formConfig.frameHeight * formConfig.scale
  }

  activateStar() {
    this.starActive = true
    this.starTimer = 0
    this.jumpStrength = this.jumpStrength * 1.08
    this.walkSpeed = this.baseWalkSpeed * 1.8
    this.runSpeed = this.baseRunSpeed * 1.8
  }

  randomAction() {
    if (this.isObjectType() || this.isTransforming) {
      this.currentAction = "idle"
      this.velocityX = 0
      this.animator.set("idle")
      return
    }

    const pool = this.starActive
  ? ["run", "run", "run", "walk", "jump"]
  : ["idle", "idle", "idle", "walk", "walk", "run", "jump"]

    const action = pool[Math.floor(Math.random() * pool.length)]

    if (action === "jump" && this.onGround) {
      this.jump()
      return
    }

    this.setAction(action)
  }

  setAction(action) {
    if (this.isObjectType() || this.isTransforming) {
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
    if (this.isObjectType() || this.isTransforming) return
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

  updateTransformation(delta) {
    this.transformTimer += delta
    this.transformBlinkTimer += delta

    if (this.transformBlinkTimer >= this.transformInterval) {
      this.transformBlinkTimer = 0

      const showingTarget = this.form === this.transformFromForm
      const nextForm = showingTarget ? this.transformToForm : this.transformFromForm

      const sprite = this.sprites[nextForm]
      const config = this.animationConfig.forms[nextForm]

      this.form = nextForm
      this.sprite = sprite
      this.animator.setForm(sprite, config)
      this.animator.set("idle")
      this.renderHeight = config.frameHeight * config.scale
    }

    if (this.transformTimer >= this.transformDuration) {
      this.isTransforming = false
      this.applyForm(this.transformToForm, this.pendingModifiers)
      this.animator.set("idle")
    }
  }

  updateStar(delta) {
    if (!this.starActive) {
      this.walkSpeed = this.baseWalkSpeed
      this.runSpeed = this.baseRunSpeed
      return
    }

    this.starTimer += delta

    if (this.starTimer >= this.starDuration) {
      this.starActive = false
      this.starTimer = 0

      this.walkSpeed = this.baseWalkSpeed
      this.runSpeed = this.baseRunSpeed
    }
  }

  update(delta) {
    this.updateStar(delta)

    if (this.isTransforming) {
      this.updateTransformation(delta)
      this.animator.update(delta)
      return
    }

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
      {
        grayscale: this.isObjectType(),
        star: this.starActive,
        starPhase: this.starTimer
      }
    )
  }
}