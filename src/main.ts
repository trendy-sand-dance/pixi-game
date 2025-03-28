import { Application, Assets, Graphics, Container, Ticker } from "pixi.js";
import GameMap from './gamemap.js';
import * as settings from './settings.js';
import { Vector2, Point } from './interfaces.js';
import * as mouse from './mouse-interaction.js';
import Player from './player.js';
import * as input from './input.js';

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
  const texture = await Assets.load('/assets/bunny.png');
  const player = new Player(1, new Point(2, 2), texture);
  const mapContainer = map.getContainer();

  map.createGridFromMap(settings.TILEMAP);
  pixiApp.stage.addChild(mapContainer);
  mapContainer.addChild(player.getContext());

  pixiApp.stage.eventMode = 'static';
  pixiApp.stage.hitArea = pixiApp.screen;
  pixiApp.stage.on('pointermove', (event) => {
    mousePos.x = event.global.x;
    mousePos.y = event.global.y;
  });
  mouse.setupMapZoom(mousePos, map);

  pixiApp.ticker.add((time: Ticker) => {
    mouse.moveMapWithMouse(mousePos, map, isGameFocused);
    // player.updatePosition({ x: 15, y: 0 });
    input.movePlayer(player, map, time.deltaTime);
  });

  return pixiApp;
}

setup().then((pixiApp) => {

  console.log("Pixi app initialized:", pixiApp);

});

