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
		this.live = true

		this.tick = 0

		this.tier = tier
		this.team = team
		this.power = power
		this.max = maxs[ this.tier ]

		this.id = torreID

		this.relations = []
		this.points = []
		this.paths = []

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
		fill(28) // noFill()
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

		if (this.tick == prod[ this.tier ] / 2) {
			this.pulse()
		}

		if (this.tick >= prod[ this.tier ] && this.live) {
			this.tick = 0
			this.addPower(this)

			this.pulse()
		} else this.tick++
	}

	intersect (x, y, r) {
		if (dist(this.pos.x, this.pos.y, x, y) < r + this.r / 2) return true

		return false
	}

	pulse () {
		// Adicionar pulso nos paths
		for (let p of this.paths) {
			let path = game.findPath(p)
			path.pulse()
		}
	}

	/**
	 * 
	 * @param {number} value 
	 * @param {Tower} tower 
	 */
	addPower (tower) {
		if (this.power <= this.max) this.power += tower.team == this.team ? 1 : -1
		if (this.power <= 0 && tower) {
			if (this.power < 0) this.power = 0
			this.changeTeam(tower.team)
		}
	}


	changeTeam (team) {
		this.team = team
		this.color = color(colors[ team ])
		this.borderColor = lerpColor(this.color, color(0), .5)

		for (let id of this.paths) {
			game.findPath(id).changeBallsColors()
		}
	}

	removePath (id) {
		for (let i = 0; i < this.paths.length; i++) {
			if (this.paths[ i ] == id) {
				this.paths.splice(i, 1)
				break
			}
		}
	}
}