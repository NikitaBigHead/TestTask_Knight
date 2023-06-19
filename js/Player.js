const heroDamage = 25;
const heroHP = 100;


class Player extends Entity{
    constructor(x,y,hp, damage){
        super(x,y,hp, damage);
    }

    setListeners(){
        document.addEventListener("keydown",(key)=>{this.move(key.code);keyDownAllow = false;},false);
        document.addEventListener("keyup",()=>{keyDownAllow = true},false);
    
        document.addEventListener("keydown",(key)=>{this.attack(key.code);keyDownAllow = false;},false);
        document.addEventListener("keyup",()=>{keyDownAllow = true},false);
    }
    attack(key) {

        if(key!="Space" && !keyDownAllow){
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
            case "KeyW": 
                newY -= 1;
                break;
            case "KeyS":
                newY += 1;
                break;
            case "KeyA":
                newX -= 1;
                break;
            case "KeyD":
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