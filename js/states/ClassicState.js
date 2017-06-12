var Bomberman = Bomberman || {};

Bomberman.ClassicState = function () {
    "use strict";
    Bomberman.TiledState.call(this);
};

Bomberman.ClassicState.prototype = Object.create(Bomberman.TiledState.prototype);
Bomberman.ClassicState.prototype.constructor = Bomberman.ClassicState;

Bomberman.ClassicState.prototype.init_hud = function () {
    "use strict";
    var player1_lives_position, player1_lives_properties, player1_lives, player2_lives_position, player2_lives_properties, player2_lives;
    
    // create the lives prefab for player1
    player1_lives_position = new Phaser.Point(0.1 * this.game.world.width, 0.07 * this.game.world.height);
    player1_lives_properties = {group: "hud", texture: "heart_image", player: "player1"};
    player1_lives = new Bomberman.Lives(this, "lives", player1_lives_position, player1_lives_properties);
    
    // create the lives prefab for player2
    player2_lives_position = new Phaser.Point(0.9 * this.game.world.width, 0.07 * this.game.world.height);
    player2_lives_properties = {group: "hud", texture: "heart_image", player: "player2"};
    player2_lives = new Bomberman.Lives(this, "lives", player2_lives_position, player2_lives_properties);
};

Bomberman.ClassicState.prototype.game_over = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/level1.json", "ClassicState");
};

Bomberman.ClassicState.prototype.next_level = function () {
    "use strict";
    console.log(this.prefabs, this.levelData);
    var i = 1, player;
    while (player = this.prefabs['player' + i]) {
        console.log(player, i);
        localStorage['player' + i++] = JSON.stringify({
            number_of_lives : player.number_of_lives,
            number_of_bombs : player.number_of_bombs
        });
    }

    console.log(localStorage);
    this.game.state.start("BootState", true, false, this.level_data.next_level, "ClassicState");
};
