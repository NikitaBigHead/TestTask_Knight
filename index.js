const tileWidth = 30;
const tileHeight = 30;
const mapWidth = 40;
const mapHeight = 24;
const map = [];

const minRoomsOffset = 3;
let rooms  = [];


const player = "P";
const enemy = "E";
const wall = "W";
const healtPotion = "HP";
const sword = "SW";
const _void = ".";
const passage  = "#";

let hero;
let enemies_arr = [];


const audios = {
    swordSwing: new Audio("./audio/sword_swing.mp3"),
    swordHit:new Audio("./audio/sword_hit.mp3"),
    death: new Audio("./audio/death2.mp3"),
    hit:new Audio("./audio/hit.mp3"),
};

let keyDownAllow = true;




function initializeMap() {
    for (let y = 0; y < mapHeight; y++) {
        const row = [];
        for (let x = 0; x < mapWidth; x++) {
            row.push(wall); 
        }
        map.push(row);
    }
}

function debugMap() {
    s = "";
    for (let y = 0; y < mapHeight; y++) {
        const row = [];
        for (let x = 0; x < mapWidth; x++) {
            s+= map[y][x];
        }
        console.log(s);
        s = "";
        map.push(row);
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function placeRooms(minRooms, maxRooms, minWidth, maxWidth, minHeight, maxHeight) {
    const roomCount = getRandomInt(minRooms, maxRooms);

    for (let i = 0; i < roomCount; i++) {
        const roomWidth = getRandomInt(minWidth, maxWidth);
        const roomHeight = getRandomInt(minHeight, maxHeight);
        let roomX, roomY;

        let attempts = 0;
        const maxAttempts = 50;

        do {
            roomX = getRandomInt(0, mapWidth - roomWidth - 1);
            roomY = getRandomInt(0, mapHeight - roomHeight - 1);
            attempts++;
        } while (roomOverlaps(roomX, roomY, roomWidth, roomHeight) && attempts < maxAttempts);

        if (attempts === maxAttempts) {
            // Reached maximum attempts, skip placing this room
            continue;
        }

        rooms.push(new Room(roomX,roomY,roomWidth,roomHeight));

        for (let y = roomY; y < roomY + roomHeight; y++) {
            for (let x = roomX; x < roomX + roomWidth; x++) {
                map[y][x] = _void;
            }
        }
    }
}

function roomOverlaps(roomX, roomY, roomWidth, roomHeight) {
    for (let y = roomY - minRoomsOffset; y < roomY + roomHeight + minRoomsOffset; y++) {
        for (let x = roomX - minRoomsOffset; x < roomX + roomWidth + minRoomsOffset; x++) {
            if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) {
                return true;
            }

            if (map[y][x] === _void ){
                return true;
            }
        }
    }
    return false;
}


function placePassages(minPassages, maxPassages) {
    const horizontalPassages = getRandomInt(Math.floor(minPassages/2),Math.floor(maxPassages/2));
    const verticalPassages = getRandomInt(Math.floor(minPassages/2), Math.floor(maxPassages/2));

    for (const room of rooms) {
        for (let i = 0; i < horizontalPassages; i++) {
            const y = getRandomInt(room.y, room.y + room.height);
            if(checkCountPassages(room,maxPassages)){
                fillPassage(y,"horiz");
            }
        }
        for (let i = 0; i < verticalPassages; i++) {
            const x = getRandomInt(room.x, room.x + room.width);
            if(checkCountPassages(room,maxPassages)){
                fillPassage(x,"vert");
            }
        }
    }

    fillVoidPassages();
}
function fillPassage(coord,dir){
    if(dir === "horiz" ){
        for(x = 0;x <map[0].length;x++){
            map[coord][x] = passage;
        }
    }
    else if(dir ==="vert"){
        for(y = 0;y<map.length;y++){
            map[y][coord] = passage;
        }
    }
}
function checkCountPassages(room,maxPassages){
    width = room.width;
    height = room.height;

    count = 0

    for(y = room.y; y < room.y + height;y++){
        if(map[y][0] === passage){
            count++;
        }
    }
    for(x = room.x + 1; x < room.x + width - 1; x++){
        if(map[0][x] === passage){
            count++;
        }
    }

    if(count >= Math.floor
        (maxPassages/2)){
        return false;
    }
    return true;
}
function fillVoidPassages(){
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if(map[y][x] === passage){
                map[y][x] = _void;
            }
        }
    }
}
function placeItems(item, count) {
    let itemsPlaced = 0;

    while (itemsPlaced < count) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x] === _void) {
            map[y][x] = item;
            itemsPlaced++;
        }
    }
}


function placeHero() {
    let heroPlaced = false;

    while (!heroPlaced) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x] === _void) {

            map[y][x] = player;

            hero = new Player(x,y,100,25);

            heroPlaced = true;

        }
    }
}


function placeEnemies(count) {
    let enemiesPlaced = 0;

    while (enemiesPlaced < count) {
        const x = getRandomInt(0, mapWidth - 1);
        const y = getRandomInt(0, mapHeight - 1);

        if (map[y][x] === _void) {
            map[y][x] = enemy;

            enemies_arr.push();
            enemiesPlaced++;
        }
    }
}




function isCellValid(x, y) {
    return x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;
}




function findEntity(entity) {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y][x] === entity) {
                return { x, y };
            }
        }
    }
    return null;
}




function moveEnemiesRandomly() {
    const enemies = findEntities(enemy);

    enemies.forEach((_enemy) => {
        const newX = getRandomInt(-1, 1);
        const newY = getRandomInt(-1, 1);

        if (isCellValid(_enemy.x + newX, _enemy.y + newY)) {
            const entity = map[_enemy.y + newY][_enemy.x + newX];
            if (entity === _void) {
                map[_enemy.y][_enemy.x] = _void;
                map[_enemy.y + newY][_enemy.x + newX] = enemy;
            } else if (entity === player) {
                enemyAttack(_enemy.x + newX, _enemy.y + newY);
            }
        }
    });
}

function findEntities(entity){
    entities = [];
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y][x] === entity) {
                entities.push ({ x, y });
            }
        }
    }
    return entities;
}



function enemyAttack(enemy) {
    adjacentCells = getAdjacentCells(enemy);
    adjacentCells.forEach((cell) => {
        const entity = map[cell.y][cell.x];
        if (entity === player) {
            map[cell.y][cell.x] = _void;
        }
    });
}



function renderMap() {
    const field = document.querySelector(".field");

    field.innerHTML = "";

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.left = `${x * tileWidth}px`;
            tile.style.top = `${y * tileHeight}px`;
            switch (map[y][x]) {
                case wall:
                    tile.classList.add("tileW");
                    break;
                case enemy:
                    tile.classList.add("tileE");
                    break;
                case player:
                    tile.classList.add("tileP");
                    break;
                case healtPotion:
                    tile.classList.add("tileHP");
                    break;
                case sword:
                    tile.classList.add("tileSW");
                    break;
                case _void:
                    tile.classList.add("tile-");
                    break;
                case passage:
                    tile.classList.add("tile-");
                    break;
                default:
                    break;
            }

            field.appendChild(tile);
        }
    }
}
function getAdjacentCells(entity) {
    x = entity.x;
    y = entity.y;
    const adjacentCells = [
        { x: x, y: y - 1 }, 
        { x: x, y: y + 1 },
        { x: x - 1, y: y }, 
        { x: x + 1, y: y }, 
        { x: x - 1, y: y - 1 }, 
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y + 1 }, 
        { x: x + 1, y: y - 1}, 
    ];
    return adjacentCells;
}
function startGame(fps) {

    initializeMap();
    placeRooms(5, 10, 3, 8, 3, 8);
    placePassages(3, 5);

    placeItems(sword, 2);  
    placeItems(healtPotion, 10);  
    placeHero();
    placeEnemies(10);

    renderMap();


    document.addEventListener("keydown",(key)=>{hero.move(key.key);keyDownAllow = false;},false);
    document.addEventListener("keyup",()=>{keyDownAllow = true},false);

    document.addEventListener("keydown",(key)=>{hero.attack(key.key);keyDownAllow = false;},false);
    document.addEventListener("keyup",()=>{keyDownAllow = true},false);

    let interval = Math.floor(200);
    setInterval(()=>{moveEnemiesRandomly()},interval)

}


class Room{
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Entity{
    constructor(x,y,hp, damage){
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.damage = damage;
    }
    setCoords(x,y){
        this.x = x;
        this.y = y;
    }

    onHit(damage){
        this.hp-= damage;
        if(this.hp<=0){
            this.die();
        }

        audios.hit.currentTime = 0;
        audios.hit.play();

    }
    die(){
        map[this.y][this.x] = _void;
        audios.death.play();
    }

    getAdjacentCells() {
        x = this.x;
        y = this.y;
        const adjacentCells = [
            { x: x, y: y - 1 }, 
            { x: x, y: y + 1 },
            { x: x - 1, y: y }, 
            { x: x + 1, y: y }, 
            { x: x - 1, y: y - 1 }, 
            { x: x + 1, y: y + 1 },
            { x: x - 1, y: y + 1 }, 
            { x: x + 1, y: y - 1}, 
        ];
        return adjacentCells;
    }
    isCellValid(x, y) {
        return x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;
    }
}

class Player extends Entity{
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }

    attack(key) {

        if(key!=" " && !keyDownAllow){
            return;
        }

        let adjacentCells = super.getAdjacentCells();
        adjacentCells.forEach((cell) => {
            const entity = map[cell.y][cell.x];
            if (entity === enemy) {
                map[cell.y][cell.x] = _void;
            }
        });
    
        audios.swordSwing.currentTime = 0;
        audios.swordSwing.play();
    }

    move(key) {
        if(!keyDownAllow){
            return;
        }
        let newX = this.x;
        let newY = this.y;

        switch (key) {
            case "w": 
                newY -= 1;
                break;
            case "s":
                newY += 1;
                break;
            case "a":
                newX -= 1;
                break;
            case "d":
                newX += 1;
                break;
            default:
                return;
        }

        if (super.isCellValid(newX, newY)) {
            const entity = map[newY][newX];
            
            if (entity === _void) {
                map[this.y][this.x] = _void;
                map[newY][newX] = player;
                super.setCoords(newX,newY);

            } else if (entity === sword) {
                map[this.y][this.x] = _void;
                map[newY][newX] = player;
                increaseHeroAttack();
                super.setCoords(newX,newY);

            } else if (entity === healtPotion) {
                map[this.y][this.x] = _void;
                map[newY][newX] = player;
                healHero();
                super.setCoords(newX,newY);
            }
        }
    }

    increaseAttack() {
        this.damage+=25;
    }
    heal() {
        this.hp+=50;
    }

}

class Enemy extends Entity{
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }
    attack() {
        adjacentCells = super.getAdjacentCells();
        adjacentCells.forEach((cell) => {
            const entity = map[cell.y][cell.x];
            if (entity === player) {

                //map[cell.y][cell.x] = _void;
                hero.hp-= this.damage;
            }
        });
    }
    move(){
        const newX = getRandomInt(-1, 1);
        const newY = getRandomInt(-1, 1);

        if (super.isCellValid(this.x + newX, this.y + newY)) {

            const entity = map[this.y + newY][this.x + newX];

            if (entity === _void) {

                map[this.y][this.x] = _void;
                map[this.y + newY][this.x + newX] = enemy;

            } else if (entity === player) {

                this.attack(this.x + newX, this.y + newY);

            }
        }
    }

}
class Game{
    init(){
        let fps = 60;

        let interval = Math.floor( 1000/fps);
        console.log(interval);

        startGame(fps);

        setInterval(() => {
            renderMap();
        }, interval);
    }
}

