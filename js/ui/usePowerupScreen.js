export default class PowerupScreen {
  constructor(screenHeight, screenWidth, backgroundTexture, powerupButtons, onClose) {
    this.container = new PIXI.Container();
    this.background = new PIXI.Sprite(backgroundTexture);
    this.background.height = screenHeight;
    this.background.width = screenWidth;
    this.container.addChild(this.background);
    this.powerupButtons = powerupButtons || [];
    this.closeWindowButton = new PIXI.Text("X", {fontFamily : 'Verdana', fontSize: 28, fill : 0xFF0000, align : 'left', dropShadow: true, dropShadowDistance: 3});
    this.closeWindowButton.onclick = () => {
      this.container.visible = false;
      onClose();
    };
    this.closeWindowButton.x = screenWidth * 0.95;
    this.closeWindowButton.y = screenHeight * 0.05;
    this.closeWindowButton.eventMode = "static";
    this.container.addChild(this.closeWindowButton);
    displayPowerups(this.container, this.powerupButtons);
    this.container.eventMode = "passive";
    this.container.zIndex = 5000;
  }

  updatePowerupButtons(newPowerupButtons) {
    this.powerupButtons.forEach(powerupButton => this.container.removeChild(powerupButton));
    this.powerupButtons = newPowerupButtons;
    displayPowerups(this.container, this.powerupButtons, this.closeWindowButton.onclick)
  }
}

function displayPowerups(container, powerupButtons, onClose) {
  if (!powerupButtons || powerupButtons.length == 0 ){
    return;
  }
  let curY = container.height*0.05;
  powerupButtons.forEach(powerup => {
    powerup.y = curY;
    powerup.x = container.width*0.04;
    curY += powerup.height * 1.1;
    if (powerup.onclick) {
      const buttonFunction = powerup.onclick;
      powerup.onclick = () => {
        buttonFunction();
        onClose();
      }
    }
    container.addChild(powerup);
  });
}