    
// Skapar variabler på ett samlat ställe
var context;
var queue;
var WIDTH = 900;
var HEIGHT = 600;
var mouseXPosition;
var mouseYPosition;
var batImage;
var stage;
var animation;
var deathAnimation;
var spriteSheet;
var enemyXPos= Math.floor((Math.random() * 500) + 1);
var enemyYPos= Math.floor((Math.random() * 500) + 1);
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.5;
var score = 0;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;

// On load-funktionen aktiveras när sidan är färdigladdad och kör då igång koden
window.onload = function()

{

    
    // Hämtar in canvasen och dess storlek
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

   
    // Hämtar in bilder, animationer och ljud
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    

   // Här ligger alla ljud och bilder i ett objekt
    queue.loadManifest([
        {id: 'backgroundImage', src: 'assets/background.jpg'},
        {id: 'shot', src: 'assets/shot.mp3'},
        {id: 'crossHair', src: 'assets/crosshair.png'},
        {id: 'background', src: 'assets/countryside.mp3'},
        {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
        {id: 'deathSound', src: 'assets/die.mp3'},
        {id: 'batSpritesheet', src: 'assets/batSpritesheet.png'},
        {id: 'batDeath', src: 'assets/batDeath.png'},
    ]);
    queue.load();

     // Skapar en timer som uppdaterar en gång i sekunden
    gameTimer = setInterval(updateTime, 1000);
}

// 
function queueLoaded(event)
{
    // Lägger till bakgrundsbild
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);

    //Lägger till poängrutan
    scoreText = new createjs.Text("Points: " + score.toString(), "28px Arial", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Lägger till timer
    timerText = new createjs.Text("Time: " + gameTime.toString(), "28px Arial", "#FFF");
    timerText.x = 720;
    timerText.y = 10;
    stage.addChild(timerText);

    // Spela upp bakgrundsljud
    createjs.Sound.play("background", {loop: -1});

    // Skapar ufo-spritesheet, ställer in frames vart animationen ska klippa och hur många bilder animationen består av
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batSpritesheet')],
        "frames": {"width": 73, "height": 50},
        "animations": { "flap": [0,4] }
    });

     // Skapar ufo-spritesheet (explosion), ställer in frames vart animationen ska klippa och hur många bilder animationen består av
    batDeathSpriteSheet = new createjs.SpriteSheet({
    	"images": [queue.getResult('batDeath')],
    	"frames": {"width": 73, "height" : 50},
    	"animations": {"die": [0,4, false,1 ] }
    });

    // Skapar ufot
    createEnemy();

   /*
    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = WIDTH/2;
    crossHair.y = HEIGHT/2;
    stage.addChild(crossHair);
    */

    // Add ticker FRÅGA SEBBE
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    // Set up events AFTER the game is loaded

   // window.onmousemove = handleMouseMove;
   // Tilldelar window.onmousedown funktionen "handleMouseDown"
    window.onmousedown = handleMouseDown;
}

// Funktionen som skapar fienden, ladda in spritesheet, träffyta och startposition
function createEnemy()
{
	animation = new createjs.Sprite(spriteSheet, "flap");
    animation.regX = -18;
    animation.regY = -12;
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}
// Funktionen som skapar explosionsanimationen, laddar in spritesheet, ställer in träffyta och startposition
function batDeath()
{
  deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
  deathAnimation.regX = -18;
  deathAnimation.regY = -12;
  deathAnimation.x = enemyXPos;
  deathAnimation.y = enemyYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	//Hindrar vårt ufo att röra sig utanför canvasen
	if(enemyXPos < WIDTH && enemyXPos > 0)
	{
		enemyXPos += enemyXSpeed;
	} else 
	{
		enemyXSpeed = enemyXSpeed * (-1);
		enemyXPos += enemyXSpeed;
	}
	if(enemyYPos < HEIGHT && enemyYPos > 0)
	{
		enemyYPos += enemyYSpeed;
	} else
	{
		enemyYSpeed = enemyYSpeed * (-1);
		enemyYPos += enemyYSpeed;
	}

	animation.x = enemyXPos;
	animation.y = enemyYPos;

	
}

/*
function handleMouseMove(event)
{
    //Offset the position by 45 pixels so mouse is in center of crosshair
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
}
*/

function handleMouseDown(event)
{
    //När man klickar händer följande
    // X och Y offset beroende på skärmuppläsning inuit id "myCanvas"
    var Xoffset = Math.round((document.body.offsetWidth - WIDTH )/2 );
    // Även hanterar scroll
    var Yoffset = Math.round((document.body.offsetHeigth - HEIGHT )/2) - window.scrollY;

    //Visar CrossHair animation
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = event.clientX - Xoffset;
    crossHair.y = event.clientY + window.scrollY - 83;
    stage.addChild(crossHair);
    createjs.Tween.get(crossHair).to({alpha: 0},1000);

    //console.log("CHX " + crossHair.x + " CHY " + crossHair.y);
    //Spela upp skottljud
    createjs.Sound.play("shot");

    //Ökar ufots hastighet efter hur många gånger man har klickat (skjutit ner ufot)
    enemyXSpeed *= 1.05;
    enemyYSpeed *= 1.06;

    //Ställer in skjutposition
    var shotX = Math.round(event.clientX - Xoffset);
    var shotY = Math.round(event.clientY + window.scrollY -83);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    console.log("shotX:" + shotX + " shotY: " + shotY);
    // Kontrollerar avstånder mellan där du klickar och spritens position
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

    //console.log("sprite", spriteX, spriteY);
    //console.log("shot:", shotX, shotY);
    //console.log("dist:", distX, distY);

    // Träffyta på spriten, avstånd
    if(distX < 36 && distY < 25 )
    {
    	//Vad som händer när du träffar (animationen avbryts)
        //Lägger till poäng och spelar upp deathsound
    	stage.removeChild(animation);
    	batDeath();
    	score += 100;
    	scoreText.text = "Points: " + score.toString();
    	createjs.Sound.play("deathSound");
    	
        //Ökar ufots hastighet ytterligare när du prickar
    	enemyYSpeed *= 1.25;
    	enemyXSpeed *= 1.3;

    	//Skapar ny fiende
        //Slumpar fram tiden en ny entitet ska "spawna"
    	var timeToCreate = Math.floor((Math.random()*2500)+1);
	    setTimeout(createEnemy,timeToCreate);

    } else
    {
        // Hindrar användare med hög skärmupplösningen från att klicka långt utanför
        // och få minus poäng
        if ((shotX > 0 && 900 > shotX)  && (shotY > 0 && 600 > shotY)) {
        //Om man missar, dra av 10 poäng från score
            score -= 10;
            scoreText.text = "Points: " + score.toString();
        }
    	

    }
}

function updateTime()
{
    //Funktion som räknar tiden och avlutar efter 30 sekunder
	gameTime += 1;
	if(gameTime > 30)
	{
		//Visar game over, istället för räknaren och tar bort animationer och ljud
		timerText.text = "GAME OVER";
		stage.removeChild(animation);
        createjs.Sound.removeSound("shot");
        createjs.Sound.removeSound("deathSound");
        createjs.Sound.removeSound("background");
        var si =createjs.Sound.play("gameOverSound");
		clearInterval(gameTimer);
	}
	else
	{      
        // Annars visas speltiden
		timerText.text = "Time: " + gameTime

	}
}


















// Local Storage GAME

var buttonSave = document.getElementById('save');


//översätter text till objekt
var highscore = JSON.parse(localStorage.getItem("Highscore"));


if (!highscore) {
    highscore = {results: []};   
}

//lagrar namn
var nameHighscore = "";

// on click gör detta
buttonSave.addEventListener("click", function() {

   nameHighscore = prompt("Please enter your name");
   // om tom inget sker
   if (!nameHighscore) {
    return;
   }

    //skriver ut resultat i konsolen med tillhörande namn
    console.log("your current score is " + score + " (" + nameHighscore + ")");
    

    //pushar in resultatet o namn i ett objekt
    highscore.results.push({ name: nameHighscore, score: score });
    console.log(JSON.stringify(highscore));
    //skapar highscore med tillhörande resultat i textform med hjälp av stringify, sparar de i lokala datorn
    localStorage.setItem("Highscore", JSON.stringify(highscore));
    
    // Fungerar endast på min (Tobias dator)
    // Efter användaren klickat på "ok" på prompt name saken kommer man till index.html
    location.pathname="/D:/Skola/JavaScript/projekt/Versioner/The%20Game/index.html";
});











