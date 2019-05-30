var zombiegame = zombiegame || {};

zombiegame.boot = function(game) {};

zombiegame.boot.prototype = {

  preload: function() {
    this.game.load.image("loading", "assets/images/loading.png");
  },

  create: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.game.state.start("Preload");
  }
}
