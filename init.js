
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


window.onload = function()





{

    /*
     *      Set up the Canvas with Size and height
     *
     */
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

    /*
     *      Set up the Asset Queue and load sounds
     *
     */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    /*
     *      Create a load manifest for all assets
     *
     */
    queue.loadManifest([
        {id: 'backgroundImage', src: 'assets/background.jpg'},
        {id: 'crossHair', src: 'assets/crosshair.png'},
        {id: 'shot', src: 'assets/shot.mp3'},
        {id: 'background', src: 'assets/countryside.mp3'},
        {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
        {id: 'tick', src: 'assets/tick.mp3'},
        {id: 'deathSound', src: 'assets/die.mp3'},
        {id: 'batSpritesheet', src: 'assets/batSpritesheet.png'},
        {id: 'batDeath', src: 'assets/batDeath.png'},
    ]);
    queue.load();

    /*
     *      Create a timer that updates once per second
     *
     */
    gameTimer = setInterval(updateTime, 1000);

}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);

    //Add Score
    scoreText = new createjs.Text("Points: " + score.toString(), "28px Arial", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Add Timer
    timerText = new createjs.Text("Time: " + gameTime.toString(), "28px Arial", "#FFF");
    timerText.x = 720;
    timerText.y = 10;
    stage.addChild(timerText);

    // Play background sound
    createjs.Sound.play("background", {loop: -1});

    // Create bat spritesheet
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batSpritesheet')],
        "frames": {"width": 73, "height": 50},
        "animations": { "flap": [0,4] }
    });

    // Create bat death spritesheet
    batDeathSpriteSheet = new createjs.SpriteSheet({
    	"images": [queue.getResult('batDeath')],
    	"frames": {"width": 73, "height" : 50},
    	"animations": {"die": [0,4, false,1 ] }
    });

    // Create bat sprite
    createEnemy();

   /*
    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = WIDTH/2;
    crossHair.y = HEIGHT/2;
    stage.addChild(crossHair);
    */

    // Add ticker
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    // Set up events AFTER the game is loaded
   // window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
}

function createEnemy()
{
	animation = new createjs.Sprite(spriteSheet, "flap");
    animation.regX = 99;
    animation.regY = 58;
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}

function batDeath()
{
  deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
  deathAnimation.regX = 99;
  deathAnimation.regY = 58;
  deathAnimation.x = enemyXPos;
  deathAnimation.y = enemyYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	//Make sure enemy bat is within game boundaries and move enemy Bat
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
    
    //Display CrossHair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = event.clientX;
    crossHair.y = event.clientY;
    stage.addChild(crossHair);
    createjs.Tween.get(crossHair).to({alpha: 0},1000);
    
    //Play Gunshot sound
    createjs.Sound.play("shot");

    //Increase speed of enemy slightly
    enemyXSpeed *= 1.05;
    enemyYSpeed *= 1.06;

    //Obtain Shot position
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    // Compute the X and Y distance using absolute value
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

    // Anywhere in the body or head is a hit - but not the wings
    if(distX < 115 && distY < 95 )
    {
    	//Hit
    	stage.removeChild(animation);
    	batDeath();
    	score += 100;
    	scoreText.text = "Points: " + score.toString();
    	createjs.Sound.play("deathSound");
    	
        //Make it harder next time
    	enemyYSpeed *= 1.25;
    	enemyXSpeed *= 1.3;

    	//Create new enemy
        //respawn time
    	var timeToCreate = Math.floor((Math.random()*2500)+1);
	    setTimeout(createEnemy,timeToCreate);

    } else
    {
    	//Miss
    	score -= 10;
    	scoreText.text = "Points: " + score.toString();

    }
}

function updateTime()
{
	gameTime += 1;
	if(gameTime > 30)
	{
		//End Game and Clean up
		timerText.text = "GAME OVER";
		stage.removeChild(animation);
		stage.removeChild(crossHair);
        createjs.Sound.removeSound("background");
        var si =createjs.Sound.play("gameOverSound");
		clearInterval(gameTimer);
	}
	else
	{
		timerText.text = "Time: " + gameTime
    //createjs.Sound.play("tick");
	}
}







// Våra HTML objekt
 var searchForm = document.getElementById("search-form");
 // Det som använaren skriver in
 var queryField = document.getElementById("query");
 var omdbResultList = document.getElementById("omdb-result-list");
 
 // De objekt som hanterar kommunikationen
 var omdbAPI = new XMLHttpRequest();
 
 function fetchFromAPIs(query) {
     // Våra URLs
     //Förinställd sökning "Alien"
     var omdbURL = "http://www.omdbapi.com/?s=Alien&y=&plot=short&r=json";
     // tar vårt sökord (query) och använder det som sökord till vald API
     //var omdbURL = "http://www.omdbapi.com/?s=" + query + "&y=&plot=short&r=json";
     // Förbered för att kommunicera
     omdbAPI.open("get", omdbURL, true);
 
     // Kommunicera
     omdbAPI.send();

    
 }


 // Vad ska vi göra när vi får svar från omdb?
 omdbAPI.addEventListener("load", function() {
    // while looping nollställer sökresultaten
    while (omdbResultList.firstChild) {
            omdbResultList.removeChild(omdbResultList.firstChild);
        }

      // Konvertera svaret till ett korrekt objekt
     var data = JSON.parse(this.responseText);

    for (var i = 0; i < data.Search.length; i++) {

         // skapar ett <li> element
        var listElement = document.createElement("li");
        // använder varibeln "listElement" och bytar det visuella till vårt sökresultat
        listElement.textContent = data.Search[i].Title + ", " + data.Search[i].Year;
        // Ändrar html elementet "omdbResultList" och uppdaterar den
        omdbResultList.appendChild(listElement);
     
    }    

     // skriver ut till konsollen
     // console.log(data);
 });
 
 // Eventet "submit" körs när vi skickar formuläret
 searchForm.addEventListener("submit", function(event) {
     // För att avbryta att vårt formulär skickar oss till en ny sida
     event.preventDefault();
     // Hämta värdet från formuläret
     var query = queryField.value;
     // Skicka med sökordet till våra förfrågningar mot våra API
     fetchFromAPIs(query);

 });