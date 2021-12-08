/*******************
 * GLOBAL VARIABLES *
 *******************/

// let emotions = 
// [['Sad', 0.44], ['Fear', 0.44], ['Happy', 0.11], ['Angry', 0.0], ['Surprise', 0.0]]

let uniqueText = "War On Drugs: President Duterte is the only president who has the guts to clash with drug lords, narco-politicians, drug pushers and users in the country. War Against Terrorism: Isn't the previous administration blind here because they are afraid? Only President Duterte has the courage to consume the enemy. War on Crimes: The war on drugs has reduced crime in the country. War on Territorial Dispute: The conflict between China and the Philippines has stopped, tensions have dropped, the islands occupied by China have not increased, because of President Duterte."

let cols;
let rows;
let scale = 20;

let increment = 0.1;
let currentFrameRate;
let zOffset = 0;
let particles = [];
let flowfield;

let sliderR;
let sliderG;
let sliderB;
let sliderFlowFieldSpeed;
let sliderMag;
let sliderSpeed;

let emotionDict = {
	'Happy' : [0, 255, 0],
	'Angry' : [255, 0, 0],
	'Sad' : [0, 0, 255],
	'Surprise' : [255,255,0],
	'Fear' : [0, 0, 0]
}

// let emotionHappy = (0, 255, 0)
// let emotionAngry = (255, 0, 0)
// let emotionSad = (0, 0, 255)
// let emotionSurprise = (255,255,0)
// let emotionFear = (0, 0, 0)

let flowfieldVisible = false;
let backgroundWhite = true;

let xPos;
let yPos;

let colorRed = 0;
let colorGreen = 0;
let colorBlue = 0;
// let emotionRGB = [0,0,0];



let firstEmotion = [emotions[0][0], emotions[0][1] * 250];
let secondEmotion = [emotions[1][0], emotions[1][1] * 250 + firstEmotion[1]];
let thirdEmotion = [emotions[2][0], emotions[2][1] * 250 + secondEmotion[1]];
let fourthEmotion = [emotions[3][0], emotions[3][1] * 250 + thirdEmotion[1]];
let fifthEmotion = [emotions[4][0], emotions[4][1] * 250 + fourthEmotion[1]];
console.log('emotion list', firstEmotion, secondEmotion, thirdEmotion, fourthEmotion, fifthEmotion)


let emotionArray = [10, 30, 84, 20, 107] // happy, angry, sad, surprise, fear

/***************
 **** SETUP ****
 **************/
function setup() {
	let canvas = createCanvas(800, 600);
	canvas.parent('sketch-holder');
	if (!flowfieldVisible) {
		background(255);
	}
	
	let xPos = randomSeed(99);
	let yPos = randomSeed(99);
	
	

	//Add controls to the sketch

	// Red
	// sliderR = createSlider(0, 255, 255, 1).parent('controls');
	
	// Green
	// sliderG = createSlider(0, 255, 0, 1).parent('controls');
	
	// Blue
	// sliderB = createSlider(0, 255, 0, 1).parent('controls');
	
	
	// createP('The following slider lets you control how slow or fast the flowfield changes:').parent('controls');
	
	// flowfield change speed
	// sliderFlowFieldSpeed = createSlider(0.00005, 0.005, 0.0005, 0.00001).parent('controls');
	

	// createP('The following slider controls how much the flowfield influences the path of the particles:').parent('controls');
	// createP('Fear is black. Anger is red. Surprised is yellow. Happiness is green. Sadness is blue.').parent('controls');

	// flowfield influence
	// sliderMag = createSlider(0.1, 3, 3, 0.1).parent('controls');
	
	
	// createP('The following slider contols the speed of the particles:').parent('controls');
	
	// particle speed 
	// sliderSpeed = createSlider(0.1, 10, 10, 0.1).parent('controls');
	
	// uniquetext
	// createP('Emotion of the text').parent('controls');
	// uniqueTextValue = createP('').parent('controls');

	
	// createP('Keep an eye on the current framerate:').parent('controls');
	// framerate
	// currentFrameRate = createP('').parent('controls');

	// createP('Keep an eye on the current frameCount:').parent('controls');
	// currentFrameCount = createP('').parent('controls');
	
	// createP('Finally, press \'s\' to save a screnshot!').parent('controls');

	cols = floor(width / scale);
	rows = floor(height / scale);
	flowfield = new Array(cols * rows);

	for (let i = 0; i < 1500; i++) {
		particles[i] = new Particle();
	}
	

	//Toggle between particles and flowfield when button is clicked
	// document.querySelector(".flowfield-button").onclick = () => {
	// 	restartSketch();
	// 	flowfieldVisible = flowfieldVisible ? false : true;
	// };

	//Restart the sketch
	// document.querySelector(".clear-canvas").onclick = () => {
	// 	restartSketch();
	// };

	//Toggle background between white and black when button is clicked
	// document.querySelector(".background").onclick = () => {
	// 	if (backgroundWhite) {
	// 		background(0);
	// 		backgroundWhite = false;
	// 	} else {
	// 		background(255);
	// 		backgroundWhite = true;
	// 	}
	// };

}

/**************
 ** RESTART **
 *************/
function restartSketch() {
	clear();
	if (backgroundWhite) {
		background(255);
	} else {
		background(0);
	}
	particles = [];
	for (let i = 0; i < 5000; i++) {
		particles[i] = new Particle();
	}
}

/***************
 **** DRAW ****
 **************/
function draw() {

	
	// console.log(firstEmotion[1])
	if(frameCount < firstEmotion[1]){
		emotionRGB = emotionDict[firstEmotion[0]]
		// emotionRGB = [255, 0, 0]
		// colorRed = 255
		// colorGreen = 0
		// colorBlue = 0
	} else if (frameCount >= firstEmotion[1] && frameCount < secondEmotion[1] ) {
		emotionRGB = emotionDict[secondEmotion[0]]
		// emotionRGB = emotionDict[secondEmotion[0]]
		// colorRed = 0
		// colorGreen = 255
		// colorBlue = 0
	} else if (frameCount >= secondEmotion[1] && frameCount < thirdEmotion[1] ){
		emotionRGB = emotionDict[thirdEmotion[0]]
		// colorRed = 0
		// colorGreen = 0
		// colorBlue = 255
		// emotionRGB = emotionDict[thirdEmotion[0]]
	} else if (frameCount >= thirdEmotion[1] && frameCount < fourthEmotion[1] ){
		emotionRGB = emotionDict[fourthEmotion[0]]
		// colorRed = 0
		// colorGreen = 0
		// colorBlue = 255
		// emotionRGB = emotionDict[thirdEmotion[0]]
	} else if (frameCount >= fourthEmotion[1] && frameCount < fifthEmotion[1] ) { 
		emotionRGB = emotionDict[fifthEmotion[0]]
	} else {
		noLoop();
	}

	if (flowfieldVisible) {
		background(255);
	}
	let yoff = 0;
	for (let y = 0; y < rows; y++) {
		let xoff = 0;
		for (let x = 0; x < cols; x++) {
			let index = x + y * cols;
			let angle = noise(xoff, yoff, zOffset) * TWO_PI * 4;
			let v = p5.Vector.fromAngle(angle);
			// v.setMag(sliderMag.value());
			v.setMag(3);
			flowfield[index] = v;
			xoff += increment;

			//draw the flowfield depending on whether the button has been clicked
			if (flowfieldVisible) {
				stroke(0, 50);
				push();
				translate(x * scale, y * scale);
				rotate(v.heading());
				strokeWeight(1);
				line(0, 0, scale, 0);
				pop();
			}
		}
		yoff += increment;

		// zOffset += sliderFlowFieldSpeed.value();
		zOffset += 0.0005;
	}

	for (let particle of particles) {
		particle.follow(flowfield);
		particle.update();
		particle.edges();
		particle.show();
	}

	// currentFrameRate.html('Frame Rate : ' + floor(frameRate()));
	// currentFrameCount.html('Frame Count : ' + floor(frameCount, width / 2, height / 2));
	// uniqueTextValue.html(uniqueText);
	
	// emotions.forEach(emotion => {
	// 	var emotionName = emotion[0];
	// 	var emotionValue = emotion[1];

	// 	while(emotionValue * 1000 < frameCount){
	// 		emotionRGB = emotionDict[emotionName];
	// 	}

	// });

	
}

/*********************************
 ** Save a jpg by pressing 's' **
 *********************************/
keyReleased = function () {
	if (key == 's' || key == 'S') save('myCanvas.jpg');
};