// Local Storage INDEX

var buttonHamta = document.getElementById('hamta');
var buttonVisa = document.getElementById('visa');
var buttonRadera = document.getElementById('radera');

var highscoreList = document.getElementById("highscore-list");

// Våra URLs
//var omdbURL = "http://www.omdbapi.com/?t=Batman&y=&plot=short&r=json";
//var omdbAPI = new XMLHttpRequest();
/*
// on click gör detta
buttonHamta.addEventListener("click", function() {

    // finns det inget i localStorage, hämta något
   if( localStorage.length == 0 ) {

      // Förbered för att kommunicera
     omdbAPI.open("get", omdbURL, true);
 
     // Kommunicera
     omdbAPI.send();  
        
     }else {
        //Finns det något lagrat skriv ut till användaren:
        alert("Det finns inget hämta");
     }

    
}); 

 // Den funktionalitet ni vill utföra när ni
 // fått ett svar från ert API
 omdbAPI.addEventListener("load", function() {

     // Vilket innebär att ni kan exempelvis spara detta direkt
     // sparar det du hämtade i localstorage
     localStorage.setItem("movie", this.responseText);

     // Skriv ut till användaren
     alert("Information är nu lagrad");
 });

*/

buttonVisa.addEventListener("click", function() {
        
    //Nollställer sökresultaten
        while (highscoreList.firstChild) {
            highscoreList.removeChild(highscoreList.firstChild);
        }

    // finns det inget i localStorage, hämta något
    if( localStorage.length == 0 ) {


        // skapar li element
                var listElement = document.createElement("li");
                listElement.textContent = "Det finns inga Highscores";
                highscoreList.appendChild(listElement);
        //Finns det något lagrat skriv ut till användaren:
       // alert("Det finns inget visa"); 
        
     }
     // 
     else {
        
        var userHighscore = JSON.parse(localStorage.getItem("Highscore"));


        //console.log(userHighscore);


        userHighscore.results.forEach(function(result) {

                // skapar li element
                var listElement = document.createElement("li");
                // fyller vi listan med name och score från objektet result
                listElement.textContent = "Name: " + result.name + " Score:" + result.score;
                // vi hämtar ul och fyller den med li (listElement)
                highscoreList.appendChild(listElement);

                console.log(result);
        });
        // Svaret från API:et sparas som en JSON-string i
        // "this.responseText"

       // skapar ett <li> element
       /* var listElement = document.createElement("li");

        // använder varibeln "listElement" och bytar det visuella till vårt sökresultat
        listElement.textContent = movie.Title;
        // Ändrar html elementet "spotifyResultList" och uppdaterar den
        highscoreList.appendChild(listElement);*/
     }

    // skriver ut till konsollen
    //console.log(movie);

});

buttonRadera.addEventListener("click", function() {

     
        while (highscoreList.firstChild) {
            highscoreList.removeChild(highscoreList.firstChild);
        }
        localStorage.clear();

     
});

