var zombiegame = zombiegame || {};

function initGame () {
  zombiegame.language.detectLang();

  var config = {
    width: 800,
    height: 400,
    renderer: Phaser.AUTO,
    parent: 'game',
    transparent: false,
    antialias: false,
    reserveDrawingBuffer: true,
    enableDebug: false,
  };

  zombiegame.game = new Phaser.Game(config);
  
  zombiegame.game.state.add("Boot", zombiegame.boot);
  zombiegame.game.state.add("Preload", zombiegame.preload);
  zombiegame.game.state.add("Menu", zombiegame.menu);
  zombiegame.game.state.add("Game", zombiegame.rungame);
  
  zombiegame.game.model = {
  
    /* Saves the scores and does logic handling */
    score: new zombiegame.Highscore(),
  
    /* Speed for the cloud movement */
    cloudspeed: 10,
  
    /* Speed for the house-rotation */
    gamespeed: 130,
  
    /* Time in milliseconds to spawn the next zombie */
    spawntime: 1200,
  
    /* Handle for the background music */
    music: null,
    isMusicEnabled: getMusicState(),

    playername: localStorage.getItem('zombiehunter.playername'),

    savePlayername: function() {
      localStorage.setItem('zombiehunter.playername', zombiegame.game.model.playername);
    },
  }
  
  zombiegame.game.state.start("Boot");
}

initGame();