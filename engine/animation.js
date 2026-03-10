export class Animator {
  constructor(sprite, formConfig) {
    this.sprite = sprite
    this.setFormConfig(formConfig)

    this.current = "idle"
    this.frameIndex = 0
    this.timer = 0
  }

  setFormConfig(formConfig) {
    this.formConfig = formConfig
    this.animations = formConfig.animations
    this.frameWidth = formConfig.frameWidth
    this.frameHeight = formConfig.frameHeight
    this.scale = formConfig.scale
  }

  setSprite(newSprite) {
    this.sprite = newSprite
  }

  setForm(sprite, formConfig) {
    this.sprite = sprite
    this.setFormConfig(formConfig)
    this.current = "idle"
    this.frameIndex = 0
    this.timer = 0
  }

  set(animation) {
    const next = this.animations[animation] ? animation : "idle"

    if (this.current !== next) {
      this.current = next
      this.frameIndex = 0
      this.timer = 0
    }
  }

  update(delta) {
    const anim = this.animations[this.current]
    if (!anim) return

    const frameCount = anim.cells ? anim.cells.length : anim.frames.length

    this.timer += delta

    if (this.timer >= anim.speed) {
      this.frameIndex = (this.frameIndex + 1) % frameCount
      this.timer = 0
    }
  }

  draw(ctx, x, y, direction = 1, options = {}) {
    const anim = this.animations[this.current]
    if (!anim || !this.sprite) return

    let sx = 0
    let sy = 0

    if (anim.cells) {
      const [col, row] = anim.cells[this.frameIndex]
      sx = col * this.frameWidth
      sy = row * this.frameHeight
    } else {
      const frame = anim.frames[this.frameIndex]
      sx = frame * this.frameWidth
      sy = anim.row * this.frameHeight
    }

    const drawWidth = this.frameWidth * this.scale
    const drawHeight = this.frameHeight * this.scale

    ctx.save()

    if (options.grayscale) {
      ctx.filter = "grayscale(100%) brightness(0.85) contrast(1.15)"
    }

    if (direction === -1) {
      ctx.translate(x + drawWidth, y)
      ctx.scale(-1, 1)

      ctx.drawImage(
        this.sprite,
        sx,
        sy,
        this.frameWidth,
        this.frameHeight,
        0,
        0,
        drawWidth,
        drawHeight
      )
    } else {
      ctx.drawImage(
        this.sprite,
        sx,
        sy,
        this.frameWidth,
        this.frameHeight,
        x,
        y,
        drawWidth,
        drawHeight
      )
    }

    ctx.restore()
  }
}