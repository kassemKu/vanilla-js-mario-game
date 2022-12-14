import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;
class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 30;
    this.height = 30;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Generic {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function image(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = image(platform);

let player = new Player();
let platforms = [];
let generics = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = image(platform);

  player = new Player();
  platforms = [
    new Platform({
      x: -1,
      y: 470,
      image: platformImage,
    }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 3 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
  ];
  generics = [
    new Generic({
      x: -1,
      y: -1,
      image: image(background),
    }),
    new Generic({
      x: -1,
      y: -1,
      image: image(hills),
    }),
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  generics.forEach((generic) => {
    generic.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;

      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      generics.forEach((generic) => {
        generic.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= player.speed;

      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      generics.forEach((generic) => {
        generic.position.x += player.speed * 0.66;
      });
    }
  }
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
  // Win condition
  if (scrollOffset > 2000) {
    console.log("you win!!!");
  }
  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.left.pressed = true;
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      break;
    case "ArrowDown":
      console.log("down");
      break;
    case " ":
      player.velocity.y -= 25;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
    case "ArrowDown":
      break;
    case " ":
      break;
  }
});
