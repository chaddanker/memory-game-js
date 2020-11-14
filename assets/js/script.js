let gameSettings = {
	animationSpeed: 2,
	tileColor: {
		normal: 'rgb(255, 81, 0)',
		flipped: 'white',
	},
	difficulty: {
		easy: 12,
		medium: 20,
		hard: 30,
	},
	icons: [
		'coffee',
		'sun',
		'tree',
		'bug',
		'comment alternate',
		'paper plane',
		'coffee',
		'sun',
		'tree',
		'bug',
		'comment alternate',
		'paper plane',
	],
};

const shuffledIcons = shuffle(gameSettings.icons);
const { animationSpeed } = gameSettings;
let current = -1;
let prev = -1;
let touched = false;
let matches = [];
let gameTime = 0;
let gameTimeId = null;

const Tiles = numberOfTiles => {
	return [...Array(numberOfTiles)].map((_, i) => {
		return i;
	});
};

window.addEventListener('DOMContentLoaded', () => {
	const tiles = Tiles(gameSettings.difficulty.easy);
    init(tiles);
});

function init(tiles) {
	tiles.map((_, i) => {

		var node = document.createElement("div"); 

		node.classList.add(`tile-${i}`, 'tile', 'rotated');

		node.addEventListener('click', event => _onClick(event, i));

		document.querySelector('.tile-container').appendChild(node); 	
	});
};

function _onClick(event, i) {
	// if tile is clicked twice, return
	if(!touched) { // first time touched
		touched = true; 
		startTimer();
	}
	const { target } = event;

	prev = current === -1 ? -1 : current;
	current = i;
	if(matches.indexOf(current) !== -1) {
		return;
	}
	flip(target, i);
	if(
		isMatch(prev, current) 
		&& matches.indexOf(prev) === -1
		&& matches.indexOf(current) === -1
		&& prev !== current
	) {
		matches = [...matches, prev, current];

		setTimeout(() => {
			matches.map(match => {
				if(document.querySelector(`.tile-${match}`).innerHTML === '') {
					flip(document.querySelector(`.tile-${match}`), match);
				}
			});
		}, 1200 / animationSpeed);
		matches.length === gameSettings.icons.length ? endGame() : null;
		return;
	}
	flipBack(target);
}

function flip(target, i) {
	target.style.transform = `rotate3d(0, 1, 0, ${0}deg)`;
	target.style.backgroundColor = gameSettings.tileColor.flipped;
	setTimeout(() => {
		target.innerHTML = `<i class="ui icon huge ${shuffledIcons[i]}"></i>`;
	}, 200 / animationSpeed); 
}

function flipBack(target) {
	setTimeout(() => {
		target.style.transform = `rotate3d(0, 1, 0, ${180}deg)`;
		target.style.backgroundColor = gameSettings.tileColor.normal;
		setTimeout(() => {
			target.innerHTML = '';
		}, 150 / animationSpeed);
	}, 1213 / animationSpeed);	
}

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5);
}

function isMatch(prev, current) {
	return gameSettings.icons[prev] === gameSettings.icons[current] ? true : false;
}

function startTimer() {
	gameTimeId = setInterval(() => {
		gameTime += 1;
		document.querySelector('#time').innerText = `${String(gameTime)}s`;
	}, 1000);
}

function stopTimer() {
	clearInterval(gameTimeId);
}

function endGame() {
	stopTimer();
	postScore();
}

const postScore = () => {
	const postScoreQuery = `
						mutation {
							newscore(
							email: "chaddanker@gmail.com",
							score: ${Number(gameTime)},
							name: "Chad Danker"
							) {
								id
							}
						}`;
	const options = {
		method: "post",
		headers: {
		  "Content-Type": "application/json"
		},
		body: JSON.stringify({
		  query: postScoreQuery
		})
	};

	fetch(`http://localhost:4000`, options)
	.then(res => res.json());
}
