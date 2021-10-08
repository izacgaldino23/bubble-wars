const sizeVariation = 3
const maxAnim = 50
const circlePathSize = 15

class PathBall {
	/** @type {Path} */
	path

	constructor(x, y, color, path, angle, i, forceAnim, last) {
		this.pos = createVector(x, y)
		this.color = color
		this.path = path
		this.center = false
		this.fixed = false
		this.last = last

		this.angle = angle + PI / 2

		this.frame = maxAnim / 2
		this.up = true
		this.direction = 1
		this.mult = random(0.5, 2)
		this.delay = i
		this.alpha = 0

		this.pulseFrame = floor(map(forceAnim, 0, 1, sizeVariation + 1, maxAnim))
		this.plusPulse = 0
		this.pulsing = false

		this.posAnim1 = createVector(cos(this.angle), sin(this.angle)).mult(0.05)
		this.color.setAlpha(0)

		this.id = pathBallID
		pathBallID++

		this.r = random(circlePathSize - sizeVariation, circlePathSize + sizeVariation)
	}

	draw () {
		if (this.delay > 0) {
			this.delay--
			return
		}

		// noStroke()
		// fill(this.color)
		noFill()
		strokeWeight(2)
		stroke(this.color)

		circle(this.pos.x, this.pos.y, this.r + this.plusPulse)

		this.update()
	}

	update () {
		if (this.frame >= maxAnim) {
			this.up = false
		} else if (this.frame <= 0) {
			this.up = true
		}

		if (this.pulsing) {
			this.plusPulse++

			if (this.plusPulse >= sizeVariation) {
				this.pulsing = false
				let qtdBalls = this.path.balls.length

				if (this.me + 1 < qtdBalls) {
					this.path.balls[ this.me + 1 ].pulse(this.me + 1)
				} else if (this.last) {
					this.path.tower2.power--
				}
			}
		} else if (this.plusPulse > 0) {
			this.plusPulse--
		}

		this.frame += this.up ? 1 : -1

		if (this.alpha < 255) {
			this.alpha += 10
			this.color.setAlpha(this.alpha)
		}

		if (!this.fixed) {
			if (this.up) this.pos.add(this.posAnim1)
			else this.pos.sub(this.posAnim1)
		}
	}

	pulse (me) {
		this.pulsing = true
		this.me = me
	}
}