
function placeItems(item, count) {
    let itemsPlaced = 0;

    while (itemsPlaced < count) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x].entity === _void) {
            map[y][x].entity = item;
            itemsPlaced++;
        }
    }
}

function placeHero() {
    let heroPlaced = false;

    while (!heroPlaced) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x].entity === _void) {

            map[y][x].entity = player;

            map[y][x].classEntity = new Player(x,y,heroHP,heroDamage);
            map[y][x].classEntity.setListeners()

            heroPlaced = true;

        }
    }
}


function placeEnemies(count) {
    let enemiesPlaced = 0;

    while (enemiesPlaced < count) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x].entity === _void) {
            map[y][x].entity = enemy;

            let hero = findEntities(player);
             map[y][x].classEntity = 
            new Enemy(x,y,enemyHP, enemyDamage,enemyViewingRadius,hero[0].classEntity);
            enemiesPlaced++;
        }
    }
}