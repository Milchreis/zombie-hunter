var zombiegame = zombiegame || {};

zombiegame.Highscore = function() {

  this.score = 0;
  this._lastscore = 0;
  this.best = localStorage.getItem('zombiehunter.score.best');
  this.blinkspeed = 1000;
  this.increaseRate = 0.01;
  this.scoreImproved = false;
  this.globalScore = null;

  if(this.best === null) {
    this.best = 0;
  }

  this.saveScore = function() {
    if(this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('zombiehunter.score.best', this.best);
    }
    if(this.score > this._lastscore) {
      this.scoreImproved = true;
    }
  };

  this.getScore = function() {
    return(parseInt(this.score));
  };

  this.getBest = function() {
    return(parseInt(this.best));
  };

  this.update = function() {
    this.score += this.increaseRate;
  };

  this.reset = function() {
    this._lastscore = this.score;
    this.scoreImproved = false;
    this.score = 0;
  };

  this.getGlobalScoreRange = function(scoreIndex, numberOfItemsBefore, numberOfItemsAfter) {
    if(scoreIndex <= numberOfItemsBefore) {
      numberOfItemsBefore = numberOfItemsBefore - scoreIndex;
    }

    if(scoreIndex+numberOfItemsAfter > this.globalScore.length) {
      numberOfItemsAfter = scoreIndex+numberOfItemsAfter - this.globalScore.length;
    }

    let scoreRange = []
    
    for(let i = numberOfItemsBefore; i > 0; i--) {
      scoreRange.push(this.globalScore[scoreIndex-i]);
    }

    scoreRange.push(this.globalScore[scoreIndex]);

    for(let i = 1; i <= numberOfItemsAfter; i++) {
      scoreRange.push(this.globalScore[scoreIndex+i]);
    }

    return scoreRange;
  };

  this.receiveTopScores = function(onSuccess) {
    $.getJSON("http://zombiehunter.bplaced.net/api/score", (result) => {
      this.globalScore = result;

      this.globalScore.forEach((item, index) => item.position = index+1);

      let playerScore = this.globalScore.find(item => 
        item.name === zombiegame.game.model.playername 
        && item.score === this.getScore()); 

      if(playerScore) {
        playerScore['localplayer'] = true;
      }

      if(onSuccess) {
        onSuccess(this.globalScore);
      }
    });
  };
}
