const vertexs = 20
const circles = []
const variation = 2
const movementLevel = 0.25

class Tower {
	constructor(x, y, tier, team, power) {
		this.pos = createVector(x, y)
		this.color = color(colors[ team ])
		this.borderColor = lerpColor(this.color, color(0), .5)

		this.selected = false

		this.max = 60

		this.tick = 0

		this.tier = tier
		this.team = team
		this.power = power

		this.id = torreID

		this.paths = []
		this.points = []

		this.diameter = 60 + this.power / 3
		this.r = this.diameter / 2
		this.minSizeVariation = this.r - variation
		this.maxSizeVariation = this.r + variation

		for (let i = 0; i < vertexs; i++) {
			this.points.push(random(this.r - movementLevel, this.r + movementLevel))
		}

		this.update()
	}

	draw () {
		// noStroke()
		// fill(this.color)
		// circle(this.pos.x, this.pos.y, this.diameter)

		// =============== Shape
		strokeWeight(3)
		noFill() // fill(this.color)
		stroke(this.selected ? this.color : this.borderColor)

		beginShape()

		for (let i in this.points) {
			let m = map(i, 0, vertexs, 0, TWO_PI)
			vertex(this.pos.x + (this.points[ i ] * sin(m)), this.pos.y + (this.points[ i ] * cos(m)))
		}

		endShape(CLOSE)

		// =============== Power
		// strokeWeight(2)
		// stroke(0, 150)
		noStroke()
		textStyle(BOLD)
		fill(this.borderColor)
		text(this.power, this.pos.x, this.pos.y)

		this.update()
	}

	update () {
		this.diameter = 60 + this.power / 3
		this.r = this.diameter / 2
		this.minSizeVariation = this.r - variation
		this.maxSizeVariation = this.r + variation

		for (let i in this.points) {
			this.points[ i ] = random(this.points[ i ] - movementLevel, this.points[ i ] + movementLevel)

			if (this.points[ i ] < this.minSizeVariation) this.points[ i ] = this.minSizeVariation
			else if (this.points[ i ] > this.maxSizeVariation) this.points[ i ] = this.maxSizeVariation
		}

		if (this.tick >= prod[ this.tier ]) {
			this.tick = 0
			if (this.power < this.max) this.power++
		} else this.tick++
	}

	intersect (x, y, r) {
		if (dist(this.pos.x, this.pos.y, x, y) < r + this.r / 2) return true

		return false
	}
}