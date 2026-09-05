function generateMap(){
    let map = [];

    for(let x = 0; x < MSIZE; x++){
        map[x] = [];

        for(let y = 0; y < MSIZE; y++){
            map[x][y] = 1;
        }
    }

    let startSide = Math.floor(Math.random() * 2);

    let startCoord =
        1 + 2 * Math.floor(
            Math.random() * Math.floor((MSIZE - 1) / 2)
        );

    let sx;
    let sy;

    if(startSide == 0){
        sx = 1;
        sy = startCoord;
    }else{
        sx = startCoord;
        sy = 1;
    }

    if(startSide == 0){
        map[0][sy] = -1;
    }else{
        map[sx][0] = -1;
    }

    let directions = [
        [-2, 0],
        [ 2, 0],
        [ 0,-2],
        [ 0, 2]
    ];

    let visited = [];

    for(let x = 0; x < MSIZE; x++){
        visited[x] = [];

        for(let y = 0; y < MSIZE; y++){
            visited[x][y] = false;
        }
    }

    let stack = [];

    let cx = sx;
    let cy = sy;

    map[cx][cy] = 0;
    visited[cx][cy] = true;

    stack.push([cx, cy]);

    while(stack.length > 0){

        let current = stack[stack.length - 1];

        cx = current[0];
        cy = current[1];

        let possibleDirections = [];

        for(let i = 0; i < directions.length; i++){

            let dx = directions[i][0];
            let dy = directions[i][1];

            let nx = cx + dx;
            let ny = cy + dy;

            if(
                nx <= 0 ||
                nx >= MSIZE - 1 ||
                ny <= 0 ||
                ny >= MSIZE - 1
            ){
                continue;
            }

            if(!visited[nx][ny]){
                possibleDirections.push(directions[i]);
            }
        }

        if(possibleDirections.length == 0){
            stack.pop();
            continue;
        }

        let d =
            possibleDirections[
                Math.floor(
                    Math.random() * possibleDirections.length
                )
            ];

        let nx = cx + d[0];
        let ny = cy + d[1];

        let wallX = cx + d[0] / 2;
        let wallY = cy + d[1] / 2;

        map[wallX][wallY] = 0;

        map[nx][ny] = 0;
        visited[nx][ny] = true;

        stack.push([nx, ny]);
    }

    let extraPaths = Math.floor(
        MSIZE * MSIZE * 0.10
    );

    for(let i = 0; i < extraPaths; i++){

        let x =
            1 + Math.floor(
                Math.random() * (MSIZE - 2)
            );

        let y =
            1 + Math.floor(
                Math.random() * (MSIZE - 2)
            );

        if(map[x][y] != 1){
            continue;
        }

        let horizontal =
            x > 0 &&
            x < MSIZE - 1 &&
            map[x - 1][y] == 0 &&
            map[x + 1][y] == 0;

        let vertical =
            y > 0 &&
            y < MSIZE - 1 &&
            map[x][y - 1] == 0 &&
            map[x][y + 1] == 0;

        if(horizontal || vertical){
            map[x][y] = 0;
        }
    }

    let exitCoord =
        1 + 2 * Math.floor(
            Math.random() * Math.floor((MSIZE - 1) / 2)
        );

    if(startSide == 0){

        let ex = MSIZE - 2;
        let ey = exitCoord;

        map[ex][ey] = 0;
        map[MSIZE - 1][ey] = -2;

    }else{

        let ex = exitCoord;
        let ey = MSIZE - 2;

        map[ex][ey] = 0;
        map[ex][MSIZE - 1] = -2;
    }

    if(startSide == 0){
        map[1][sy] = 0;
    }else{
        map[sx][1] = 0;
    }

    return map;
}        [ 0,-2],
        [ 0, 2]
    ];

    let visited = [];

    for(let x = 0; x < MSIZE; x++){
        visited[x] = [];

        for(let y = 0; y < MSIZE; y++){
            visited[x][y] = false;
        }
    }

    let stack = [];

    let cx = sx;
    let cy = sy;

    map[cx][cy] = 0;
    visited[cx][cy] = true;

    stack.push([cx, cy]);

    while(stack.length > 0){

        let current = stack[stack.length - 1];

        cx = current[0];
        cy = current[1];

        let possibleDirections = [];

        for(let i = 0; i < directions.length; i++){

            let dx = directions[i][0];
            let dy = directions[i][1];

            let nx = cx + dx;
            let ny = cy + dy;

            if(
                nx <= 0 ||
                nx >= MSIZE - 1 ||
                ny <= 0 ||
                ny >= MSIZE - 1
            ){
                continue;
            }

            if(!visited[nx][ny]){
                possibleDirections.push(directions[i]);
            }
        }

        if(possibleDirections.length == 0){
            stack.pop();
            continue;
        }

        let d =
            possibleDirections[
                Math.floor(
                    Math.random() * possibleDirections.length
                )
            ];

        let nx = cx + d[0];
        let ny = cy + d[1];

        let wallX = cx + d[0] / 2;
        let wallY = cy + d[1] / 2;

        map[wallX][wallY] = 0;

        map[nx][ny] = 0;
        visited[nx][ny] = true;

        stack.push([nx, ny]);
    }

    let exitCoord =
        1 + 2 * Math.floor(Math.random() * Math.floor((MSIZE - 1) / 2));

    if(startSide == 0){
        let ex = MSIZE - 2;
        let ey = exitCoord;

        map[ex][ey] = 0;
        map[MSIZE - 1][ey] = -2;
        map[MSIZE - 2][ey] = 0;

    }else{
        let ex = exitCoord;
        let ey = MSIZE - 2;

        map[ex][ey] = 0;
        map[ex][MSIZE - 1] = -2;
        map[ex][MSIZE - 2] = 0;
    }

    if(startSide == 0){
        map[1][sy] = 0;
    }else{
        map[sx][1] = 0;
    }

    return map;
}
