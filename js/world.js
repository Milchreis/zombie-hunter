var zombiegame = zombiegame || {};

zombiegame.world = {

  /** Create the plain background */
  drawBackground: function() {
    this.bg = zombiegame.game.add.group();
    this.bg.img = zombiegame.game.cache.getImage('bg');
    // create background with width of the screen
    for(var i = 0; i < zombiegame.game.width; i += this.bg.img.width) {
      this.bg.create(i, 0, 'bg');
    }
  },

  createZombiePool: function(poolsize) {
    var zombies = zombiegame.game.add.group();
    zombies.createMultiple(poolsize, 'zombie');
    return zombies;
  },

  spawnZombie: function(zombiePool, x, y, runSpeed) {

    var zombie = zombiePool.getFirstDead();
    if(zombie == null) {
      return;
    }

    zombiegame.game.physics.enable(zombie, Phaser.Physics.ARCADE);
    zombie.reset(x, y);

    // set up frames for animation
    zombie.animations.add('right', [0, 1, 2, 3, 4, 5], 5, true);
    zombie.animations.play('right');

    zombie.speed = getRandomInt(5, 15);
    zombie.direction = getRandomInt(-1, 0) === -1 ? -1 : 1;
    zombie.body.velocity.x = -runSpeed + (zombie.speed * zombie.direction);
    zombie.body.collideWorldBounds = false;
    zombie.body.gravity.y = 500;
    zombie.body.setSize((zombie.width / zombie.scale.x) -5, (zombie.height / zombie.scale.y), 3, 0);

    if(zombie.body.velocity.x <= -runSpeed) {
      zombie.anchor.setTo(.5, .5);
      zombie.scale.x = -1;
    }

    return zombie;
  },

  createClouds: function(speed) {
    var clouds = zombiegame.game.add.group();

    var positions = [
      [-300, 20],
      [10, 50],
      [350, 80],
      [600, 40]
    ];

    for(var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var cloud = clouds.create(pos[0], pos[1], 'cloud');
      zombiegame.game.physics.enable(cloud, Phaser.Physics.ARCADE);
      cloud.body.velocity.x = -speed;
    }

    return clouds;
  },

  rotate: function(group) {
    if(group) {
      group.children.forEach(element => {
        if(element.x + element.width <= 0) {
          element.x = zombiegame.game.width + (element.x + element.width);
        }
      });
    }
  },

  createCityBackground(speed) {
    var cities = zombiegame.game.add.group();

    cities.create(0, 110, 'bgCity');
    cities.create(cities.children[0].width, 110, 'bgCity');
    cities.create(cities.children[0].width*2, 110, 'bgCity');
  
    cities.children.forEach(city => {
      zombiegame.game.physics.enable(city, Phaser.Physics.ARCADE);
      city.body.velocity.x = -speed; 
    });
    
    return cities;
  },

  updateSpeed: function(group, speed) {
    if(group) {
      group.children
        .filter(element => element.body)
        .forEach(element => element.body.velocity.x = -speed);
    }
  },

  checkZombieOutOfBounds(zombies) {
    if(zombies) {
      zombies.children
        .filter(zombie => zombie.body)
        .forEach(zombie => {
          if ((zombie.x + Math.abs(zombie.width) < -2*Math.abs(zombie.width) || zombie.y > zombiegame.game.height + zombie.height) && zombie.alive) {
            zombie.kill();
          }
        });
    }
  },

  updateZombiesSpeed: function(zombies, gamespeed) {
    if(zombies) {
      zombies.children
        .filter(zombie => zombie.body)
        .forEach(zombie => {
          zombie.body.velocity.x = -gamespeed + (zombie.speed * zombie.direction);
          if(zombie.body.velocity.x <= -gamespeed) {
            zombie.scale.x = -1;
          } else {
            zombie.scale.x = 1;
          }
        });
    }
  },

  rotateHouses: function(houseGroup) {
    if(houseGroup) {
      houseGroup.children.forEach((house, index) => {
        if(house.x + house.width < 0) {
          let previousHouse = houseGroup.children[index == 0 ? houseGroup.children.length-2 : index-1];

          house.x = zombiegame.game.width + getRandomInt(0, 50);
          house.y = previousHouse.y + (getRandomNegativeOrPositiveOne() * getRandomInt(0, 40));
          house.y = constrain(house.y, 210, 300);
        }
      });
    }
  },

  createHouse: function(x, y, key, houseGroup, speed = 0) {
    if(houseGroup === null || houseGroup === undefined) {
      houseGroup = zombiegame.game.add.group()
    }

    var house = houseGroup.create(x, y, key);
    zombiegame.game.physics.enable(house, Phaser.Physics.ARCADE);
    house.body.immovable = true;
    house.body.friction = new Phaser.Point(0, 0);
    house.body.velocity.x = -speed;
    return houseGroup;
  },

};
