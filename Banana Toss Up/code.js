//Variables Declared with Initial Values
var dBasket = 50;
var yBasket = 65;
var xBasket;
var hGorilla = 50;
var wGorilla = 70;
var yGorilla = 400;
var xGorilla;
var gorillaSpeed;
var yBanana;
var xBanana;
var yMotion;
var xMotion;
var score;
var life;
var dBanana = 36;
var moveRight;
var moveLeft;
var isReset;
var bounce;

//Start Button Event Handler
onEvent("start_button", "click", function(event) {
  setScreen("play_screen");
  score = 0;
  life = 3;
  reset();
  timedLoop(22, updateScreen); // updates the screen giving a rate of 45 fps
});

//Restart Button Event Handler
onEvent("restart", "click", function(event) {
  setScreen("start_screen");
});

//Key Down Event Handler
onEvent("play_screen", "keydown", function(event) {
  if (event.key == "Left") {
    moveLeft = true;
  } else if(event.key == "Right"){
    moveRight = true;
  }
});

//Key Up Event Handler
onEvent("play_screen", "keyup", function(event) {
  if (event.key == "Left") {
    moveLeft = false;
  } else if(event.key == "Right"){
    moveRight = false;
  }
});

//Space Key Event Handler
onEvent("play_screen", "keypress", function(event) {
  if (event.key == " " && isReset) {
    gameStart();
  }
});

//Updates Location of Object and Text
function updateScreen() {
  moveGorilla();
  checkBounce();
  hitBasket();
  xBanana += xMotion;
  yBanana += yMotion;
  xGorilla += gorillaSpeed;
  setText("lives", life);
  setText("score", score);
  setPosition("gorilla", xGorilla, yGorilla);
  setPosition("basket", xBasket, yBasket);
  setPosition("banana", xBanana, yBanana);
}

//Resets Game and Checks for Game Over Conditions
function reset() {
  xMotion = 0;
  yMotion = 0;
  gorillaSpeed = 0;
  moveRight = false;
  moveLeft = false;
  isReset = true;
  showElement("spaceToStart");
  xBanana = 140;
  yBanana = 215;
  bounce = true;
  xBasket = 135;
  xGorilla = 125;
  if (life == -1) {
    gameStop();
  }
}

//Checks to see if the banana has hit any walls and should bounce or 
//if the banana has gone below the gorilla and a life should be lost
function checkBounce() {
  if (xBanana < 0 || xBanana + dBanana > 320) {
    xMotion = -xMotion;
  } else if (yBanana < 0 && !bounce) {
    yMotion = -yMotion;
    bounce = true;
  }
  if (checkCollision(xBanana, yBanana, dBanana, dBanana, xGorilla, yGorilla, hGorilla, wGorilla) && bounce) {
    yMotion = -yMotion;
    bounce = false;
  }
  if (yBanana + dBanana > 450){
    life--;
    reset();
  }
}

//Checks to see if the basket has been hit, adding to score
function hitBasket() {
  if (checkCollision(xBanana, yBanana, dBanana, dBanana, xBasket, yBasket, dBasket, dBasket)) {
    if (yMotion < 0 && yMotion > -20) {
      yMotion--;
    } else if (yMotion > 0 && yMotion < 20) {
      yMotion++;
    }
    if (xMotion < 0 && xMotion > -20) {
      xMotion--;
    } else if (xMotion > 0 && xMotion < 20) {
      xMotion++;
    }
    score++;
    xBasket = 500;
    setTimeout(function() {
      xBasket = randomNumber(0,320 - dBasket);
    }, 2000);
  }
}

//Sets the conditions for moving the gorilla
function moveGorilla() {
  if (moveLeft && !moveRight && xGorilla > 0) {
    gorillaSpeed = -6;
  } else if (moveRight && !moveLeft && xGorilla + wGorilla < 320) {
    gorillaSpeed = 6;
  } else {
    gorillaSpeed = 0;
  }
}

//Sets initial movement at the start of the game
function gameStart() {
  hideElement("spaceToStart");
  xMotion = randomNumber(-6,6);
  yMotion = randomNumber(1,6);
  isReset = false;
}

//Ends the Game
function gameStop() {
  stopTimedLoop();
  setText("score_final", score);
  setScreen("lose_screen");
}

//Checks to see if two objects have collided (Not Independently Developed)
function checkCollision(x1, y1, h1, w1, x2, y2, h2, w2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

//Image Sources:
// Gorilla: http://cbl-gorilla.cs.technion.ac.il/pics/gorilla.gif
// Banana: https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Bananas.svg/2000px-Bananas.svg.png
// Jungle: http://vectorpage.com/uploads/2013/10/Cartoon-jungle-background-07.jpg
// Basket: http://www.clker.com/cliparts/4/2/3/d/11954329291743204660panier-shopping_basket_a_01.svg.hi.png
