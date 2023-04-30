export function getMenuButton(buttonBackgroundTexture, iconTexture, buttonText, onClick) {
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(buttonBackgroundTexture);
  const icon = new PIXI.Sprite(iconTexture);
  icon.width = 64;
  icon.height = 64;
  buttonBackground.width = Math.floor(64 * 2 + 64*.1);
  buttonBackground.height = Math.floor(64 + 64*.1);
  const buttonDisplay = getButtonTextDisplay(buttonText);
  buttonBackground.width = icon.width*1.15 + buttonDisplay.width*1.15;
  buttonDisplay.x = Math.floor(icon.width*1.15);
  buttonDisplay.y = Math.floor((buttonBackground.height - buttonDisplay.height)/2);
  icon.y = Math.floor((buttonBackground.height - icon.height)/2)
  container.addChild(buttonBackground);
  container.addChild(icon);
  container.addChild(buttonDisplay);
  container.eventMode = "static";
  // container.interactive = true;
  container.onclick = onClick;
  container.ontouchstart = onClick;
  return container;
}

function getButtonTextDisplay(text) {
  return new PIXI.Text(text , {fontFamily : 'Verdana', fontSize: 28, fill : 0xffd80f, align : 'left', dropShadow: true, dropShadowDistance: 3});
}