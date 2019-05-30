var zombiegame = zombiegame || {};

zombiegame.menu = function(game) {};

zombiegame.menu.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.game.time.desiredFps = 35;
  },

  create: function() {
    // Show the background
    zombiegame.world.drawBackground();

    // Show the clouds
    this.clouds = zombiegame.world.createClouds(3);

    // Show the game logo
    this.logo = this.game.add.sprite(this.game.width / 2, (this.game.height / 2)-100, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);

    this.game.add.tween(this.logo)
      .from({alpha: 0.0}, 3500, Phaser.Easing.Bounce.Out, true, 250);

    zombiegame.world.createCityBackground(0);

    this.houses = zombiegame.world.createHouse(230, 290, 'h2');
    zombiegame.world.createHouse(230, 290, 'h2', this.houses);
    zombiegame.world.createHouse(5, 260, 'h1', this.houses);
    zombiegame.world.createHouse(400, 270, 'h1', this.houses);
    zombiegame.world.createHouse(600, 220, 'h1', this.houses);
    zombiegame.world.createHouse(900, 280, 'h2', this.houses);
    zombiegame.world.createHouse(1200, 240, 'h1', this.houses);
    
    this.scoreText = this.game.add.bitmapText(
      30, 40,
      'font1',
      zombiegame.language.values.score + ': ' + this.game.model.score.getScore() + 
      '\n'+zombiegame.language.values.best+':' + this.game.model.score.getBest(),
      16
    );
    this.scoreText.nextBlink = 1000;
    this.scoreText.visible = true;

    this.startText = this.game.add.bitmapText(
      this.game.width / 2,
      this.game.height / 2,
      'font1', zombiegame.language.values.insertName, 32);
    this.startText.anchor.setTo(0.5, 0.5);

    this.game.add.tween(this.startText)
      .from({alpha: 0.0}, 3500, Phaser.Easing.Bounce.Out, true, 1000);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Start button with overlay for a better look
    this.overlay = this.game.add.sprite(-10, -10, 'overlay');
    this.startBtn = this.game.add.button(-10, -10, 'overlay', this.onStartGame, this, 2, 1, 0);
    this.startBtn.visible = false;

    // Button for toggle music
    this.musicBtn = this.game.add.button(700, 50, 'musicButton', this.onMusicToggle, this, 1, 1, 1);

    if(this.game.model.isMusicEnabled) {
      this.musicBtn.setFrames(1, 1, 1);
    } else {
      this.musicBtn.setFrames(0, 0, 0);
    }

    if(this.game.model.music === null) {
      this.game.model.music = this.game.add.audio('music', 0.7, true);

      if(this.game.model.isMusicEnabled) {
        this.game.model.music.play('', 10, 0.3, true);
      }
    }

    if(!this.game.model.playername) {
      this.createNameInput(1200, 1200); 
    } else {
      this.setButtonsForStart();
      
      this.avatarButton = new Button(this.game, 30, 20, 'avatar', zombiegame.game.model.playername, 'font1', 3, 14, () => {
        this.startText.text = zombiegame.language.values.insertName;
        this.overlay.visible = true;
        this.startBtn.visible = false;
        this.createNameInput(250, 0); 
      });
    }
  },

  update: function() {
    if(this.game.model.score.scoreImproved) {
      if(this.game.time.now > this.scoreText.nextBlink) {
        this.scoreText.visible = !this.scoreText.visible;
        this.scoreText.nextBlink = this.game.time.now + 800;
      }
    }

    this.checkInput();

    zombiegame.world.rotate(this.clouds);
  },

  onSavePlayername: function() {
    if(this.input.text.length < 3)
      return;

    zombiegame.game.model.playername = this.input.text;
    zombiegame.game.model.savePlayername();

    if(this.avatarButton) {
      this.avatarButton.setText(zombiegame.game.model.playername);
    }

    this.game.add.tween(this.input)
      .to({alpha: 0.0}, 200, Phaser.Easing.Out, true, 0);
      
    this.game.add.tween(this.okButton)
      .to({alpha: 0.0}, 200, Phaser.Easing.Out, true, 0);
      
    this.setButtonsForStart();
  },
  
  onMusicToggle: function() {
    zombiegame.game.model.isMusicEnabled = !zombiegame.game.model.isMusicEnabled;

    if(zombiegame.game.model.isMusicEnabled) {
      this.game.model.music.play('', 0, 0.3, true);
      this.musicBtn.setFrames(1, 1, 1);
      localStorage.setItem('zombiehunter.music.state', true);
    } else {
      zombiegame.game.model.music.stop();
      this.musicBtn.setFrames(0, 0, 0);
      localStorage.setItem('zombiehunter.music.state', false);
    }
  },

  onStartGame: function() {
    this.game.state.start("Game");
  },

  checkInput: function() {
    if(this.cursors.right.isDown || this.cursors.up.isDown) {
      this.cursors.right.isDown = false;
      this.onStartGame();
    }
  },

  setButtonsForStart() {
    this.startText.text = zombiegame.language.values.pressStart;
    this.startBtn.visible = true;
    this.overlay.visible = false;
    this.input.visible = false;
    
    if(this.keyboard)
      this.keyboard.setVisible(false);
  },

  createNameInput(animationTime, delay) {

    this.input = this.game.add.bitmapText(
      (this.game.width/2) - 120/2, (this.game.height/2) + 45,
      'font1', '', 32);

    this.okButton = this.game.add.button(
      (this.game.width/2) - 120/2 + 122, 
      (this.game.height/2) + 46, 
      'okButton', 
      this.onSavePlayername, this, 1, 1, 1);
    
    this.keyboard = new Keyboard(this.game, 20, this.game.height*0.75, 2, 15, this.game.width-20, this.game.height * 0.25, 'font1', 32, (key) => {

      if(key === '<' && this.input.text.length > 0) {
        this.input.text = this.input.text.substring(0, this.input.text.length - 1);

      } else if(this.input.text.length < 6 && key !== '<') {
        this.input.text += key;
      }

      if(this.input.text.length >= 3) {
        this.okButton.setFrames(0, 0, 0);
      } else {
        this.okButton.setFrames(1, 1, 1);
      }
    });

    this.game.add.tween(this.input)
      .from({alpha: 0.0}, animationTime, Phaser.Easing.In, true, delay);
    
    this.game.add.tween(this.okButton)
      .from({alpha: 0.0}, animationTime, Phaser.Easing.In, true, delay);
  }
}
