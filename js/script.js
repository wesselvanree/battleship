var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [{
			locations: [0, 0, 0],
			hits: ["", "", ""]
		},
		{
			locations: [0, 0, 0],
			hits: ["", "", ""]
		},
		{
			locations: [0, 0, 0],
			hits: ["", "", ""]
		}
	],

	fire: function (guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// checks if the ship has been hit before
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				// when a ship has been hit 3 times
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	// checks if the ship has been hit 3 times
	isSunk: function (ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	// creates locations of the ships
	generateShipLocations: function () {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}

		// show where the ships are located in console
		console.log("Ships array: ");
		console.log(this.ships);
	},

	// makes sure the ship is 3 coordinates next to each other
	generateShip: function () {
		var direction = Math.floor(Math.random() * 2); // randomizes horizontal or vertical ship
		var row, col;

		if (direction === 1) { // horizontaal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // verticaal
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}


		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {

			// horizontal ship
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			}

			// vertical ship
			else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	// makes sure ships can't have the same coordinates
	collision: function (locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

// pictures and text in messageArea
var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

};

// checks the guess
var controller = {
	guesses: 0,

	processGuess: function (guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);

			// if amount of sunk ships is equal to the amount of ships you won
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
				alert("you won, it took you " + this.guesses + " guesses")
			}
		}
	}
}

// processing guess
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	// guess isn't on the board or longer than 2 characters
	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		// when row or column is not a number
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
			column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// all events

// fire button onclick event
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

// allows the user to use the enter key for firing a torpedo
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// makes sure it gets to the eventlistener correctly
	e = e || window.event;

	// "e.keycode === 13" means the "enter" key
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}


// init(=initialize) means that it happens if †he page is loaded
window.onload = init;

function init() {
	// event for firing with button
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// event for firing with enter key
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place ships on gameboard
	model.generateShipLocations();
}
