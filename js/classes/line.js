class Line {
	constructor(x, y, color) {
		this.pointA = createVector(x, y)
		this.pointB = createVector(mouseX, mouseY)
		this.color = color
		this.color.setAlpha(150)
	}

	draw () {
		this.update()

		strokeWeight(4)
		stroke(this.color)
		strokeCap(ROUND)
		line(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y)
	}

	update () {
		this.pointB.x = mouseX
		this.pointB.y = mouseY
	}

	intersect (x1, y1, x2, y2) {
		let uA, uB
		let den, numA, numB
		let interPos
		let x3 = this.pointA.x
		let y3 = this.pointA.y
		let x4 = this.pointB.x
		let y4 = this.pointB.y

		den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
		numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
		numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

		//Coincident? - If true, displays intersection in center of line segment
		if (abs(numA) == 0 && abs(numB) == 0 && abs(den) == 0) {
			let intx = (x1 + x2) / 2
			let inty = (y1 + y2) / 2
			interPos = createVector(intx, inty)

			return interPos
		}

		//Parallel? - No intersection
		if (abs(den) == 0) {
			return
		}

		//Intersection?
		uA = numA / den
		uB = numB / den

		//If both lie w/in the range of 0 to 1 then the intersection point is within both line segments.
		if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
			return
		}
		let intx = x1 + uA * (x2 - x1)
		let inty = y1 + uA * (y2 - y1)
		interPos = createVector(intx, inty)

		return interPos
	}

	destruct () {
		let paths = []
		for (let i in game.paths) {
			let pos = this.intersect(game.paths[ i ].pointT1.x, game.paths[ i ].pointT1.y, game.paths[ i ].pointT2.x, game.paths[ i ].pointT2.y)
			if (pos) {
				paths.push(i)
			}
		}

		if (paths.length > 0) {
			for (let i in paths) {
				game.paths.splice(i, 1)
			}
		}
	}
}
