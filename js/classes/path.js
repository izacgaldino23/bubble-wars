class Path {
	/** @type {Array<PathBall>} */
	balls

	/**
	 * @param tower1 {Tower}
	 * @param tower2 {Tower}
	 */
	constructor(tower1, tower2) {
		this.tower1 = tower1
		this.tower2 = tower2
		this.balls = []

		this.angleT1 = atan2(this.tower2.pos.y - this.tower1.pos.y, this.tower2.pos.x - this.tower1.pos.x)
		this.angleT2 = atan2(this.tower1.pos.y - this.tower2.pos.y, this.tower1.pos.x - this.tower2.pos.x)

		this.pointT1 = createVector(this.tower1.pos.x + (this.tower1.r + circlePathSize * 1.5) * cos(this.angleT1), this.tower1.pos.y + (this.tower1.r + circlePathSize * 1.5) * sin(this.angleT1))
		this.pointT2 = createVector(this.tower2.pos.x + (this.tower2.r + circlePathSize * 1.5) * cos(this.angleT2), this.tower2.pos.y + (this.tower2.r + circlePathSize * 1.5) * sin(this.angleT2))

		let middleX = (this.pointT1.x + this.pointT2.x) / 2
		let middleY = (this.pointT1.y + this.pointT2.y) / 2

		this.middle = createVector(middleX, middleY)
		this.size = dist(this.pointT1.x, this.pointT1.y, this.pointT2.x, this.pointT2.y)

		this.steps = floor(this.size / (circlePathSize * 1.5))

		tower1.paths.push(tower2.id)
		tower2.paths.push(tower1.id)

		this.generateBalls()
	}

	draw () {
		// Draw balls
		for (let i in this.balls) {
			this.balls[ i ].draw()
		}

		stroke(255)
		noFill()
		// circle(this.pointT1.x, this.pointT1.y, 20)
		// circle(this.pointT2.x, this.pointT2.y, 20)
	}

	generateBalls () {
		let middle = floor(this.steps / 2)

		for (let i = 0; i <= this.steps; i++) {
			let m = map(i, 0, this.steps, 0, 1)
			let x = lerp(this.pointT1.x, this.pointT2.x, m)
			let y = lerp(this.pointT1.y, this.pointT2.y, m)
			// let newColor = lerpColor(this.tower1.color, this.tower2.color, m)
			let newColor = lerpColor(this.tower1.borderColor, this.tower1.color, m)

			let temp = new PathBall(
				x,
				y,
				// color(colors[ this.tower1.team ]),
				newColor,
				this,
				atan2(this.tower2.pos.y - this.tower1.pos.y, this.tower2.pos.x - this.tower1.pos.x),
				i * 4,
				(m <= 0.5 ? m : 0.5 - (m - 0.5)) / 0.5,
			)

			if (i == middle) {
				temp.center = true
			}
			if (i == 0 || i == this.steps) {
				temp.fixed = true
			}

			this.balls.push(temp)
		}
	}
}