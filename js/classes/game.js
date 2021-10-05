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

	/**
	 * 
	 * @returns {Tower}
	 */
	getTower () {
		return this.towers.find(t => dist(mouseX, mouseY, t.pos.x, t.pos.y) <= t.r)
	}

	findTower (id) {

	}
}
