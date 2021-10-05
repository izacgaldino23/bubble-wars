const TEAM_0 = 0
const TEAM_1 = 1
const TEAM_2 = 2
const TEAM_3 = 3
const TEAM_4 = 4

const TIER_1 = 0
const TIER_2 = 1
const TIER_3 = 2

const colors = [ '#9e9e9e', '#2196f3', '#ff9800', '#4caf50', '#f44336' ]
const up = [ 10, 30, 120 ] // Poder necessário para upar
const maxs = [ 15, 35, 125 ] // Maximos predefinidos
const prod = [ 100, 80, 60 ] // Ticker de produção por tier 

const circlePathSize = 15
const maxAnim = 50
const pulseBall = 3

const test_scene = {
	towers: [
		{ team: TEAM_3, tier: TIER_1, power: 8, pos: { x: 100, y: 100 } },
		{ team: TEAM_1, tier: TIER_2, power: 25, pos: { x: 300, y: 400 } },
		{ team: TEAM_2, tier: TIER_3, power: 80, pos: { x: 500, y: 300 } },
		{ team: TEAM_4, tier: TIER_2, power: 120, pos: { x: 300, y: 600 } },
	]
}

let game
let centerX, centerY
let selected
let torreID = 1
let pathID = 1
let pathBallID = 1

// ===============================
// ================ MAIN FUNCTIONS
// ===============================

function setup () {
	createCanvas(windowWidth, windowHeight)

	centerX = width / 2
	centerY = height / 2

	game = new Game()

	loadScene(test_scene)
}

function draw () {
	background(28)

	game.draw()
}

function mousePressed () {
	let temp = game.getTowerID()
	if (temp) {
		selected = temp
	}
}

function mouseReleased () {
	if (selected) {
		let temp = game.getTowerID()

		game.addPath(selected, temp)

		selected = undefined
	}
}

// =================================
// ================ OTHERS FUNCTIONS
// =================================

function loadScene (scene) {
	for (let t of scene.towers) {
		game.addTower(t.pos.x, t.pos.y, t.tier, t.team, t.power)
	}
}

// ========================
// ================ CLASSES
// ========================

class Game {
	/** @type {Array<Tower>} */
	towers

	/** @type {Array<Path>} */
	paths

	constructor() {
		this.towers = []
		this.paths = []
	}

	draw () {
		// Draw paths
		strokeWeight(4)
		for (let i in this.paths) {
			this.paths[ i ].draw()
		}

		// Draw towers
		textAlign(CENTER, CENTER)
		textSize(16)
		for (let i in this.towers) {
			this.towers[ i ].draw()
		}
	}

	update () {

	}

	addTower (x, y, tier, team, power) {
		this.towers.push(new Tower(x, y, tier, team, power))
		torreID++
	}

	addPath (tower1, tower2) {
		let temp = tower1.paths.find(p => p == tower2.id)
		if (temp) return
		this.paths.push(new Path(tower1, tower2))
	}

	getTowerID () {
		return this.towers.find(t => dist(mouseX, mouseY, t.pos.x, t.pos.y) <= t.r)
	}

	findTower (id) {

	}
}

class Tower {
	constructor(x, y, tier, team, power) {
		this.pos = createVector(x, y)
		this.color = color(colors[ team ])
		this.borderColor = lerpColor(this.color, color(0), .5)

		this.max = 60

		this.tick = 0

		this.tier = tier
		this.team = team
		this.power = power

		this.id = torreID

		this.paths = []

		this.update()
	}

	draw () {
		// strokeWeight(3)
		// stroke(this.borderColor)
		noStroke()
		fill(this.color)
		// noFill()
		circle(this.pos.x, this.pos.y, this.r)

		// strokeWeight(2)
		// stroke(0, 150)
		noStroke()
		textStyle(BOLD)
		fill(this.borderColor)
		text(this.power, this.pos.x, this.pos.y)

		this.update()
	}

	update () {
		this.r = 60 + this.power / 3

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

		this.pointT1 = createVector(this.tower1.pos.x + (this.tower1.r / 2) * cos(this.angleT1), this.tower1.pos.y + (this.tower1.r / 2) * sin(this.angleT1))
		this.pointT2 = createVector(this.tower2.pos.x + (this.tower2.r / 2) * cos(this.angleT2), this.tower2.pos.y + (this.tower2.r / 2) * sin(this.angleT2))

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
			let newColor = lerpColor(this.tower1.color, this.tower2.color, m)

			let temp = new PathBall(
				x,
				y,
				color(colors[ this.tower1.team ]),// newColor,
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