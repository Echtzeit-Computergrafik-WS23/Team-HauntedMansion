

//import glance from '../Projekt/js/glance.js'
class Block {
  constructor(x, y, z, w, h, d) {
    this.position = createVector(x, y, z);
    this.dimensions = createVector(w, h, d);
    this.fillColor = color(random(150, 200));
    this.visited = false;
  }

  update(){
    // For Collision processing later
    // PPOs of Player 
    // if player is inside of WALL=1 
    // move to previous location

    // Track Player location
    let playerLeft = player.position.x - player.dimensions.x / 2;
    let playerRight = player.position.x + player.dimensions.x / 2;
    let playerTop = player.position.y - player.dimensions.y / 2;
    let playerBottom = player.position.y + player.dimensions.y / 2;
    let playerFront = player.position.z - player.dimensions.z / 2;
    let playerBack = player.position.z + player.dimensions.z / 2;

    // Track Boy location
    let boxLeft = this.position.x - this.dimensions.x / 2;
    let boxRight = this.position.x + this.dimensions.x / 2;
    let boxTop = this.position.y - this.dimensions.y / 2;
    let boxBottom = this.position.y + this.dimensions.y / 2;
    let boxFront = this.position.z - this.dimensions.z / 2;
    let boxBack = this.position.z + this.dimensions.z / 2;

    // How much are Player and Box overlaying.
    let boxLeftOverlap = playerRight - boxLeft;
    let boxRightOverlap = boxRight - playerLeft;
    let boxTopOverlap = playerBottom - boxTop;
    let boxBottomOverlap = boxBottom - playerTop;
    let boxFrontOverlap = playerBack - boxFront;
    let boxBackOverlap = boxBack - playerFront;

    // TODO: little bit unclean code ... Change later
    // Check if Player is colliding with a Box-object by comparing the overlapping.
    if (((playerLeft > boxLeft && playerLeft < boxRight || (playerRight > boxLeft && playerRight < boxRight)) && ((playerTop > boxTop && playerTop < boxBottom) || (playerBottom > boxTop && playerBottom < boxBottom)) && ((playerFront > boxFront && playerFront < boxBack) || (playerBack > boxFront && playerBack < boxBack)))) {
      let xOverlap = max(min(boxLeftOverlap, boxRightOverlap), 0);
      let yOverlap = max(min(boxTopOverlap, boxBottomOverlap), 0);
      let zOverlap = max(min(boxFrontOverlap, boxBackOverlap), 0);

      if (xOverlap < yOverlap && xOverlap < zOverlap) {
        if (boxLeftOverlap < boxRightOverlap) {
          player.position.x = boxLeft - player.dimensions.x / 2;
        } else {
          player.position.x = boxRight + player.dimensions.x / 2;
        }
      } else if (yOverlap < xOverlap && yOverlap < zOverlap) {
        if (boxTopOverlap < boxBottomOverlap) {
          player.position.y = boxTop - player.dimensions.y / 2;
          player.velocity.y = 0;
          player.grounded = true;
        } else {
          player.position.y = boxBottom + player.dimensions.y / 2;
        }
      } else if (zOverlap < xOverlap && zOverlap < yOverlap) {
        if (boxFrontOverlap < boxBackOverlap) {
          player.position.z = boxFront - player.dimensions.x / 2;
        } else {
          player.position.z = boxBack + player.dimensions.x / 2;
        }
      }
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.fillColor);
    box(this.dimensions.x, this.dimensions.y, this.dimensions.z);
    pop();
  }

  moveDown() {
    this.position.y += 5;
  }
}
class Mansion {

  constructor(mansion_x, mansion_y) {

    // Create Mansion-Object
    this.map = new MansionMap(mansion_x, mansion_y);
    // Creaze Start and Enpos
    let startpos = [randomNumbers(1, mansion_x), randomNumbers(1,mansion_y)]; // + 1 an -1 because 0 and max are always walls
    let endpos = [randomNumbers(1, mansion_x), randomNumbers(1,mansion_y)];
    // Check if Start and Endpos is not the same, if so create new endpoint
    console.log(this.map.height, " = ", this.map.width)
    console.log(startpos + " = " + endpos);
    let distant = 1;
    while (Math.abs(startpos[0] - endpos[0]) <= distant || Math.abs(startpos[1] - endpos[1]) <= distant) {
      console.log(startpos + " = " + endpos);
      endpos = [randomNumbers(1, mansion_x), randomNumbers(1,mansion_y)];
    }

    // Create Start and End point. 
    this.map.gateway(startpos[0], startpos[1]);
    this.map.gateway(endpos[0], endpos[1]) 
  
    // Generate Map
    this.mansionTiles = this.map.tiles() // 2D Map
    console.log(this.mansionTiles)
    // Generate 3D Map with 2D Map
    this.mansionBlocks = new Array(mansion_x); // 3D Map

    for (let i = 0; i < mansion_x; i++) {
      this.mansionBlocks[i] = new Array(mansion_y);
      for (let j = 0; j < mansion_y; j++) {
        let x = i * 5; 
        let y = 0;
        let z = j * 5; 
        this.mansionBlocks[i][j] = new Block(x, y, z, 5, 5, 5); 
      }
    }

    // Initialize Start and End -block
    console.log(this.mansionBlocks)
    this.startBlock = this.mansionBlocks[startpos[0]][startpos[1]]
    this.endBlock = this.mansionBlocks[endpos[0]][endpos[1]]
    console.log(this.startBlock.position)

    

    // Move every floor down
    for (let i = 1; i < mansion_x - 1; i++)
      for (let j = 1; j < mansion_y - 1; j++)
        if (this.mansionTiles[i][j]) {
          // IS Wall
        } else {
          // Is Floor
          this.mansionBlocks[i][j].moveDown(); // Floor move down
        } 
    
        // Set Start and End -block COlor
    this.startBlock.fillColor = color(63, 127, 63);
    this.endBlock.fillColor = color(127, 63, 63);
  }

  // Updates Collison with blocks
  update() {
    for (let i = 0; i < this.mansionBlocks.length; i++) {
      for (let j = 0; j < this.mansionBlocks[i].length; j++) {
        this.mansionBlocks[i][j].update();
      }
    }
  }

  // Updates display
  display() {
    for (let i = 0; i < this.mansionBlocks.length; i++) {
      for (let j = 0; j < this.mansionBlocks[i].length; j++) {
        this.mansionBlocks[i][j].display();
      }
    }
  }

  setPlayerAtStart(player) {
    player.position = p5.Vector.add(this.startBlock.position, createVector(0, -50, 0));
  }
}



class Player extends PlayerController {
  constructor() {
    super();
    this.dimensions = createVector(1, 3, 1);
    this.velocity = createVector(0, 0, 0);
    this.gravity = createVector(0, 0.03, 0);
    this.grounded = false;
    this.pointerLock = false;
    this.sensitivity = 0.02;
    this.speed = 0.04;
  }
  
  controller() { // override
    if (player.pointerLock) {
      this.yaw(movedX * this.sensitivity);   // mouse left/right
      this.pitch(movedY * this.sensitivity); // mouse up/down
      if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(0.01); // a
      if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-0.01);// d
    }
    else { // otherwise yaw/pitch with keys
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.yaw(-0.02); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.yaw(0.02); // d
      if (keyIsDown(82)) this.pitch(-0.02); // r
      if (keyIsDown(70)) this.pitch(0.02);  // f
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed);    // w
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
    if (keyIsDown(69)) this.moveZ(0.05); // e
  }
  
  update() {
    if (keyIsPressed && key == 'e') {
      this.grounded = false;
      return;
    }
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);

    if (this.grounded && keyIsPressed && keyCode == 32) { // space
      this.grounded = false;
      this.velocity.y = -1.5;
      this.position.y -= 0.2;
    }
  }
}

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (document.pointerLockElement === canvas.elt ||
    document.mozPointerLockElement === canvas.elt)
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener('pointerlockchange', onPointerlockChange, false);

var player, mansion,
  canvas;

function preload() {
  // TODO loadShader() here
  //TODO For the help-gui or maybe stat-gui // f = loadFont();
}

function setup() {
  
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  player = new Player();
  mansion = new Mansion(10, 10); 
  mansion.setPlayerAtStart(player);
  frameRate(60);
  strokeWeight(2);
}

function draw() {
  background(0, 0, 51);

  mansion.update();
  mansion.display();
  player.update();
}

function mouseClicked() {
  if (!player.pointerLock) {
    player.pointerLock = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    player.pointerLock = false;
  }
}


const randomNumbers = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min;
}


class MansionMap {
  constructor(columns, rows) {
      this.height = rows;
      this.width = columns;
      this.gates = [];
      this.direction = { left: 'left', right: 'right', up: 'up', down: 'down' };
  }
  

  /**
   * Generates the route between start and end points.
   *
   * @param {row[]} maze2d array 2d
   * @param {integer} startX
   * @param {integer} startY
   * @param {integer} endX
   * @param {integer} endY
   * @returns {Array} Array of pairs x,y of the correct route
   * @memberof MansionMap
   */
  getRoute(maze2d, startX, startY, endX, endY) {
      const goal = [xToTile(endX), xToTile(endY)];
      let route = [];
      let t = this;
      let visited = new Map();

      // First route point
      route.push([[xToTile(startX),xToTile(startY)], getActions(xToTile(startX),xToTile(startY))]);
        // Mark point as visited
      visited.set(startX+"-"+startY, true);

      function cell(x, y) {
          return maze2d[y][x];
      }

      function xToTile(x){
          return x * 2 + 1;
      }

      function last() {
          return route[route.length - 1][0];
      }

      function clean() {
          route.forEach((v,i,arr) => {
              v.pop();
              arr[i] = arr[i].pop();
          });
      }

      function getActions(x, y) {
          let actions = [];
          let left = (x - 1 >= 0) ? cell(x - 1, y) : null;
          if (left && !visited.has((x-1)+"-"+y)) {
              actions.push('left');
          }
          let up = (y - 1 >= 0) ? cell(x, y - 1) : null;
          if (up && !visited.has(x+"-"+(y-1))) {
              actions.push('up');
          }
          let down = (y + 1 < maze2d.length) ? cell(x, y + 1) : null;
          if (down && !visited.has(x+"-"+(y+1))) {
              actions.push('down');
          }
          let right = (x + 1 < maze2d[0].length) ? cell(x + 1, y) : null;
          if (right && !visited.has((x+1)+"-"+y)) {
              actions.push('right');
          }
          return actions;
      }

      function makeRoute() {
          do {
              if (last()[0] == goal[0] && last()[1] == goal[1]) {
                  clean();
                  return route;
              }
              if (route[route.length - 1][1].length > 0) {
                  let dir = route[route.length - 1][1].pop();
                  move(dir);
              } else {
                  route.pop();
              }
          } while (true);

      }

      function move(dir) {
          let pos = last();
          let x = pos[0];
          let y = pos[1];

          switch (dir) {
              case 'right':
                  x += 1;
                  break;
              case 'left':
                  x -= 1;
                  break;
              case 'up':
                  y -= 1;
                  break;
              case 'down':
                  y += 1;
                  break;
              default:
                  break;
          }
        
          // Mark visited
          visited.set(x+"-"+y, true);
          route.push([[x, y], getActions(x, y)]);
      }

      return makeRoute();
  }


  /**
   * Converts cells array format to a 2d array.
   * This array only has zeros and ones. 0: wall 1: path.
   * @param {row[]} cellsMap 
   * @returns {row[]} 
   * @memberof MansionMap
   */
  cellsToTiles(cellsMap) {
      let tileMap = new Array(this.height * 2 + 1);
      for (let i = 0; i < tileMap.length; i++) {
          tileMap[i] = new Array(this.width * 2 + 1).fill(0);
      }
      cellsMap.forEach((row, i) => {
          let y = (i + 1) * 2 - 1;
          row.forEach((cel, c) => {
              let x = (c + 1) * 2 - 1;
              // Center of 3x3 allways opened
              tileMap[y][x] = 1;
              // Up tile
              tileMap[y - 1][x] = cel[1];
              // Down tile
              tileMap[y + 1][x] = cel[2];
              // Left tile
              tileMap[y][x - 1] = cel[0];
              // Right tile
              tileMap[y][x + 1] = cel[3];
              // Corner of 3x3 are allways 0
          });
      });
      return tileMap
  }


  /**
   * Adds a new gateway to the gates array. The gateway should be positioned
   * in an edge of the maze.
   * @param {integer} x X position of the gateway.
   * @param {integer} y Y position of the gateway.
   * @memberof MansionMap
   */
  gateway(x, y) {
      this.gates.push([x, y]);
  }

  /**
   * Returns 2d array representing the maze.
   * Each element is a single value 0 or 1 (wall or path).
   * The tiles are grouped by rows, and the rows are contained in the maze array.
   * @returns {rows[]} Contains the mace cells
   * @memberof MansionMap
   */
  tiles() {
      return this.cellsToTiles(this.cells());
  }


  /**
   * Returns an array of cells representing the maze.
   * Each cell is an array containing the state of the four walls (0:closed, 1:opened). 
   * Example: [1,0,0,1] // [left opened, up closed, down closed, right opened]
   * The cells are grouped by rows, and the rows are contained in the maze array. 
   * @returns {rows[]} Contains the mace cells
   * @memberof MansionMap
   */
  cells() {

      let t = this;
      let maze = [];
      let cellsStack = [];
      let cursor = [];

      for (let i = 0; i < t.height; i++) {
          maze.push(initRow());
      }

      function initRow() {
          let row = [];
          for (let i = 0; i < t.width; i++) {
              row.push([0, 0, 0, 0, 1]); //[left open?, up open?, down open?, right open?, not visited?]
          }
          return row;
      }

      function cell(x, y) {
          return maze[y][x];
      }

      function getNonVisited(x, y) {
          let freeOnes = [];
          let left = (x - 1 >= 0) ? cell(x - 1, y)[4] : null;
          if (left) {
              freeOnes.push({ x: x - 1, y: y, to: 'left' });
          }
          let up = (y - 1 >= 0) ? cell(x, y - 1)[4] : null;
          if (up) {
              freeOnes.push({ x: x, y: y - 1, to: 'up' });
          }
          let down = (y + 1 < t.height) ? cell(x, y + 1)[4] : null;
          if (down) {
              freeOnes.push({ x: x, y: y + 1, to: 'down' });
          }
          let right = (x + 1 < t.width) ? cell(x + 1, y)[4] : null;
          if (right) {
              freeOnes.push({ x: x + 1, y: y, to: 'right' });
          }

          return freeOnes;
      }

      function move(direction) {
          let x = cursor[0];
          let y = cursor[1];
          let dir = direction;
          switch (dir) {
              case t.direction.right:
                  // Deletes current right wall
                  cell(x, y)[3] = 1;
                  // New current
                  cursor = [x + 1, y];
                  // Deletes left wall of new current
                  cell(x + 1, y)[0] = 1;
                  break;
              case t.direction.left:
                  cell(x, y)[0] = 1;
                  cursor = [x - 1, y];
                  cell(x - 1, y)[3] = 1;
                  break;
              case t.direction.up:
                  cell(x, y)[1] = 1;
                  cursor = [x, y - 1];
                  cell(x, y - 1)[2] = 1;
                  break;
              case t.direction.down:
                  cell(x, y)[2] = 1;
                  cursor = [x, y + 1];
                  cell(x, y + 1)[1] = 1;
                  break;
              default:
                  break;
          }
          // Mark it as visited
          cell(cursor[0], cursor[1])[4] = 0;
          // Adds this cell to stack
          cellsStack.push(cursor);
      }

      function generate() {
          cursor = [Math.floor(Math.random() * (t.width - 1) + 1), Math.floor(Math.random() * (t.height - 1) + 1)];
          // Marks first cell as visited
          cell(cursor[0], cursor[1])[4] = 0;
          // First cell added to the stack
          cellsStack.push(cursor);

          do {
              let nearCells = getNonVisited(cursor[0], cursor[1]);
              // Inits path
              while (nearCells.length > 0) {
                  let idx = Math.floor(Math.random() * nearCells.length);
                  let dir = nearCells[idx].to;
                  move(dir);
                  nearCells = getNonVisited(cursor[0], cursor[1]);
              }
              // Backtrace walked path searching for new paths
              cursor = cellsStack.pop();
              if (!cursor) break;
          } while (true);
      }

      function setGateway(x, y) {
          let start = cell(x, y);
          if (x == 0) {
              start[0] = 1;
          } else if (y == 0) {
              start[1] = 1;
          } else if (x == t.width - 1) {
              start[3] = 1;
          } else if (y == t.height - 1) {
              start[2] = 1;
          }
      }

      function trimCells() {
          maze.forEach((row) => {
              row.forEach((c) => { c.pop(); });
          });
      }

      generate();
      trimCells();
      t.gates.forEach((v, i) => { setGateway(v[0], v[1]); });

      return maze;
  }

  /**
   * Deletes all content of gates array. 
   * It is necessary if you want to change the doors.
   * Use it before add the new gateways and call map().
   * @memberof MansionMap
   */
  resetGates() {
      this.gates = [];
  }
}