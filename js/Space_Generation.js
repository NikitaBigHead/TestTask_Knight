
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