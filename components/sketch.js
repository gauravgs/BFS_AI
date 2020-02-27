var drawingOption = 1;

const FRAMERATE = 60;

var allowDiagonals = false;

var canPassThroughCorners = false;
var cols = 50;
var rows = 50;
var selectedAlgorithm = "BFS";
var steps = 0;

// % of cells that are walls
var percentWalls = allowDiagonals ? (canPassThroughCorners ? 0.4 : 0.3) : 0.2;

// Timer
var t;
var timings = {};

function clearTimings() {
  timings = {};
}

function startTime() {
  t = millis();
}

function recordTime(n) {
  if (!timings[n]) {
    timings[n] = {
      sum: millis() - t,
      count: 1
    };
  } else {
    timings[n].sum = timings[n].sum + millis() - t;
    timings[n].count = timings[n].count + 1;
  }
}

// var i = 80;

function logTimings() {
  console.log(
    "%cSuccessfully Done!",
    "color: green; font-family:monospace; font-size: 20px"
  );
  for (var prop in timings) {
    if (timings.hasOwnProperty(prop)) {
      console.log(
        "%c" +
          prop +
          " = " +
          (timings[prop].sum / timings[prop].count).toString() +
          "ms",
        "color: blue;font-family:monospace;font-size:18px"
      );

      // i += 55;
    }
  }
  console.log(
    "%c GOAL REACHED !!",
    "font-weight: bold; font-size: 50px;color: green; text-shadow: 3px 3px 0 rgb(100,31,38) , 6px 6px 0 rgb(226,150,14) , 9px 9px 0 rgb(245,221,8) ,  15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(40,177,145) "
  );
}

function SettingBox(label, x, y, isSet, callback) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.isSet = isSet;
  this.callback = callback;

  this.show = function() {
    //noFill();
    strokeWeight(1);
    stroke(0);
    noFill();
    ellipse(this.x + 10, this.y + 10, 20, 20);
    if (this.isSet) {
      fill(0);
      ellipse(this.x + 10, this.y + 10, 3, 3);
    }
    fill(0);
    noStroke();
    text(label, this.x + 25, this.y + 15);
  };

  this.mouseClick = function(x, y) {
    if (x > this.x && x <= this.x + 20 && y > this.y && y <= this.y + 20) {
      this.isSet = !this.isSet;
      if (this.callback != null) this.callback(this);
    }
  };
}

function Button(label, x, y, w, h, callback) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.callback = callback;

  this.show = function() {
    stroke(0);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    noStroke();
    text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
  };

  this.mouseClick = function(x, y) {
    if (
      this.callback != null &&
      x > this.x &&
      x <= this.x + this.w &&
      y > this.y &&
      y <= this.y + this.h
    ) {
      this.callback(this);
    }
  };
}

// Start and end
// start = grid[0][0];
// end = grid[cols - 1][rows - 1];
// start.wall = false;
// end.wall = false;

function step(button) {
  pauseUnpause(true);
  stepsAllowed = 1;
}

function pauseUnpause(pause) {
  paused = pause;
  runPauseButton.label = paused ? "run" : "pause";
}

function runpause(button) {
  pauseUnpause(!paused);
}

function restart(button) {
  steps = 0;
  logTimings();
  clearTimings();
  initaliseSearchExample(cols, rows);
  pauseUnpause(true);
}

function toggleDiagonals() {
  allowDiagonals = !allowDiagonals;
}

function mouseClicked() {
  for (var i = 0; i < uiElements.length; i++) {
    uiElements[i].mouseClick(mouseX, mouseY);
  }
}

function doGUI() {
  for (var i = 0; i < uiElements.length; i++) {
    uiElements[i].show();
  }
}

var gamemap;
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;

function initaliseSearchExample(rows, cols) {
  console.log(
    "%c BFS with AI !",
    "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
  );
  mapGraphic = null;
  gamemap = new MapFactory().getMap(
    cols,
    rows,
    10,
    10,
    410,
    410,
    allowDiagonals,
    percentWalls
  );
  start = gamemap.grid[0][0];
  end = gamemap.grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  pathfinder = new BFS(gamemap, start, end, allowDiagonals);
  selectedAlgorithm = "~ BFS ~";
}

function greedy() {
  pathfinder = new Greedy(gamemap, start, end, allowDiagonals);
  steps = 0;
  selectedAlgorithm = "Greedy";
}

function bfs() {
  pathfinder = new BFS(gamemap, start, end, allowDiagonals);
  steps = 0;
  selectedAlgorithm = "BFS";
}

function uniform() {
  pathfinder = new Uniform(gamemap, start, end, allowDiagonals);
  steps = 0;
  selectedAlgorithm = "Uniform";
}

function setup() {
  startTime();

  if (
    getURL()
      .toLowerCase()
      .indexOf("fullscreen") === -1
  ) {
    createCanvas(600, 600);
  } else {
    var sz = min(windowWidth, windowHeight);
    createCanvas(sz, sz);
  }

  initaliseSearchExample(cols, rows);
  runPauseButton = new Button("run", 430, 25, 50, 30, runpause);
  // runAStarButton = new Button("A*", 430, 130, 50, 30, aStar);
  runBFSButton = new Button("BFS", 430, 160, 50, 30, bfs);
  // runDFSButton = new Button("DFS", 430, 190, 50, 30, dfs);

  // uiElements.push(runAStarButton);
  uiElements.push(runPauseButton);
  // uiElements.push(runDFSButton);
  uiElements.push(runBFSButton);

  uiElements.push(new Button("step-by-step", 480, 25, 80, 30, step));
  uiElements.push(new Button("new-map", 430, 55, 60, 30, restart));
  // uiElements.push(
  //   new SettingBox("AllowDiag", 430, 370, allowDiagonals, toggleDiagonals)
  // );

  recordTime("Setup");
}

function searchStep() {
  if (!paused || stepsAllowed > 0) {
    startTime();
    var result = pathfinder.step();
    recordTime("BFS Iteration");
    steps++;
    stepsAllowed--;

    switch (result) {
      case -1:
        status = "No Solution";
        logTimings();
        pauseUnpause(true);
        break;
      case 1:
        status = "Goal Reached!";
        logTimings();
        pauseUnpause(true);
        break;
      case 0:
        status = "Still Searching";
        break;
    }
  }
}

var mapGraphic = null;

function drawMap() {
  if (mapGraphic == null) {
    for (var i = 0; i < gamemap.cols; i++) {
      for (var j = 0; j < gamemap.rows; j++) {
        if (gamemap.grid[i][j].wall) {
          gamemap.grid[i][j].show(color(255));
        }
      }
    }
    mapGraphic = get(gamemap.x, gamemap.y, gamemap.w, gamemap.h);
  }

  image(mapGraphic, gamemap.x, gamemap.y);
}
// sleep time expects milliseconds
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function draw() {
  searchStep();
  background(255);

  // FRAME RATE ________________________________________________
  frameRate(FRAMERATE);

  //   setTimeout(doGUI(), 2000);
  doGUI();

  text("Selected Algorithm - " + selectedAlgorithm, 430, 120);
  // console.log()

  text("Search status - " + status, 10, 450);
  text("Number of Steps - " + steps, 10, 480);
  startTime();

  drawMap();

  for (var i = 0; i < pathfinder.closedSet.length; i++) {
    pathfinder.closedSet[i].show(color(255, 0, 0, 50));
  }

  var infoNode = null;

  for (var i = 0; i < pathfinder.openSet.length; i++) {
    var node = pathfinder.openSet[i];

    node.show(color(0, 255, 0, 150));
    if (
      mouseX > node.x &&
      mouseX < node.x + node.width &&
      mouseY > node.y &&
      mouseY < node.y + node.height
    ) {
      infoNode = node;
    }
  }
  recordTime("Draw Grid");

  fill(0);
  if (infoNode != null) {
    text("f = " + infoNode.f, 430, 230);
    text("g = " + infoNode.g, 430, 250);
    text("h = " + infoNode.h, 430, 270);
    text("vh = " + infoNode.vh, 430, 290);
  }

  var path = calcPath(pathfinder.lastCheckedNode);
  drawPath(path);
}

function calcPath(endNode) {
  startTime();
  path = [];
  var temp = endNode;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  recordTime("Calc Path");
  return path;
}

function drawPath(path) {
  // Usage!

  // Do something after the sleep!
  noFill();
  stroke(255, 0, 200);
  strokeWeight(gamemap.w / gamemap.cols / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
  }
  endShape();
}
