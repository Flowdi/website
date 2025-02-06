const startBtn = document.getElementById("start-btn");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;
// Variablen für den Score
let fliesCollected = 0; // Anzahl eingesammelter Fliegen
const totalFlies = 20;    // Gesamtzahl der Fliegen im Spiel

const proportionalSize = (size) => {
  return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}
  // Player Frame
  class Player {
    constructor() {
      this.position = {
        x: proportionalSize(100),
        y: proportionalSize(400),
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
      this.width = proportionalSize(40); // Größe bleibt gleich
      this.height = proportionalSize(40); // Größe bleibt gleich
    }
    
    // Funktion zum Zeichnen des Kothaufens
    drawPoopLayer(x, y, radiusX, radiusY, color) {
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();
    }
  
    // Spieler-Rendering
    draw() {
      const x = this.position.x + this.width / 2;
      const y = this.position.y + this.height / 2;
  
      // Kothaufen in mehreren Schichten
      this.drawPoopLayer(x, y + 20, 20, 10, "#8B4513"); // Unterste Schicht (größte)
      this.drawPoopLayer(x, y + 10, 15, 8, "#8B4513"); // Mittlere Schicht
      this.drawPoopLayer(x, y, 10, 6, "#8B4513");       // Obere Schicht
      this.drawPoopLayer(x, y - 5, 5, 3, "#8B4513");   // Kleinste Spitze
    }
  
    update() {
      this.draw(); // Zeichnet den Kothaufen
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  
      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        if (this.position.y < 0) {
          this.position.y = 0;
          this.velocity.y = gravity;
        }
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }
  
      if (this.position.x < this.width) {
        this.position.x = this.width;
      }
  
      if (this.position.x >= canvas.width - this.width * 2) {
        this.position.x = canvas.width - this.width * 2;
      }
      
    }
  }
  
// Plattformen
class Platform {
  constructor(x, y) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = proportionalSize(40);
  }
  draw() {
    ctx.fillStyle = "#e53e3e";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
// Horizontale Plattform neu
class Blockade {
  constructor(x, y) {
    this.position = {
      x,
      y,
    };
    this.width = proportionalSize(40);
    this.height = 200;
  }
  
  draw() {
    ctx.fillStyle = "#e53e3e"; // Hier die Farbe als String setzen
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Tippfehler behoben: thi.position.y -> this.position.y
  }
}

//Checkpointdesign
class CheckPoint {
  constructor(x, y, z) {
    this.position = {
      x,
      y,
    };
    this.width = proportionalSize(40);
    this.height = proportionalSize(70);
    this.claimed = false;
  }

  // Funktion zum Zeichnen der Toilette
  drawToiletTopView() {
    const { x, y } = this.position;
    const toiletWidth = this.width;
    const toiletHeight = this.height;

    // Toilettensitz (große Ellipse oben)
    ctx.beginPath();
    ctx.ellipse(x + toiletWidth / 2, y + toiletHeight / 2, toiletWidth / 2, toiletHeight / 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF"; // Farbe für die Toilette
    ctx.fill();
    ctx.strokeStyle = "#000000"; // Rand
    ctx.stroke();

    // Innerer Rand der Toilette (kleinere Ellipse)
    ctx.beginPath();
    ctx.ellipse(x + toiletWidth / 2, y + toiletHeight / 2, toiletWidth / 3, toiletHeight / 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Abfluss
    ctx.beginPath();
    ctx.arc(x + toiletWidth / 2, y + toiletHeight / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#000000"; // Farbe für den Abfluss
    ctx.fill();

    // Toilettentank 
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y - toiletHeight * 0.2, toiletWidth, toiletHeight * 0.2);
    ctx.strokeRect(x, y - toiletHeight * 0.2, toiletWidth, toiletHeight * 0.2);

    // Toilettenspülknopf
    ctx.beginPath();
    ctx.arc(x + toiletWidth / 2, y - toiletHeight * 0.1, 4, 0, Math.PI * 2); // Spülknopf
    ctx.fillStyle = "grey"; // Farbe für den Knopf
    ctx.fill();
  }

  draw() { 
    if (!this.claimed) {
      this.drawToiletTopView(); // Toilette von Oben
    }
  }

  claim() {
    this.width = 0;
    this.height = 0;
    this.position.y = Infinity;
    this.claimed = true;
  }
}

//Fliege erstellt
class Fly {
  constructor(x, y) {
    this.position = {
      x,
      y,
    };
    this.bodySize = proportionalSize(10);  // Größe des Körpers
    this.wingSize = proportionalSize(6); // Größe der Flügel
    this.collected = false; // Status, ob die Fliege eingesammelt wurde
  }

  draw() {
    if (!this.collected) {
      // Körper der Fliege
      ctx.fillStyle = "black"; // Körperfarbe
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.bodySize, 0, Math.PI * 2); // Körper zeichnen
      ctx.fill();

      // Flügel zeichnen
      ctx.fillStyle = "grey"; // Flügelfarbe
      ctx.beginPath();
      ctx.arc(this.position.x - this.bodySize, this.position.y - this.wingSize / 2, this.wingSize, 0, Math.PI * 2); // Linker Flügel
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.position.x + this.bodySize, this.position.y - this.wingSize / 2, this.wingSize, 0, Math.PI * 2); // Rechter Flügel
      ctx.fill();
      ctx.closePath();
    }
  }
// Kollisionsprüfung für die Fliege
  checkCollision(player) {
    const distX = player.position.x + player.width / 2 - this.position.x;
    const distY = player.position.y + player.height / 2 - this.position.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < player.width / 2 + this.bodySize) {  // Kollisionsprüfung korrigiert
        this.collected = true;  // Fliege verschwindet nach Einsammeln
  }
}
}

const player = new Player();

// Positionen der einzelnen Plattformen
const platformPositions = [
  { x: 500, y: proportionalSize(450) },
  { x: 700, y: proportionalSize(400) },
  { x: 850, y: proportionalSize(350) },
  { x: 900, y: proportionalSize(350) },
  { x: 1050, y: proportionalSize(150) },
  { x: 2500, y: proportionalSize(450) },
  { x: 2900, y: proportionalSize(400) },
  { x: 3150, y: proportionalSize(350) },
  { x: 3900, y: proportionalSize(450) },
  { x: 4200, y: proportionalSize(400) },
  { x: 4400, y: proportionalSize(200) },
  { x: 4550, y: proportionalSize(200) },
  { x: 4700, y: proportionalSize(150) },
];

const platforms = platformPositions.map(
  (platform) => new Platform(platform.x, platform.y)
);

//Positionen der horizontalen Plattformen
const blockadePositions = [
  { x: 1210, y: proportionalSize(-10) },
  { x: 2860, y: proportionalSize(240) },
  { x: 2860, y: proportionalSize(0) },
  { x: 4860, y: proportionalSize(-10) },
];

const blockade = blockadePositions.map(
  (block) => new Blockade(block.x, block.y)
);


// Position der Fliegen
const flyPositions = [
  { x: 550, y: proportionalSize(350) },
  { x: 700, y: proportionalSize(250) },
  { x: 1100, y: proportionalSize(450) },
  { x: 1450, y: proportionalSize(350) },
  { x: 1800, y: proportionalSize(250) },
  { x: 2000, y: proportionalSize(450) },
  { x: 2300, y: proportionalSize(350) },
  { x: 2500, y: proportionalSize(150) },
  { x: 2875, y: proportionalSize(220) },
  { x: 3000, y: proportionalSize(450) }, //10
  { x: 3250, y: proportionalSize(250) }, 
  { x: 3400, y: proportionalSize(450) },
  { x: 3600, y: proportionalSize(250) },
  { x: 3780, y: proportionalSize(750) },
  { x: 3900, y: proportionalSize(550) },
  { x: 4050, y: proportionalSize(600) },
  { x: 4300, y: proportionalSize(250) },
  { x: 4500, y: proportionalSize(100) },
  { x: 4700, y: proportionalSize(20) },
  { x: 4800, y: proportionalSize(500) }, //20
];

// Erstelle die Fliegen
const flies = flyPositions.map(
  (fly) => new Fly(fly.x, fly.y)
);

// Positionen der einzelnen Checkpoints
const checkpointPositions = [
  { x: 1170, y: proportionalSize(80), z: 1 },
  { x: 2900, y: proportionalSize(330), z: 2 },
  { x: 4800, y: proportionalSize(80), z: 3 },
];

const checkpoints = checkpointPositions.map(
  (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);

// ANIMATE 
const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
// Zeichne Plattformen, horizontale Plattformen und Checkpoints
  platforms.forEach((platform) => {
    platform.draw();
  });

  blockade.forEach((block) => {
    block.draw();
  });

  checkpoints.forEach(checkpoint => {
    checkpoint.draw();
  });

  // Update den Spieler
  player.update();

  // Zeichne und prüfe Kollision mit allen Fliegen
  flies.forEach((fly, index) => {
    if (!fly.collected) {
        fly.draw();
        fly.checkCollision(player);  // Kollisionsprüfung

        if (fly.collected) {
        fliesCollected +=1; // Erhöhe den Punktestand
        updateScoreBoard();
        console.log("Fliege eingesammelt! Aktueller Punktestand: " + fliesCollected);
        }
    }
});

function updateScoreBoard() {
  document.getElementById("flies-collected").textContent = fliesCollected;
}

 // Bewegungserkennung -> Mapmovement
if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
  player.velocity.x = 5;
} else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
  player.velocity.x = -5;
} else {
  player.velocity.x = 0;

  // Überprüfen, ob die Karte noch verschoben werden kann
  if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive && platforms[platforms.length - 1].position.x > canvas.width - proportionalSize(1250)) {
    // Nur bewegen, wenn die Karte noch Platz hat
    platforms.forEach((platform) => {
      platform.position.x -= 5;
    });

    blockade.forEach((block) => {
      block.position.x -= 5;
    });

    flies.forEach((fly) => {
      fly.position.x -= 5;
    });

    checkpoints.forEach((checkpoint) => {
      checkpoint.position.x -= 5;
    });

  } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive && platforms[0].position.x < proportionalSize(10)) {
    // Nur bewegen, wenn die Karte nach links noch Platz hat
    platforms.forEach((platform) => {
      platform.position.x += 5;
    });

    blockade.forEach((block) => {
      block.position.x += 5;
    });

    flies.forEach((fly) => {
      fly.position.x += 5;
    });

    checkpoints.forEach((checkpoint) => {
      checkpoint.position.x += 5;
    });
  }
}

 //Plattformkollisionsregeln
 platforms.forEach((platform) => {
  const collisionDetectionRules = [
    player.position.y + player.height <= platform.position.y,
    player.position.y + player.height + player.velocity.y >= platform.position.y,
    player.position.x >= platform.position.x - player.width / 2,
    player.position.x <=
      platform.position.x + platform.width - player.width / 3,
  ];

  if (collisionDetectionRules.every((rule) => rule)) {
    player.velocity.y = 0;
    return;
  }

  const platformDetectionRules = [
    player.position.x >= platform.position.x - player.width / 2,
    player.position.x <=
      platform.position.x + platform.width - player.width / 3,
    player.position.y + player.height >= platform.position.y,
    player.position.y <= platform.position.y + platform.height,
  ];

  if (platformDetectionRules.every(rule => rule)) {
    player.position.y = platform.position.y + player.height;
    player.velocity.y = gravity;
  };
});

// Kollisionsregeln für horizontale Plattform

blockade.forEach((block) => {
  // Kollision von oben
  const collisionFromAbove = [
    player.position.y + player.height <= block.position.y, 
    player.position.y + player.height + player.velocity.y >= block.position.y,
    player.position.x + player.width >= block.position.x, 
    player.position.x <= block.position.x + block.width 
  ];

  // Kollision von unten
  const collisionFromBelow = [
    player.position.y >= block.position.y + block.height, 
    player.position.y + player.velocity.y <= block.position.y + block.height, 
    player.position.x + player.width >= block.position.x, 
    player.position.x <= block.position.x + block.width 
  ];

  // Kollision von links
  const collisionFromLeft = [
    player.position.x + player.width <= block.position.x, 
    player.position.x + player.width + player.velocity.x >= block.position.x,
    player.position.y + player.height >= block.position.y, 
    player.position.y <= block.position.y + block.height 
  ];

  // Kollision von rechts
  const collisionFromRight = [
    player.position.x >= block.position.x + block.width, 
    player.position.x + player.velocity.x <= block.position.x + block.width, 
    player.position.y + player.height >= block.position.y,
    player.position.y <= block.position.y + block.height 
  ];

  // Kollisionsreaktionen
  if (collisionFromAbove.every((rule) => rule)) {
    player.velocity.y = 0;
    player.position.y = block.position.y - player.height;
  } else if (collisionFromBelow.every((rule) => rule)) {
    player.velocity.y = gravity; 
    player.position.y = block.position.y + block.height;
  } else if (collisionFromLeft.every((rule) => rule)) {
    player.velocity.x = 0; 
    player.position.x = block.position.x - player.width;
  } else if (collisionFromRight.every((rule) => rule)) {
    player.velocity.x = 0;
    player.position.x = block.position.x + block.width;
  }
});

//Checkpointkollisionsregeln
checkpoints.forEach((checkpoint, index, checkpoints) => {
  const checkpointDetectionRules = [
    player.position.x >= checkpoint.position.x,
    player.position.y >= checkpoint.position.y,
    player.position.y + player.height <=
      checkpoint.position.y + checkpoint.height,
    isCheckpointCollisionDetectionActive,
    player.position.x - player.width <=
      checkpoint.position.x - checkpoint.width + player.width * 0.9,
    index === 0 || checkpoints[index - 1].claimed === true,
  ];

  if (checkpointDetectionRules.every((rule) => rule)) {
    checkpoint.claim();

    if (index === checkpoints.length - 1) {
      isCheckpointCollisionDetectionActive = false;
      showCheckpointScreen("Du hast die letzte Toilette erreicht!");
      movePlayer("ArrowRight", 0, false);
    } else if (player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40) {
      showCheckpointScreen("Du hast eine Toilette erreicht!")
    }
  };
});
}

const keys = {
  rightKey: {
    pressed: false
  },
  leftKey: {
    pressed: false
  }
};

const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    return;
  }

  switch (key) {
    case "ArrowLeft":
      keys.leftKey.pressed = isPressed;
      if (xVelocity === 0) {
        player.velocity.x = xVelocity;
      }
      player.velocity.x -= xVelocity;
      break;
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y -= 8;
      break;
    case "ArrowRight":
      keys.rightKey.pressed = isPressed;
      if (xVelocity === 0) {
        player.velocity.x = xVelocity;
      }
      player.velocity.x += xVelocity;
  }
}

const startGame = () => {
  canvas.style.display = "block";
  startScreen.style.display = "none";
  animate();
}

const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block";
  checkpointMessage.textContent = msg;
  if (isCheckpointCollisionDetectionActive) {
    setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
  }
};

startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, 8, true);
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, 0, false);
});