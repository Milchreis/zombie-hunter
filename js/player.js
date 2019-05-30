var zombiegame = zombiegame || {};

zombiegame.Player = function(game) {

  this.game = game;

  this.isDead = false;

  this.sprite = game.add.sprite(32, 100, 'player');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.gravity.y = 950;
  this.jumpStrange = 450;
  this.isShooting = false;

  this.sprite.body.setSize(this.sprite.width-3, this.sprite.height, 0, 0);

  // set up frames for animation
  this.shootAnimation = this.sprite.animations.add(
    'shooting', [9, 10, 11, 12, 13, 14, 15, 16, 17], 21, false);

  this.runAnimation = this.sprite.animations.add(
    'right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 20, true);

  this.jumpAnimation = this.sprite.animations.add(
    'jump', [18, 19, 20, 21], 10, false);

  this.jumpShootAnimation = this.sprite.animations.add(
    'jumpShoot', [22, 23, 24], 12, false);

  this.reloadAnimation = this.sprite.animations.add(
    'reload', range(18, 27), 12, false);

  this.sprite.animations.play('right');

  this.playShootOrRun = () => {
    if(this.sprite.body.touching.down) {
      this.sprite.animations.play('right');
    } else {
      this.sprite.animations.play('jump');
    }
  };

  this.jumpAnimation.onComplete.add(this.playShootOrRun);
  this.shootAnimation.onComplete.add(this.playShootOrRun);
  this.jumpShootAnimation.onComplete.add(this.playShootOrRun);
  this.reloadAnimation.onComplete.add(this.playShootOrRun);

  this.weapon = new zombiegame.Weapon(game);

  this.deadSound = this.game.add.audio('deadSound', 0.8);
}

zombiegame.Player.prototype.jump = function() {
  if(this.sprite.body.touching.down) {
    this.sprite.body.velocity.y = -this.jumpStrange;
    this.sprite.animations.play('jump');
  }
}

zombiegame.Player.prototype.releaseJump = function() {
  if(this.sprite.body.velocity.y < 0) {
    this.sprite.body.velocity.y = 0;
  }
}

zombiegame.Player.prototype.shoot = function() {
    this.weapon.onShoot(this.sprite);
}

zombiegame.Player.prototype.update = function() {
  this.weapon.update();

  if(this.sprite.animations.currentAnim === this.jumpAnimation && this.sprite.body.touching.down) {
    this.sprite.animations.play('right');
  }
}

zombiegame.Player.prototype.die = function() {
  this.isDead = true;
  this.sprite.kill();
  zombiegame.rungame.emitter.emit(this.sprite.x, this.sprite.y);
  this.sprite.visible = false;
  this.deadSound.play();
}
