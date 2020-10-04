let gameSettings = {
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
	if(!touched) { // first time touched
		touched = true; 
		startTimer();
	}
	const { target } = event;
	prev = current === -1 ? -1 : current;
	current = i;
	flip(target, i);
	if(isMatch(prev, current)) {
		matches = [...matches, prev, current];
		console.log(matches);
		setTimeout(() => {
			matches.map(match => {
				if(document.querySelector(`.tile-${match}`).innerHTML === '') {
					flip(document.querySelector(`.tile-${match}`), match);
				}
			});
		}, 1200);
		matches.length === gameSettings.icons.length ? stopTimer() : null;
		return;
	}

	flipBack(target);
}

function flip(target, i) {
	target.style.transform = `rotate3d(0, 1, 0, ${0}deg)`;
	target.style.backgroundColor = gameSettings.tileColor.flipped;
	setTimeout(() => {
		target.innerHTML = `<i class="ui icon huge ${shuffledIcons[i]}"></i>`;
	}, 200); 
}

function flipBack(target) {
	setTimeout(() => {
		target.style.transform = `rotate3d(0, 1, 0, ${180}deg)`;
		target.style.backgroundColor = gameSettings.tileColor.normal;
		setTimeout(() => {
			target.innerHTML = '';
		}, 150);
	}, 1213);	
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