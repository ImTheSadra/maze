const MSIZE = 30;

let main_map = [];

let aiRunning = false;
let aiFinished = false;

let openSet = [];
let closedSet = [];

let cameFrom = new Map();

let gScore = new Map();
let fScore = new Map();

let currentNode = null;

let finalPath = [];
let pathIndex = 0;

const TARGET_FPS = 30;
const AI_STEPS_PER_SECOND = 8;

let lastAIStep = 0;


function nodeKey(x, y){
    return `${x},${y}`;
}


function heuristic(x1, y1, x2, y2){
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


function isWalkable(x, y){

    if(
        x < 0 ||
        x >= MSIZE ||
        y < 0 ||
        y >= MSIZE
    ){
        return false;
    }

    return (
        main_map[x][y] == 0 ||
        main_map[x][y] == -1 ||
        main_map[x][y] == -2
    );
}


function findStartAndEnd(){

    let start = null;
    let end = null;

    for(let x = 0; x < MSIZE; x++){

        for(let y = 0; y < MSIZE; y++){

            if(main_map[x][y] == -1){
                start = {x, y};
            }

            if(main_map[x][y] == -2){
                end = {x, y};
            }
        }
    }

    return {
        start,
        end
    };
}


function startAI(){

    if(aiRunning){
        return;
    }

    aiRunning = true;
    aiFinished = false;

    openSet = [];
    closedSet = [];

    cameFrom = new Map();

    gScore = new Map();
    fScore = new Map();

    currentNode = null;

    finalPath = [];
    pathIndex = 0;

    lastAIStep = millis();

    let {start, end} = findStartAndEnd();

    if(!start || !end){
        aiRunning = false;
        console.log("AI got lost before starting 🥲");
        return;
    }

    let startKey = nodeKey(start.x, start.y);

    gScore.set(startKey, 0);

    fScore.set(
        startKey,
        heuristic(
            start.x,
            start.y,
            end.x,
            end.y
        )
    );

    openSet.push({
        x: start.x,
        y: start.y
    });
}


function aiStep(){

    if(openSet.length == 0){

        aiRunning = false;
        aiFinished = true;

        console.log("AI gave up 😭");
        return;
    }

    let {end} = findStartAndEnd();

    let bestIndex = 0;

    for(let i = 1; i < openSet.length; i++){

        let a = openSet[i];
        let b = openSet[bestIndex];

        let af =
            fScore.get(
                nodeKey(a.x, a.y)
            ) ?? Infinity;

        let bf =
            fScore.get(
                nodeKey(b.x, b.y)
            ) ?? Infinity;

        if(af < bf){
            bestIndex = i;
        }
    }

    currentNode =
        openSet.splice(
            bestIndex,
            1
        )[0];

    let currentKey = nodeKey(
        currentNode.x,
        currentNode.y
    );

    if(
        currentNode.x == end.x &&
        currentNode.y == end.y
    ){

        buildPath(currentNode);

        aiRunning = false;
        aiFinished = true;

        console.log("AI found the treasure! 🏆");
        return;
    }

    closedSet.push({
        x: currentNode.x,
        y: currentNode.y
    });

    let directions = [
        [-1, 0],
        [ 1, 0],
        [ 0,-1],
        [ 0, 1]
    ];

    for(let i = 0; i < directions.length; i++){

        let d = directions[i];

        let nx = currentNode.x + d[0];
        let ny = currentNode.y + d[1];

        if(!isWalkable(nx, ny)){
            continue;
        }

        let neighbourKey =
            nodeKey(nx, ny);

        let alreadyClosed =
            closedSet.some(node =>
                node.x == nx &&
                node.y == ny
            );

        if(alreadyClosed){
            continue;
        }

        let tentativeG =
            (gScore.get(currentKey) ?? Infinity) + 1;

        let oldG =
            gScore.get(neighbourKey) ?? Infinity;

        if(tentativeG < oldG){

            cameFrom.set(
                neighbourKey,
                currentKey
            );

            gScore.set(
                neighbourKey,
                tentativeG
            );

            fScore.set(
                neighbourKey,
                tentativeG +
                heuristic(
                    nx,
                    ny,
                    end.x,
                    end.y
                )
            );

            let alreadyOpen =
                openSet.some(node =>
                    node.x == nx &&
                    node.y == ny
                );

            if(!alreadyOpen){

                openSet.push({
                    x: nx,
                    y: ny
                });
            }
        }
    }
}


function buildPath(current){

    let {start} = findStartAndEnd();

    finalPath = [];

    let currentKey =
        nodeKey(
            current.x,
            current.y
        );

    finalPath.push({
        x: current.x,
        y: current.y
    });

    while(
        currentKey !=
        nodeKey(start.x, start.y)
    ){

        let previousKey =
            cameFrom.get(currentKey);

        if(!previousKey){
            break;
        }

        let parts =
            previousKey.split(",");

        let x = Number(parts[0]);
        let y = Number(parts[1]);

        finalPath.push({
            x,
            y
        });

        currentKey = previousKey;
    }

    finalPath.reverse();

    pathIndex = 0;
}


function drawMap(){

    const canvas =
        document
        .getElementsByTagName("canvas")
        .item(0);

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;

    let tileH = h / MSIZE;
    let tileW = w / MSIZE;

    background(200);

    stroke(30);

    for(let i = 0; i < MSIZE; i++){

        for(let j = 0; j < MSIZE; j++){

            let here = main_map[i][j];

            if(here == 1){
                fill(25);
            }
            else if(here == -1){
                fill(255, 160, 190);
            }
            else if(here == 0){
                fill(215);
            }
            else if(here == -2){
                fill(220, 150, 255);
            }

            rect(
                i * tileW,
                j * tileH,
                tileW,
                tileH
            );
        }
    }

    noStroke();

    for(let i = 0; i < closedSet.length; i++){

        let node = closedSet[i];

        fill(140, 90, 210, 110);

        rect(
            node.x * tileW,
            node.y * tileH,
            tileW,
            tileH
        );
    }

    for(let i = 0; i < openSet.length; i++){

        let node = openSet[i];

        fill(70, 210, 210, 130);

        rect(
            node.x * tileW,
            node.y * tileH,
            tileW,
            tileH
        );
    }

    if(finalPath.length > 0){

        for(let i = 0; i < finalPath.length; i++){

            let node = finalPath[i];

            fill(100, 220, 130, 150);

            rect(
                node.x * tileW,
                node.y * tileH,
                tileW,
                tileH
            );
        }
    }

    if(currentNode && aiRunning){

        let x =
            currentNode.x * tileW +
            tileW / 2;

        let y =
            currentNode.y * tileH +
            tileH / 2;

        let wobble =
            Math.sin(frameCount * 0.15) * 2;

        fill(255, 210, 60);

        circle(
            x,
            y,
            Math.min(tileW, tileH) * 0.65 + wobble
        );

        fill(255, 120, 120);

        circle(
            x - tileW * 0.12,
            y - tileH * 0.08,
            Math.min(tileW, tileH) * 0.12
        );

        circle(
            x + tileW * 0.12,
            y - tileH * 0.08,
            Math.min(tileW, tileH) * 0.12
        );
    }

    if(
        aiFinished &&
        finalPath.length > 0 &&
        pathIndex < finalPath.length
    ){

        let agent = finalPath[pathIndex];

        let x =
            agent.x * tileW +
            tileW / 2;

        let y =
            agent.y * tileH +
            tileH / 2;

        let bounce =
            Math.sin(frameCount * 0.25) * 2;

        fill(255, 90, 110);

        circle(
            x,
            y + bounce,
            Math.min(tileW, tileH) * 0.62
        );
    }

    stroke(30);
}


function draw(){

    drawMap();

    if(aiRunning){

        let now = millis();

        let interval =
            1000 / AI_STEPS_PER_SECOND;

        if(now - lastAIStep >= interval){

            lastAIStep = now;

            aiStep();
        }
    }

    if(
        aiFinished &&
        finalPath.length > 0 &&
        pathIndex < finalPath.length - 1
    ){

        if(frameCount % 3 == 0){
            pathIndex++;
        }
    }
}

function resetAI(){
    aiRunning = false;
    aiFinished = false;

    openSet = [];
    closedSet = [];

    cameFrom = new Map();

    gScore = new Map();
    fScore = new Map();

    currentNode = null;

    finalPath = [];
    pathIndex = 0;

    lastAIStep = 0;

    main_map = generateMap();
}

function setup(){
    const container =
        document.getElementById("canvas-container");

    const canvas = createCanvas(
        container.clientWidth,
        container.clientHeight
    );

    canvas.parent(
        "canvas-container"
    );

    frameRate(TARGET_FPS);

    main_map = generateMap();

    const startButton = document.getElementById("start-button");

    if(startButton){

        startButton.addEventListener(
            "click",
            startAI
        );
    }

    const resetButton = document.getElementById("reset-button");

    if(resetButton){

        resetButton.addEventListener(
            "click",
            resetAI
        );
    }
}