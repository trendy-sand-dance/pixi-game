import { Application } from "pixi.js";
import GameMap from './gamemap.js';
import * as settings from './settings.js';
import { Vector2 } from './interfaces.js';


function moveMapWithMouse(mousePos: Vector2, map: GameMap) {
  if (!isGameFocused)
    return;
  let buffer = 75;
  let dir = { x: 0, y: 0 };
  console.log(mousePos.x, mousePos.y);

  if (mousePos.x >= (settings.WIDTH - buffer)) {
    dir.x += -1;
  }
  if (mousePos.x <= buffer) {
    dir.x += 1;
  }
  if (mousePos.y <= buffer) {
    dir.y += 1;
  }
  if (mousePos.y >= (settings.HEIGHT - buffer * 2.5)) {
    dir.y -= 1;
  }
  map.moveMap(dir);
}

let isGameFocused = false;

window.addEventListener('blur', () => {
  isGameFocused = false;
})

window.addEventListener('focus', () => {
  isGameFocused = true;
})


async function setup() {
  let mousePos = { x: 0, y: 0 };
  const pixiApp = new Application();
  await pixiApp.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(pixiApp.canvas);
  const map = new GameMap(settings.GRIDSIZE, settings.GRIDSIZE, settings.TILESIZE);
  map.createGridFromMap(settings.TILEMAP);
  pixiApp.stage.addChild(map.getContainer());

  pixiApp.stage.eventMode = 'static';
  pixiApp.stage.hitArea = pixiApp.screen;
  pixiApp.stage.on('pointermove', (event) => {
    mousePos.x = event.global.x;
    mousePos.y = event.global.y;
  });


  window.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.05;
    let container = map.getContainer();

    if (event.deltaY < 0) {
      container.scale.x += zoomSpeed;
      container.scale.y += zoomSpeed;

      const scaleFactor = container.scale.x / (container.scale.x + zoomSpeed);
      container.x -= (mousePos.x - container.x) * (1 - scaleFactor);
      container.y -= (mousePos.y - container.y) * (1 - scaleFactor);
    }
    else {
      container.scale.x -= zoomSpeed;
      container.scale.y -= zoomSpeed;

      const scaleFactor = container.scale.x / (container.scale.x + zoomSpeed);
      container.x += (mousePos.x - container.x) * (1 - scaleFactor);
      container.y += (mousePos.y - container.y) * (1 - scaleFactor);

    }


  })

  pixiApp.ticker.add((time) => {
    moveMapWithMouse(mousePos, map);
  });

  return pixiApp;
}

setup().then((pixiApp) => {

  console.log("Pixi app initialized:", pixiApp);

});

