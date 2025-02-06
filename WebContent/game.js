let socket = new WebSocket("ws://localhost:8080/ws");
let players = {};

class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.localPlayer = this.add.image(400, 300, 'player');

        socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (data.players) {
                for (let id in data.players) {
                    if (!players[id]) {
                        players[id] = this.add.image(data.players[id].x, data.players[id].y, 'player');
                    } else {
                        players[id].x = data.players[id].x;
                        players[id].y = data.players[id].y;
                    }
                }
            }
        };
    }

    update() {
        let dx = 0, dy = 0;
        if (this.cursors.left.isDown) dx -= 5;
        if (this.cursors.right.isDown) dx += 5;
        if (this.cursors.up.isDown) dy -= 5;
        if (this.cursors.down.isDown) dy += 5;

        if (dx !== 0 || dy !== 0) {
            this.localPlayer.x += dx;
            this.localPlayer.y += dy;
            socket.send(`move:${dx},${dy}`);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene
};

const game = new Phaser.Game(config);
