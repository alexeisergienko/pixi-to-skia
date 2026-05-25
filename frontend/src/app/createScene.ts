import * as PIXI from "pixi.js";

export function createScene(): PIXI.Container {
  const mainContainer = new PIXI.Container();

  const g1 = new PIXI.Graphics();
  g1.beginFill(0xff0000);
  g1.drawEllipse(0, 0, 80, 50);
  g1.endFill();
  g1.position.set(200, 120);
  g1.angle = 30;

  g1.on("pointerdown", () => {
    console.log("Ellipse pointerdown");
  });

  const g2 = new PIXI.Graphics();
  g2.beginFill(0x0000ff);
  g2.drawRect(-50, -75, 100, 150);
  g2.endFill();

  g2.position.set(380, 200);
  g2.angle = 15;
  g2.scale.set(1.2, 1.2);

  g2.on("pointerup", () => {
    console.log("Rectangle pointerup");
  });

  const g3 = new PIXI.Graphics();
  g3.lineStyle(8, 0x00aa00, 1);
  g3.moveTo(0, 0);
  g3.lineTo(120, 60);
  g3.position.set(100, 280);

  mainContainer.addChild(g1, g2, g3);

  return mainContainer;
}
