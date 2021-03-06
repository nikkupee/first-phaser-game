/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {}


game_state.main = function() {};
game_state.main.prototype = {


    preload: function() {
        game.load.image('sky', 'assets/sky.png')
        game.load.image('ground', 'assets/platform.png')
        game.load.image('star', 'assets/star.png')
        game.load.spritesheet('fiona', 'assets/fiona.png', 128, 128)
        game.load.image('diamond', 'assets/diamond.png')

    },


    create: function() {
        //We're gonna be using physics, so we're gonna enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);


        game.add.sprite(0, 0, 'star')
        game.add.sprite(0, 0, 'sky')
        game.add.sprite(0, 0, 'diamond')
        
            // The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = game.add.group();


        // We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;


        //Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');


        //Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);


        //This stops it from fallings away when you jump on it
        ground.body.immovable = true


        //Create some ledges
        var ledge = this.platforms.create(150, 160, 'ground');
        ledge.body.immovable = true;

        var ledge = this.platforms.create(300, 300, 'ground');
        ledge.body.immovable = true;
        
        var ledge = this.platforms.create(0, 480, 'ground');
        ledge.body.immovable = true;


        //The physics for this.player
        this.player = game.add.sprite(150, game.world.height - 487, 'fiona')

        //Enabling physics for this.player
        game.physics.arcade.enable(this.player);


        //Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.5;
        this.player.body.gravity.y = 300
        this.player.body.collideWorldBounds = true;


        //Our animations, left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //Our controls.
        this.cursors = game.input.keyboard.createCursorKeys();

        //Finally some this.stars to collect
        this.stars = game.add.group();

        //Will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        //Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //Create a star inside of the 'this.stars' group
            var star = this.stars.create(i * 70, 0, 'star');
            
            for(var d = 0; d < 10; i++){
                var diamond = this.diamond.create(i * 70, 0, 'diamond')
            }

            //Let gravity WORK
            star.body.gravity.y = 300;

            //This gives each star a slightly different bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //The this.score
        this.scoreText = game.add.text(16, 16, 'score:0', {
            fontSize: '32px',
            fill: '#000'
        });
        
        this.score=0;
        

    },


    update: function() {
        //Collide the player and the platforms
        game.physics.arcade.collide(this.player, this.platforms);

        //Reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }

        else if (this.cursors.right.isDown) {
            //Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }

        else {
            //Stand still
            this.player.animations.stop();
            this.player.frame = (0,1);
        }

        //Allows this.player to jump if they are touching the ground
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }

        //Collide the stars and the platforms
        game.physics.arcade.collide(this.stars, this.platforms);

        //Checks to see if this.player overlaps with any of this.stars, if true, call the collectStar function
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

    },

    collectStar: function(player, star) {
        //Remove the star from the screen
        star.kill();
        this.scoreText.text="Score:"+this.score;
        this.score+=5;
    }


}
game.state.add('main', game_state.main);
game.state.start('main');
