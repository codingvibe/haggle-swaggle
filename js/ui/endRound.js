export default class EndRound {
  constructor(screenHeight, screenWidth, backgroundTexture, continueButtonTexture, onContinue, retryButtonTexture, onRetry, playerStats, villainStats) {
    this.container = new PIXI.Container();
    this.background = new PIXI.Sprite(backgroundTexture);
    this.background.height = screenHeight;
    this.background.width = screenWidth;
    this.container.addChild(this.background);
    this.continueButton = getUIButton("NEXT", continueButtonTexture);
    this.continueButton.x = Math.floor(this.background.width * .3);
    this.continueButton.y = Math.floor(this.background.height * .8);
    this.continueButton.onclick = onContinue;
    this.retryButton = getUIButton("RETRY", retryButtonTexture);
    this.retryButton.x = Math.floor(this.background.width * .6);
    this.retryButton.y = Math.floor(this.background.height * .8);
    this.retryButton.onclick = onRetry;
    this.congratsMessage = new PIXI.Text("Congrats! A Winner You Are!" , {fontFamily : 'Verdana', fontSize: 48, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
    this.congratsMessage.x = Math.floor((this.background.width - this.congratsMessage.width)/2)
    this.congratsMessage.y = Math.floor(this.background.height * 0.2);
    this.playerStats = getStats(playerStats);
    this.playerStats.x = Math.floor(this.background.width * 0.05);
    this.playerStats.y = Math.floor(this.background.height * 0.5);
    this.villainStats = getStats(villainStats);
    this.villainStats.x = Math.floor(this.background.width - this.villainStats.width);
    this.villainStats.y = Math.floor(this.background.height * 0.5);
    this.container.addChild(this.retryButton);
    this.container.addChild(this.continueButton);
    this.container.addChild(this.congratsMessage);
    this.container.addChild(this.playerStats);
    this.container.addChild(this.villainStats);
    this.container.eventMode = "passive";
    this.container.zIndex = 1000;
    this.currentCustomerPrice = 0;
  }

  updateEndScreen(playerWon, playerStats, villainStats, onContinue, onRetry) {
    const tint = playerWon? 0xFFFFFF: 0x222222;
    if (playerWon) {
      this.congratsMessage.text = "Congrats! A Winner You Are!";
      this.continueButton.eventMode = "static";
    } else {
      this.congratsMessage.text = "Oh no, a Big Sorrow!"
      this.continueButton.eventMode = "none";
    }
    this.continueButton.children.forEach(child => child.tint = tint);
    this.villainStats.text = formatStats(villainStats);
    this.playerStats.text = formatStats(playerStats);
    if (onContinue) {
      this.continueButton.onclick = onContinue;
    }
    if (onRetry) {
      this.retryButton.onclick = onRetry;
    }
  }
}

function formatStats(stats) {
  const moneyDelta = stats.money - stats.startMoney;
  return `End Money: \$${stats.money.toFixed(2)}\nMoney Earned: \$${moneyDelta.toFixed(2)}\nCustomers Served: ${stats.customersServed}`
}

function getStats(stats) {
  return new PIXI.Text(formatStats(stats) , {fontFamily : 'Verdana', fontSize: 48, fill : 0x00ff00, align : 'center', dropShadow: true, dropShadowDistance: 3});
}

function getUIButton(text, uiButtonTexture) {
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  buttonBackground.width = uiButtonTexture.width* 2.2;
  buttonBackground.height = uiButtonTexture.height*2.2;
  const nameTexture = new PIXI.Text(text , {fontFamily : 'Verdana', fontSize: 32, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: buttonBackground.texture.width-2});
  container.addChild(buttonBackground);
  container.addChild(nameTexture);
  nameTexture.anchor.set(0.5);
  nameTexture.x = Math.floor(buttonBackground.texture.width*1.1);
  nameTexture.y = Math.floor(buttonBackground.texture.height*1.1);

  container.eventMode = "static";
  return container;
}