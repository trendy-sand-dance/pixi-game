import { Application } from "pixi.js";
import GameMap from './gamemap.js';
import * as settings from './settings.js';
import { Vector2 } from './interfaces.js';


function moveMapWithMouse(mousePos: Vector2, map: GameMap) {
  if (!isGameFocused)
    return;

  let buffer = 75;
  let dir = { x: 0, y: 0 };

  if (mousePos.x >= (settings.WIDTH - buffer)) {
    let intensity = (mousePos.x - (settings.WIDTH - buffer)) / buffer;
    dir.x -= intensity;
  }
  if (mousePos.x <= buffer) {
    let intensity = (100 - mousePos.x) / buffer;
    dir.x += intensity;
  }
  if (mousePos.y <= buffer) {
    let intensity = (100 - mousePos.y) / buffer;
    dir.y += intensity;
  }
  if (mousePos.y >= (settings.HEIGHT - buffer * 2.5)) {
    let intensity = (mousePos.y - (settings.HEIGHT - buffer * 2.5)) / buffer * 2.5;
    dir.y -= intensity;
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

function setupZoom(mousePos: Vector2, map: GameMap) {
  window.addEventListener('wheel', (event) => {
    let zoomIntensity = 0.05;
    let minZoom = 0.75;
    let maxZoom = 2;
    let scrollDir = event.deltaY / 100;

    enum Dir {
      Up = -1,
      Down = 1,
    }

    let container = map.getContainer();

    if (scrollDir == Dir.Up && container.scale.x < maxZoom) {
      const scaleFactor = 1 - (container.scale.x / (container.scale.x + zoomIntensity));
      container.scale.x += zoomIntensity;
      container.scale.y += zoomIntensity;

      container.x -= (mousePos.x - container.x) * scaleFactor;
      container.y -= (mousePos.y - container.y) * scaleFactor;
    }
    else if (scrollDir == Dir.Down && container.scale.x > minZoom) {
      const scaleFactor = 1 - (container.scale.x / (container.scale.x + zoomIntensity));
      container.scale.x -= zoomIntensity;
      container.scale.y -= zoomIntensity;

      container.x += (mousePos.x - container.x) * scaleFactor;
      container.y += (mousePos.y - container.y) * scaleFactor;
    }
  })

}

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


  setupZoom(mousePos, map);

  pixiApp.ticker.add((time) => {
    moveMapWithMouse(mousePos, map);
  });

  return pixiApp;
}

setup().then((pixiApp) => {

  console.log("Pixi app initialized:", pixiApp);

});

