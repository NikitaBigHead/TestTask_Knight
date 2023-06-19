const tileWidth = 26;
const tileHeight = 26;
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
                    tile.appendChild(_hp);
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
    placeEnemies(countEnemies);

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

