function getMusicState() {
    let musicstate = localStorage.getItem('zombiehunter.music.state');
    if(musicstate !== null || musicstate === undefined) {
      localStorage.setItem('zombiehunter.music.state', true);
      return true;
    } else {
      return musicstate;
    }
  }
  
  function getRandomInt(min, max) {
    return zombiegame.game.rnd.integerInRange(min, max);
  }
  
  function getRandomNegativeOrPositiveOne() {
    return getRandomInt(-1, 0) === 0 ? 1 : -1;
  }
  
  function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  
  function constrain(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }