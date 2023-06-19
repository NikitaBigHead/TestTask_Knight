const countEnemies = 10;
const enemyDamage = 10;
const enemyHP = 100;


class Enemy extends Entity{
    state = "";
    
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }
    attack() {
        let adjacentCells = super.getAdjacentCells();
        adjacentCells.forEach((cell) => {
            const entity = map[cell.y][cell.x].entity;
            if (entity === player) {
                map[cell.y][cell.x].classEntity.onHit(this.damage);

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