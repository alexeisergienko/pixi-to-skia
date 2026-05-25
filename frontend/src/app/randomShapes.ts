import * as PIXI from "pixi.js";

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function addRandomShape(container: PIXI.Container) {
  const graphics = new PIXI.Graphics();

  const color = Math.floor(Math.random() * 0xffffff);

  graphics.beginFill(color);

  graphics.drawRect(
    0,
    0,
    random(30, 120),
    random(30, 120)
  );

  graphics.endFill();

  graphics.position.set(
    random(0, 500),
    random(0, 300)
  );

  graphics.angle = random(0, 360);

  graphics.on("pointerdown", () => {
    console.log("Random shape pointerdown");
  });

  container.addChild(graphics);
}
