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

const towerTransparent = false

const test_scene = {
	towers: [
		{ team: TEAM_3, tier: TIER_1, power: 8, pos: { x: 100, y: 100 } },
		{ team: TEAM_3, tier: TIER_1, power: 8, pos: { x: 250, y: 150 } },
		{ team: TEAM_1, tier: TIER_2, power: 25, pos: { x: 300, y: 400 } },
		{ team: TEAM_2, tier: TIER_3, power: 80, pos: { x: 500, y: 300 } },
		{ team: TEAM_4, tier: TIER_3, power: 120, pos: { x: 300, y: 600 } },
	]
}

/** @type {Game} */
let game
let centerX, centerY
/** @type {Tower} */
let selected
let torreID = 1
let pathBallID = 1

// ===============================
// ================ MAIN FUNCTIONS
// ===============================

function setup () {
	createCanvas(windowWidth, windowHeight)

	centerX = width / 2
	centerY = height / 2

	game = new Game(TEAM_1)

	loadScene(test_scene)
}

function draw () {
	background(28)

	game.draw()
}

function mousePressed () {
	let temp = game.getTower()

	if (temp) {// && game.myTeam == temp.team) {
		temp.selected = true
		game.addLine(temp.pos.x, temp.pos.y, temp.color)
		selected = temp
	} else {
		game.addLine(mouseX, mouseY, color(255, 150))
	}
}

function mouseReleased () {
	if (selected) {
		let temp = game.getTower()

		if (temp) {
			game.addPath(selected, temp)
		}

		selected.selected = false
		selected = undefined
	} else {
		game.line.destruct(game.myTeam)
	}
	game.line = null
}

// =================================
// ================ OTHERS FUNCTIONS
// =================================

function loadScene (scene) {
	for (let t of scene.towers) {
		game.addTower(t.pos.x, t.pos.y, t.tier, t.team, t.power)
	}
}
