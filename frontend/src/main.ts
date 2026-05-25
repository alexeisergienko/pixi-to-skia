import * as PIXI from "pixi.js-legacy";
import CanvasKitInit, { Surface } from "canvaskit-wasm";

import { createScene } from "./app/createScene";
import { PixiToSkiaRenderer } from "./renderer/PixiToSkiaRenderer";
import { exportToPdf } from "./pdf/exportPdf";
import { addRandomShape } from "./app/randomShapes";
import { serializeScene } from "./serialization/serializeScene";

async function bootstrap() {
  const app = new PIXI.Application({
    width: 600,
    height: 400,
    backgroundColor: 0xffffff,
    forceCanvas: true
  });

  const pixiRoot = document.getElementById("pixi-root");

  if (!pixiRoot) {
    throw new Error("Pixi root not found");
  }

  pixiRoot.appendChild(app.view as HTMLCanvasElement);

  const mainContainer = createScene();

  app.stage.addChild(mainContainer);

  const CanvasKit = await CanvasKitInit({ locateFile: (file) => `/node_modules/canvaskit-wasm/bin/${file}`});

  const skiaCanvas = document.getElementById("skia-canvas") as HTMLCanvasElement;

  const surface = CanvasKit.MakeSWCanvasSurface(skiaCanvas);

  if (!surface) {
    throw new Error("Unable to create Skia surface");
  }

  const renderer = new PixiToSkiaRenderer(CanvasKit);

  function redraw(surface: Surface) {
    const canvas = surface.getCanvas();

    canvas.clear(CanvasKit.Color4f(1, 1, 1, 1));

    mainContainer.updateTransform();

    renderer.render(mainContainer, canvas);

    surface.flush();
  }

  redraw(surface);

  document.getElementById("randomShapeBtn")?.addEventListener("click", () => {
    addRandomShape(mainContainer);

    redraw(surface);
  });

  document.getElementById("exportPdfBtn")?.addEventListener("click", () => exportToPdf(serializeScene(mainContainer)));

  const events = ['pointerdown', 'pointerup'] as const;
  for (const eventType of events) {
    skiaCanvas.addEventListener(eventType, (event) => {
      const point = {
        x: event.offsetX,
        y: event.offsetY
      };

      for (const child of mainContainer.children) {
        if (child.getBounds().contains(point.x, point.y)) {
          child.emit(eventType, event);
        }
      }
    });
  }
}

document.addEventListener('unhandledrejection', (event) => {
  console.log(`i'm unhandled`, event);
});

bootstrap();