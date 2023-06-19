class Entity{
    x = 0; 
    y = 0; 
    hp = 0;
    damage = 0;
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
