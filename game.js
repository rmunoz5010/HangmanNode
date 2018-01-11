var Letter = require('./letter.js');

function Word(word) {
  var wordObject = this;
  this.word = word;
  this.letters = [];
  this.wordFound = false;

  this.getLets = function() {

    for(var i = 0; i<wordObject.word.length; i++){
      var newLetter = new Letter(wordObject.word[i]);
      this.letters.push(newLetter);
    }
  };


  this.didWeFindTheWord = function() {
    if(this.letters.every(function(letter){
      return letter.appear === true;
    })){
      this.wordFound = true;
      return true;
    }

  };

  this.checkIfLetterFound = function(guessedLetter) {
    var whatToReturn = 0;

    this.letters.forEach(function(letter){
      if(letter.letter === guessedLetter){
        letter.appear = true;
        whatToReturn++;
      }
    })

    return whatToReturn;
  };

  this.wordRender = function() {
    var display = '';
    wordObject.letters.forEach(function(letter){
      var currentLetter = letter.letterRender();
      display+= currentLetter;
    });

    return display;
  };
}

module.exports = Word;