const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
};

const backgournd = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background/background.png'
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: './assets/decorations/shop_anim.png',
    scale: 2.75,
    framesMax: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/samurai/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 154
    },
    sprites: {
        idle: {
            imageSrc: './assets/samurai/Sprites/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/samurai/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/samurai/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samurai/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/samurai/Sprites/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './assets/samurai/Sprites/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './assets/samurai/Sprites/Death.png',
            framesMax: 6,
        },

    },
    attackBox: {
        offset: {
            x: 80,
            y: 40,
        },
        width: 170,
        height: 80
    },
});
const enemy = new Fighter({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './assets/kenji/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Sprites/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/kenji/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './assets/kenji/Sprites/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './assets/kenji/Sprites/Death.png',
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -150,
            y: 40,
        },
        width: 170,
        height: 80
    }
});

window.addEventListener('keydown', (e) => {
    if (player.dead || enemy.dead) return;
    switch (e.key) {
        case 'ArrowRight':
            keys.right.pressed = true;
            enemy.lastKey = 'right';
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            enemy.lastKey = 'left';
            break;
        case 'ArrowUp':
            if (enemy.velocity.y === 0) {
                enemy.velocity.y = -20;
            }
            break;
        case 'ArrowDown':
            enemy.attack();
            break;


        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            if (player.velocity.y === 0) {
                player.velocity.y = -20;
            }
            break;
        case ' ':
            player.attack();
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;

        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }
});



function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    backgournd.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprites('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprites('run');
    } else {
        player.switchSprites('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprites('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall');
    }

    enemy.velocity.x = 0;
    if (keys.left.pressed && enemy.lastKey === 'left') {
        enemy.velocity.x = -5;
        enemy.switchSprites('run');
    } else if (keys.right.pressed && enemy.lastKey === 'right') {
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    } else {
        enemy.switchSprites('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall');
    }

    //detect for collision
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy })
        && player.isAttacking
        && player.framesCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.takeHit(20);
        document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    }

    // if player miss
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    //detect for collision
    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player })
        && enemy.isAttacking
        && enemy.framesCurrent === 2
    ) {
        enemy.isAttacking = false;
        player.takeHit(10);
        document.querySelector("#playerHealth").style.width = `${player.health}%`;
    }

    // if enemy miss
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

decreaseTimer();
animate();