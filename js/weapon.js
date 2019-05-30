var zombiegame = zombiegame || {};

zombiegame.Weapon = function(game) {

  this.game = game;

  this.fireRate = 600;
  this.size = 7;
  this.remainingBullets = this.size;
  this.reloadTime = 1500;
  this.nextFire = 0;

  // Bullets
  this.bullets = game.add.group();
  this.bullets.createMultiple(10, 'shootBullet');
  game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  this.bullets.setAll('anchor.x', 0.5);
  this.bullets.setAll('anchor.y', 0.5);
  this.bullets.setAll('outOfBoundsKill', true);
  this.bullets.setAll('body.velocity.x', -600);

  this.capsuleEmitter = this.game.add.emitter(0, 0, 20);
  this.capsuleEmitter.makeParticles('capsule');
  this.capsuleEmitter.gravity.set(-100, 500);

  this.magazineEmitter = this.game.add.emitter(0, 0, 5);
  this.magazineEmitter.makeParticles('magazine');
  this.magazineEmitter.gravity.set(-100, 500);

  // Sounds
  this.shootSound = game.add.audio('shootSound', 0.5);
  this.reloadSound = game.add.audio('reloadSound', 0.5);

  // Presentation bullets
  this.magBullets = game.add.group();
  for(var i=0; i<this.size; i++) {
    var bullet = this.magBullets.create(600+(20*i), 20, 'bullet2');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
  }
}

zombiegame.Weapon.prototype.onHit = function(bullet, object) {
  bullet.kill();
}

zombiegame.Weapon.prototype.update = function() {

  if(this.game.time.now > this.nextFire && this.remainingBullets === 0) {
    this.remainingBullets = this.size;
    this.magBullets.setAll('body.y', 20);
    this.magBullets.setAll('body.velocity.y', 0);
  }
}

zombiegame.Weapon.prototype.onShoot = function(playersprite) {

    // check for next shoot:
    // time to next shoot is over and bullet sprites available
    if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      // if the magazine is not empty
      if(this.remainingBullets > 0) {
        zombiegame.rungame.stats.increaseShots();

        // set up the next earliest moment to shoot
        this.nextFire = this.game.time.now + this.fireRate;

        // get the next possible bullet sprite
        var bullet = this.bullets.getFirstDead();

        // set up to player sprite
        bullet.reset(playersprite.body.x + 12, playersprite.body.y + 12);
        bullet.animations.add('bulletAnimation', [0, 1, 2, 3], 20, true);
        bullet.animations.play('bulletAnimation');
        bullet.body.velocity.x = 800;
        
        // decrease the shoot from magazine
        this.remainingBullets--;

        // play shoot sound
        this.shootSound.play();

        if(playersprite.body.touching.down) {
          playersprite.animations.play('shooting');
        } else {
          playersprite.animations.play('jumpShoot');
        }

        // show bullet capsule
        this.capsuleEmitter.x = playersprite.x + 30;
        this.capsuleEmitter.y = playersprite.y;
        this.capsuleEmitter.start(true, 2000, null, 1);

        // Update show bullets
        var magBullet = this.magBullets.getAt(this.size-this.remainingBullets-1);
        magBullet.body.velocity.y = -1000;

        // magazine is empty
        if(this.remainingBullets == 0) {
          this.nextFire = this.game.time.now + this.reloadTime;
          playersprite.animations.play('reload');
          this.reloadSound.play();
          this.magazineEmitter.x = playersprite.x + 30;
          this.magazineEmitter.y = playersprite.y;
          this.magazineEmitter.start(true, 2000, null, 1);
        }
      }
    }
}
