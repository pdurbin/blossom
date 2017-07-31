// based on http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
var game = new Phaser.Game(400, 490, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() { 
        if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
            // to fit landscape on mobile
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#29abe2';

        game.load.image('bird', 'assets/blossom.png');  
        game.load.image('pipe', 'assets/cloud.png'); 

    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = game.add.sprite(10, 245, 'bird');
        this.bird.scale.setTo(0.1, 0.1);
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 
 
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        game.input.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000000" });  

    },

    update: function() {
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.restartGame(); 

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
            
        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;  
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;
            
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        pipe.scale.setTo(0.2, 0.2);
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        this.addOnePipe(400, 0 + (Math.random() * (400 - 100) + 100));   
        this.labelScore.text = this.score;  
        this.score += 1;
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 
