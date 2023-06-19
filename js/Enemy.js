const countEnemies = 10;
const enemyDamage = 5;
const enemyHP = 100;
const enemyViewingRadius = 5;

class Enemy extends Entity{
    state = "Patrol";
    radius = 5;
    constructor(x,y,hp, damage,radius, hero){
        super(x,y,hp, damage);
        this.radius = radius;
        this.hero = hero;
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
        this.state = this.checkZone(this.radius);

        let newX = 0;
        let newY = 0;
        if(this.state === "Patrol"){
            newX = this.x + getRandomInt(-1, 1);
            newY = this.y + getRandomInt(-1, 1);
        }
        else if(this.state === "Attack"){

            let dist = this.hero.x - this.x;
            let dirHor;
            if(dist === 0){
                dirHor = 0;
            }
            else{
                dirHor = dist/Math.abs(dist)
            }

            dist = this.hero.y - this.y;
            let dirVert;
            if(dist === 0){
                dirVert = 0;
            }
            else{
                dirVert = dist/ Math.abs(dist);
            }
            newX = this.x + dirHor;
            newY = this.y + dirVert;
        }

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
    checkZone(radius){
        let xView = this.x - this.radius;
        let yView = this.y - this.radius;
        for(let y = yView; y < yView +  this.radius * 2 + 1; y++){
            for(let x = xView;x <xView +  this.radius * 2 + 1; x++){
                try{
                    if(map[y][x].entity === player){
                        return "Attack";
                    }
                }
                catch(e){
                }
            }
        }
        return "Patrol";
    }

}