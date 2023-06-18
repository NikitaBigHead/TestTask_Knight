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


const audios = {
    swordSwing: new Audio("./audio/sword_swing.mp3"),
    swordHit:new Audio("./audio/sword_hit.mp3"),
    death: new Audio("./audio/death2.mp3"),
    hit:new Audio("./audio/hit.mp3"),
    gotEnergy: new Audio("./audio/got_energy.mp3"),
    gotHeal:new Audio("./audio/got_heal.mp3"),
};


const musics = { 
    fight: new Audio("./audio/fight.mp3"),
    fail: new Audio("./audio/fail.mp3")
};

let keyDownAllow = true;


function initializeMap() {
    for (let y = 0; y < mapHeight; y++) {
        const row = [];
        for (let x = 0; x < mapWidth; x++) {
            row.push({entity:wall,classEntity:null}); 
        }
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
            continue;
        }

        rooms.push(new Room(roomX,roomY,roomWidth,roomHeight));

        for (let y = roomY; y < roomY + roomHeight; y++) {
            for (let x = roomX; x < roomX + roomWidth; x++) {
                map[y][x].entity = _void;
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

            if (map[y][x].entity === _void ){
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
        for(let x = 0;x <map[0].length;x++){
            map[coord][x].entity = passage;
        }
    }
    else if(dir ==="vert"){
        for(let y = 0;y<map.length;y++){
            map[y][coord].entity = passage;
        }
    }
}
function checkCountPassages(room,maxPassages){
    width = room.width;
    height = room.height;

    count = 0

    for(let y = room.y; y < room.y + height;y++){
        if(map[y][0].entity === passage){
            count++;
        }
    }
    for(let x = room.x + 1; x < room.x + width - 1; x++){
        if(map[0][x].entity === passage){
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
            if(map[y][x].entity === passage){
                map[y][x].entity = _void;
            }
        }
    }
}

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

            map[y][x].classEntity = new Player(x,y,100,25);
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

             map[y][x].classEntity = new Enemy(x,y,100, 5);
            enemiesPlaced++;
        }
    }
}

function moveEnemiesRandomly() {
    const enemies = findEntities(enemy);
    enemies.forEach((_enemy) => {
        _enemy.classEntity.move();
    });

}

function findEntities(entity){
    entities = [];
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y][x].entity === entity) {
                entities.push (map[y][x]);
            }
        }
    }
    return entities;
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

            let _hp; 
            try{
                _hp = document.createElement("div");
                _hp.classList.add("health");
                _hp.style.width = map[y][x].classEntity.hp + "%";
            }
            catch(e){}

            switch (map[y][x].entity) {
                case wall:
                    tile.classList.add("tileW");
                    break;
                case enemy:
                    tile.classList.add("tileE");
                    break;
                case player:
                    tile.classList.add("tileP");
                    tile.appendChild(_hp);
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

function startGame(fps) {

    initializeMap();
    placeRooms(5, 10, 3, 8, 3, 8);
    placePassages(3, 5);

    placeItems(sword, 2);  
    placeItems(healtPotion, 10);  
    placeHero();
    placeEnemies(10);

    renderMap();

    let interval = Math.floor(200);
    setInterval(()=>{moveEnemiesRandomly()},interval)

    document.addEventListener("keydown",()=>{musics.fight.play();}, true);
    

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
    x = 0; 
    y = 0; 
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
        map[this.y][this.x].entity = _void;
        map[this.y][this.x].classEntity = null;
        audios.death.play();
    }

    getAdjacentCells() {
        let x = this.x;
        let y = this.y;

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
    cellReplacement(entity,newX,newY){
        map[this.y][this.x].entity = _void;
        map[newY][newX].entity = entity;

        map[this.y][this.x].classEntity = null;
        map[newY][newX].classEntity = this;
    }
}

class Player extends Entity{
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }

    setListeners(){
        document.addEventListener("keydown",(key)=>{this.move(key.key);keyDownAllow = false;},false);
        document.addEventListener("keyup",()=>{keyDownAllow = true},false);
    
        document.addEventListener("keydown",(key)=>{this.attack(key.key);keyDownAllow = false;},false);
        document.addEventListener("keyup",()=>{keyDownAllow = true},false);
    }
    attack(key) {

        if(key!=" " && !keyDownAllow){
            return;
        }

        let adjacentCells = super.getAdjacentCells();
        adjacentCells.forEach((cell) => {
            const entity = map[cell.y][cell.x].entity;
            if (entity === enemy) {

                map[cell.y][cell.x].classEntity.onHit(this.damage);
                audios.hit.currentTime = 0;
                audios.hit.play();

            }
        });
    
        audios.swordSwing.currentTime = 0;
        audios.swordSwing.play();
    }

    increaseAttack() {
        this.damage+= 25;
        console.log(this.damage);
    }
    heal() {
        this.hp+= 50;
        if(this.hp>=100){
            this.hp = 100;
        }
    }
    die(){
        super.die();
        musics.fight.pause();
        musics.fail.play();
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
            const entity = map[newY][newX].entity;
            
            if (entity === _void) {

                super.cellReplacement(player,newX,newY);
                super.setCoords(newX,newY);

            } else if (entity === sword) {

                this.increaseAttack();
                super.cellReplacement(player,newX,newY);
                super.setCoords(newX,newY);

                audios.gotEnergy.currentTime = 0;
                audios.gotEnergy.play();

            } else if (entity === healtPotion) {

                this.heal();
                super.cellReplacement(player,newX,newY);
                super.setCoords(newX,newY);

                audios.gotHeal.currentTime = 0;
                audios.gotHeal.play();
            }
        }
    }


}

class Enemy extends Entity{
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }
    attack() {
        let adjacentCells = super.getAdjacentCells();
        adjacentCells.forEach((cell) => {
            const entity = map[cell.y][cell.x].entity;
            if (entity === player) {
                map[cell.y][cell.x].classEntity.onHit(this.damage);
                console.log(map[cell.y][cell.x].classEntity.hp);
            }
        });
    }
    move(){
        const newX = this.x + getRandomInt(-1, 1);
        const newY = this.y + getRandomInt(-1, 1);

        if (super.isCellValid(newX, newY)) {
            const entity = map[newY][newX].entity;
            if (entity === _void) {

                super.cellReplacement(enemy,newX, newY);
                super.setCoords(newX, newY);


            } else if (entity === player) {

                this.attack();
            }
        }
    }

}
class Game{
    init(){
        let fps = 60;
        let interval = Math.floor( 1000/fps);
        startGame(fps);

        setInterval(() => {
            renderMap();
        }, interval);
    }
}

