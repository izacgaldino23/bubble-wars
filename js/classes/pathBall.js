class PathBall {
	constructor(x, y, color, path, angle, i, forceAnim) {
		this.pos = createVector(x, y)
		this.color = color
		this.path = path
		this.center = false
		this.fixed = false

		this.angle = angle + PI / 2

		this.frame = maxAnim / 2
		this.up = true
		this.direction = 1
		this.mult = random(0.5, 2)
		this.delay = i
		this.alpha = 0

		this.pulseFrame = floor(map(forceAnim, 0, 1, pulseBall + 1, maxAnim))
		this.plusPulse = 0
		this.pulsing = false

		this.posAnim1 = createVector(cos(this.angle), sin(this.angle)).mult(0.05)
		this.color.setAlpha(0)

		this.id = pathBallID
		pathBallID++
	}

	draw () {
		if (this.delay > 0) {
			this.delay--
			return
		}

		noStroke()
		fill(this.color)

		circle(this.pos.x, this.pos.y, circlePathSize + this.plusPulse)

		this.update()
	}

	update () {
		if (this.frame >= maxAnim && this.up) {
			this.up = false
			this.direction = -1
		} else if (this.frame <= 0 && !this.up) {
			this.up = true
			this.direction = 1
		}

		this.pulsing = this.frame <= pulseBall
		this.plusPulse += (this.pulsing ? 1 : -1)
		if (this.plusPulse < 0) this.plusPulse = 0

		this.frame += this.direction
		this.pulseFrame += this.direction

		if (this.alpha < 255) {
			this.alpha += 10
			this.color.setAlpha(this.alpha)
		}

		if (!this.fixed) {
			if (this.up) this.pos.add(this.posAnim1)
			else this.pos.sub(this.posAnim1)
		}
	}
}