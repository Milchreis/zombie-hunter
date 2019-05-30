var zombiegame = zombiegame || {};

zombiegame.rungame = function(game) {
  this.zombies = null;
  this.player = null;
  this.gamespeed = null;
  this.zombieKillSound = null;
  this.buttonLock = null;
  this.stats = null;
};

zombiegame.rungame.prototype = {

    preload: function() {
      this.game.time.advancedTiming = true;
      this.game.time.desiredFps = 35;
    },

    create: function() {
      
      // Setup the current gamespeed
      zombiegame.rungame.gamespeed = this.game.model.gamespeed;

      zombiegame.rungame.spawntime = this.game.model.spawntime;

      zombiegame.rungame.stats = new Stats(this.game);

      // Create the input objects
      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      // Show the background
      zombiegame.world.drawBackground();

      // Show the clouds
      this.clouds = zombiegame.world.createClouds((zombiegame.rungame.gamespeed + 1) * 0.15);

      this.cities = zombiegame.world.createCityBackground(zombiegame.rungame.gamespeed * 0.5);

      // Player object
      zombiegame.rungame.player = new zombiegame.Player(this.game);
      this.player = zombiegame.rungame.player

      // houses
      this.houses = zombiegame.world.createHouse(5, 260, 'h1', null, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(230, 290, 'h2', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(400, 270, 'h1', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(600, 220, 'h1', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(800, 280, 'h2', this.houses, zombiegame.rungame.gamespeed);

      // Score
      this.game.model.score.reset();
      this.scoreText = this.game.add.bitmapText(30, 30,
        'font1', zombiegame.language.values.score + ': ' + this.game.model.score.getScore(), 16);
      this.scoreText.anchor.setTo(0, 0);

      // Zombies
      this.zombies = zombiegame.world.createZombiePool(15);
      zombiegame.rungame.zombies = this.zombies;
      this.zombies.nextSpawnTime = 0;

      zombiegame.rungame.emitter = new BloodEmitter(this.game, true);

      zombiegame.world.spawnZombie(this.zombies, 750, 200, zombiegame.rungame.gamespeed);

      // set up waiting time for button hiding
      this.helpButtonTime = this.game.time.now + 4000;

      this.fpsCheckTime = this.game.time.now + 5000;
      
      // Help buttons
      this.shootBtn = this.game.add.bitmapText(600, 325,
        'font1', zombiegame.language.values.shoot, 32);
      this.game.physics.enable(this.shootBtn, Phaser.Physics.ARCADE);

      this.jumpBtn = this.game.add.bitmapText(50, 325,
        'font1', zombiegame.language.values.jump, 32);
      this.game.physics.enable(this.jumpBtn, Phaser.Physics.ARCADE);

      this.fpsText = this.game.add.bitmapText(this.game.width - 50, 30, 'font1', 'FPS: ', 16);

      // overlay for a better look
      this.game.add.sprite(-10, -10, 'overlay');

      zombiegame.rungame.zombieKillSound = this.game.add.audio('zombieSound', 0.3);
      this.player.reloadAnimation.play();
    },

    update: function() {

      this.game.stage.backgroundColor = "#000000";

      // this.checkFrameDrops();

      zombiegame.world.rotate(this.clouds);
      zombiegame.world.rotate(this.cities);
      zombiegame.world.rotateHouses(this.houses);

      // Collide the player with houses
      if(this.game.physics.arcade.overlap(this.player.sprite, this.houses)) {
        this.game.physics.arcade.collide(this.player.sprite, this.houses);
      }
      
      // Collide the zombies with houses
      if(this.game.physics.arcade.overlap(this.zombies, this.houses)) {
        this.game.physics.arcade.collide(this.zombies, this.houses);
      }

      // Collide bullets with zombie and custom action
      this.game.physics.arcade.collide(
      this.player.sprite,
      this.zombies,
      this.onPlayerZombieCollision);

      // Collide the bullets with zombies
      this.game.physics.arcade.overlap(this.player.weapon.bullets, this.zombies, this.onBulletZombieCollision);

      // Collide bullets with walls
      this.game.physics.arcade.overlap(
        this.player.weapon.bullets,
        this.houses,
        this.player.weapon.onHit);

      this.player.update();

      // Update score until the player dies
      if(!this.player.isDead) {
        this.game.model.score.update();
        this.scoreText.setText(zombiegame.language.values.score + ': ' + this.game.model.score.getScore());
      } else {
        this.scoreText.visible = false;
        zombiegame.world.updateSpeed(this.cities, zombiegame.rungame.gamespeed * 0.5);

        if((zombiegame.rungame.gamespeed + 1) * 0.15 < 3) {
          zombiegame.world.updateSpeed(this.clouds, 3);
        } else {
          zombiegame.world.updateSpeed(this.clouds, (zombiegame.rungame.gamespeed + 1) * 0.15);
        }
      }

      // Update gamespeed and enemy spawn
      if(!this.player.isDead && this.game.model.score.score > 2 && Math.floor(this.game.model.score.score) % 10 === 0) {
        zombiegame.rungame.gamespeed += 0.2;
        zombiegame.world.updateSpeed(this.houses, zombiegame.rungame.gamespeed);
        zombiegame.world.updateSpeed(this.cities, zombiegame.rungame.gamespeed * 0.5);
        zombiegame.world.updateSpeed(this.clouds, (zombiegame.rungame.gamespeed + 1) * 0.15);
        zombiegame.world.updateZombiesSpeed(this.zombies, zombiegame.rungame.gamespeed);

        zombiegame.rungame.spawntime -= 1;
      }

      this.checkControls();
      this.checkZombieSpawn();
      this.checkHelpButtons();
      this.updateGameOver();
      zombiegame.world.checkZombieOutOfBounds(this.zombies);

      // if the player is maybe dead? check for gameover if player is outside
      if(!this.player.isDead && (this.player.sprite.x < 30 || this.player.sprite.y > this.game.height)) {
        this.onGameOver();
      }

      this.fpsText.setText(this.game.time.fps);
    },

    killZombie: function(zombie) {
      zombiegame.rungame.emitter.emit(zombie.x, zombie.y);

      zombie.kill();
      zombiegame.rungame.zombieKillSound.play();
      zombiegame.game.camera.shake(0.008, 150);

      zombiegame.rungame.prototype.vibration(50);
      zombiegame.rungame.stats.increaseKilledZombies(zombie, zombiegame.rungame.prototype.onDecideOverlay);
    },
    
    onDecideOverlay(zombie, killedZombies, interKillTime) {
      let killTimeText = null;
      let killAmountText = null;

      if(interKillTime < 500) {
        killTimeText = zombiegame.language.values.impressive;
      } else if(interKillTime < 900) {
        killTimeText = zombiegame.language.values.nice;
      }

      if(killTimeText) {
        new UIOverlay(zombie.body.x , zombie.body.y, killTimeText, zombiegame.game, 'font1', 20).start();
      }
      
      if(killedZombies === 15) {
        killAmountText = zombiegame.language.values.killer;
      } else if(killedZombies === 30) {
        killAmountText = zombiegame.language.values.hunter;
      } else if(killedZombies === 40) {
        killAmountText = zombiegame.language.values.outlaw;
      } else if(killedZombies === 50) {
        killAmountText = zombiegame.language.values.freak;
      } else if(killedZombies === 100) {
        killAmountText = zombiegame.language.values.mania;
      }
      
      if(killAmountText) {
        new UIOverlay(zombiegame.game.width / 2, zombiegame.game.height * 0.25, killAmountText, zombiegame.game, 'font1', 32, 800).start();
      }
    },
  
    onBulletZombieCollision: function(bullet, zombie) {
      zombiegame.rungame.prototype.killZombie(zombie);
      bullet.kill();
      zombiegame.rungame.stats.increaseHits();
    },

    onPlayerZombieCollision: function(playerSprite, zombie) {
      if(playerSprite.body.touching.down && zombie.body.touching.up) {
        zombiegame.rungame.prototype.killZombie(zombie);
      } else {
        zombiegame.rungame.prototype.onGameOver();
      }
    },

    onGameOver: function() {
      zombiegame.rungame.player.die();
      zombiegame.game.model.score.saveScore();
      zombiegame.rungame.buttonLock = zombiegame.game.time.now + 700;
      
      let overlay = new UIOverlay(zombiegame.game.width * 0.25, 0, 
        `${zombiegame.language.values.score}: ${zombiegame.game.model.score.getScore()}
 - Kills: ${zombiegame.rungame.stats.killedZombies}
 - Acc : ${(zombiegame.rungame.stats.getAccuracy())} %`,
        zombiegame.game, 'font1', 38, -1,
        Phaser.Easing.Exponential.In, null, 
        0, -zombiegame.game.height / 2);

      overlay.inTime = 300;
      overlay.start();

      zombiegame.game.model.score.sendScore();
      zombiegame.game.model.score.receiveTopScores((globalScore) => {
        let scoreIndex = globalScore.findIndex(item => item.localplayer);

        if(scoreIndex >= 0) {
          let globalScoreRange = zombiegame.game.model.score.getGlobalScoreRange(scoreIndex, 2, 2);
          let score = "";
          globalScoreRange.forEach(item => score+= `${item.position}.\t${item.score}\t${item.name}\n`)

          new UIOverlay(zombiegame.game.width * 0.75, 0, 
            score,
            zombiegame.game, 'font1', 38, -1,
            Phaser.Easing.Exponential.In, null, 
            0, -zombiegame.game.height / 2).start();
        }
      });

      zombiegame.rungame.prototype.vibration(200);
    },

    updateGameOver: function() {
      if(this.player.isDead) {
        // Decrease the scrolling speed
        if(zombiegame.rungame.gamespeed > 0) {
          zombiegame.rungame.gamespeed -= 1.5;
          this.houses.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
          this.zombies.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
        } else {
          zombiegame.rungame.gamespeed = 0;
          this.houses.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
          this.zombies.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
        }
      }
    },

    checkZombieSpawn: function() {
      if(this.game.time.now > this.zombies.nextSpawnTime && !this.player.isDead) {
        // it is time for a new zombie
        zombiegame.world.spawnZombie(
          this.zombies,
          this.game.width + 150 + (zombiegame.rungame.gamespeed*0.25),
          50,
          zombiegame.rungame.gamespeed);

        // set up the time for next zombie
        this.zombies.nextSpawnTime = this.game.time.now + zombiegame.rungame.spawntime;
		  }
    },

    checkControls: function() {

      if(this.player.isDead) {
        if(this.game.time.now > zombiegame.rungame.buttonLock &&
          (this.cursors.right.isDown
          || this.spacebar.isDown
          || this.cursors.up.isDown
          || this.game.input.pointer1.isDown
          || this.game.input.mousePointer.isDown)) {
            
          this.game.state.start("Menu");
        }

      } else {
        // Jump
        if(this.cursors.up.isDown
          || this.spacebar.isDown
          || (this.game.input.pointer1.isDown && this.game.input.pointer1.x < this.game.width/2)
          || (this.game.input.pointer2.isDown && this.game.input.pointer2.x < this.game.width/2)
          || (this.game.input.mousePointer.isDown && this.game.input.mousePointer.x < this.game.width/2)) {

            this.player.jump();
        }
        // Release Jump
        else if(this.cursors.up.isUp
          || this.spacebar.isUp
          || (this.game.input.pointer1.isUp && this.game.input.pointer1.x < this.game.width/2)
          || (this.game.input.pointer2.isUp && this.game.input.pointer2.x < this.game.width/2)
          || (this.game.input.mousePointer.isUp && this.game.input.mousePointer.x < this.game.width/2)) {

          this.player.releaseJump();
        }

        // Shoot
        if(this.cursors.right.isDown
            || (this.game.input.pointer1.isDown && this.game.input.pointer1.x > this.game.width/2)
            || (this.game.input.pointer2.isDown && this.game.input.pointer2.x > this.game.width/2)
            || (this.game.input.mousePointer.isDown && this.game.input.mousePointer.x > this.game.width/2)) {

            this.player.shoot();
        }
      }
    },

    checkHelpButtons: function() {
      if(this.jumpBtn.alive) {
        if(this.game.time.now > this.helpButtonTime) {
          this.jumpBtn.body.gravity.y = 100;
        } else if(this.jumpBtn.y > this.game.height) {
          this.jumpBtn.alive = false;
        }
      }

      if(this.shootBtn.alive) {
        if(this.game.time.now > this.helpButtonTime) {
          this.shootBtn.body.gravity.y = 100;
        } else if(this.shootBtn.y > this.game.height) {
          this.shootBtn.alive = false;
        }
      }
    },

    vibration(time) {
      if(navigator.vibrate) {
        navigator.vibrate(time);
      }
    },

    checkFrameDrops() {
      if(this.fpsCheckTime < this.game.time.now) {
        if(this.game.time.fps < 50) {
          zombiegame.rungame.emitter.switchToFastMode();
        }
      }
    }
}
