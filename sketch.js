//Created by Tony Arntsen. Using neat library from Code bullet
//Using Box2d library
//note //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
//this means that there is some information specific to the game to input here


let world;
let otherworld;
let boundaries = [];
let boxes = [];
let enemies = [];

var nextConnectionNo = 1000;
var population;
var speed = 60;

var runningDuck;
var crate;

var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;


var showBrain = true;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp; //player
var destroyWorld = false;

var showNothing = false;

//--------------------------------------------------------------------------------------------------------------------------------------------------
function preload() {
  runningDuck = loadGif("graphics/Duck/Running.gif");
  crate = loadImage("graphics/Objects/crate.png");
}

function setup() {
  window.canvas = createCanvas(1000, 600);
  world = createWorld();
  otherworld = createWorld();
  // Add a bunch of fixed boundaries
  boundaries.push(new Boundary(0, height - 5, width * 2, 10));
  boundaries.push(new Boundary(0, 0, 5, height * 2));
  boundaries.push(new Boundary(width, 0, width - 5, height * 2));
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  population = new Population(10);
}

function detectCollisions() {
  let obj1;
  let obj2;
  // Reset collision state of all objects
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].isCollidingwith = "asdasd";
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].isCollidingwith = "asd";
  }

  // Start checking for collisions
  for (let i = 0; i < boxes.length; i++) {
    obj1 = boxes[i];
    for (let j = 0; j < enemies.length; j++) {
      obj2 = enemies[j];
      // Compare object1 with object2
      if (rectIntersect(obj1, obj2)) {
        if (obj1.dead === false && obj2.dead === false) {
          obj2.isCollidingWith = obj1.id;
          console.log(obj2.isCollidingWith);
        }
      }
    }
  }
}

function rectIntersect(obj1, obj2) {
  // Check x and y for overlap
  if (obj2.x > obj1.w + obj1.x || obj1.x > obj2.w + obj2.x || obj2.y > obj1.h + obj1.y || obj1.y > obj2.h + obj2.y) {
    return false;
  }
  return true;
}

function removeAllStuff() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].killBody();
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].killBody();
  }
  boxes = [];
  enemies = [];
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function draw() {
  detectCollisions();
  background(51);
  //Box2D stuff:
  // We must always step through time!
  let timeStep = 1.0 / 30;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);
  // Display all the boundaries
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].display();
  }

  // Display all the boxes
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].display();
    if (boxes[i].done()) {
      boxes.splice(i, 1);
    }
  }

  drawToScreen();
  if (showBestEachGen) { //show the best of each gen
    showBestPlayersForEachGeneration();
  } else if (humanPlaying) { //if the user is controling the ship[
    showHumanPlaying();
  } else if (runBest) { // if replaying the best ever game
    showBestEverPlayer();
  } else { //if just evolving normally
    if (!population.done()) { //if any players are alive then update them
      population.updateAlive();
    } else { //all dead
      //genetic algorithm
      population.naturalSelection();
    }
  }
}
//-----------------------------------------------------------------------------------
function showBestPlayersForEachGeneration() {
  if (!genPlayerTemp.dead) { //if current gen player is not dead then update it

    genPlayerTemp.look();
    genPlayerTemp.think();
    genPlayerTemp.update();
    genPlayerTemp.show();
  } else { //if dead move on to the next generation
    upToGen++;
    if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
      upToGen = 0;
      showBestEachGen = false;
    } else { //if not at the end then get the next generation
      genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
    }
  }
}
//-----------------------------------------------------------------------------------
function showBestEverPlayer() {
  if (!population.bestPlayer.dead) { //if best player is not dead
    population.bestPlayer.look();
    population.bestPlayer.think();
    population.bestPlayer.update();
    population.bestPlayer.show();
  } else { //once dead
    runBest = false; //stop replaying it
    population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//draws the display screen
function drawToScreen() {
  if (!showNothing) {
    //pretty stuff
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    drawBrain();
    writeInfo();
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing
  var startX = 0; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  var startY = 0;
  var w = 0;
  var h = 0;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
    if (humanPlaying) {
      showBrain = false;
    } else if (showBestEachGen) {
      genPlayerTemp.brain.drawGenome(startX, startY, w, h);
    } else {
      population.players[0].brain.drawGenome(startX, startY, w, h);
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//writes info about the current player
function writeInfo() {
  fill(200);
  textAlign(LEFT);
  textSize(30);
  if (showBestEachGen) {
    text("Score: " + genPlayerTemp.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    text("Gen: " + (genPlayerTemp.gen + 1), 1150, 50);
  } else
    if (runBest) {
      text("Score: " + population.bestPlayer.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      text("Gen: " + population.gen, 1150, 50);
    } else {
      if (showBest) {
        text("Score: " + population.players[0].score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
        text("Gen: " + population.gen, 1150, 50);
        text("Species: " + population.species.length, 50, canvas.height / 2 + 100);
        text("Global Best Score: " + population.bestScore, 50, canvas.height / 2 + 200);
      }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------
function mouseClicked() {
  let b = new Box(mouseX, mouseY);
  boxes.push(b);
  // prevent default
  return false;
}

function keyPressed() {
  switch (key) {
    case ' ':
      //toggle showBest
      showBest = !showBest;
      break;
    // case '+': //speed up frame rate
    //   speed += 10;
    //   frameRate(speed);
    //   prvarln(speed);
    //   break;
    // case '-': //slow down frame rate
    //   if(speed > 10) {
    //     speed -= 10;
    //     frameRate(speed);
    //     prvarln(speed);
    //   }
    //   break;
    case 'B': //run the best
      runBest = !runBest;
      break;
    case 'G': //show generations
      showBestEachGen = !showBestEachGen;
      upToGen = 0;
      genPlayerTemp = population.genPlayers[upToGen].clone();
      break;
    case 'N': //show absolutely nothing in order to speed up computation
      showNothing = !showNothing;
      break;
  }
  //any of the arrow keys
  switch (keyCode) {
    case UP_ARROW: //the only time up/ down / left is used is to control the player
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case DOWN_ARROW:
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case LEFT_ARROW:
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case RIGHT_ARROW: //right is used to move through the generations

      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        }
      } else if (humanPlaying) { //if the user is playing then move player right

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      }
      break;
  }
}
