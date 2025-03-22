import { Application } from "pixi.js";
import GameMap from './gamemap.js';
import * as settings from './settings.js';

async function setup() {
  const pixiApp = new Application();
  await pixiApp.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(pixiApp.canvas);
  const map = new GameMap(settings.GRIDSIZE, settings.GRIDSIZE, settings.TILESIZE);
  map.createGridFromMap(settings.TILEMAP);
  pixiApp.stage.addChild(map.getContainer());

  pixiApp.ticker.add((time) => {
    // console.log(time);
  });

  return pixiApp;
}

setup().then((pixiApp) => {

  console.log("Pixi app initialized:", pixiApp);

});

