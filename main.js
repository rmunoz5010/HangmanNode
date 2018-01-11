
var Word = require('./words.js');
var Game = require('./game.js');
var inquirer = require('inquirer');
var isLetter = require('is-letter');



require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  wordBank: Word.newWord.wordList,
  guessesRemaining: 10,

  guessedLetters: [],
  display: 0,
  currentWord: " ",
  startGame: function() {
    var gameObject = this;
  
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Ready to play?"
    }]).then(function(answer) {
      if(answer.play){
        gameObject.newGame();
      } else{
        console.log("Too bad we're doing it anyways");
        gameObject.newGame();
      }
    })},

  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Okay! Here we go!");
      console.log('______________________');
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Game(this.wordBank[randNum]);
      this.currentWord.getLets();
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var myObject = this;
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      var guessedAlready = false;
        for(var i = 0; i<myObject.guessedLetters.length; i++){
          if(letterReturned === myObject.guessedLetters[i]){
            guessedAlready = true;
          }
        }

        if(guessedAlready === false){
          myObject.guessedLetters.push(letterReturned);

          var found = myObject.currentWord.checkIfLetterFound(letterReturned);
          if(found === 0){
            console.log('Try again');
            myObject.guessesRemaining--;
            console.log('Guesses remaining: ' + myObject.guessesRemaining);

            console.log('\n*******************');
            console.log(myObject.currentWord.wordRender());
            console.log('\n*******************');

            console.log("Letters guessed: " + myObject.guessedLetters);
          } else{
            console.log('Yes! You guessed right!');
              if(myObject.currentWord.didWeFindTheWord() === true){
                console.log(myObject.currentWord.wordRender());
                console.log('Congratulations! You won the game!!!');
              } else{

                console.log('Guesses remaining: ' + myObject.guessesRemaining);
                console.log(myObject.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + myObject.guessedLetters);
              }
          }
          if(myObject.guessesRemaining > 0 && myObject.currentWord.wordFound === false) {
            myObject.keepPromptingUser();
          }else if(myObject.guessesRemaining === 0){
            console.log('Game over!');
            console.log('The word you were guessing was: ' + myObject.currentWord.word);
          }
        } else{
            console.log("You've guessed that letter already. Try again.")
            myObject.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();
