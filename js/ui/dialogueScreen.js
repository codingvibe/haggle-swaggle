export default class DialogueScreen {
  constructor(screenHeight, screenWidth, backgroundTexture, continueButtonTexture, textToDisplay, onContinue) {
    this.container = new PIXI.Container();
    this.background = new PIXI.Sprite(backgroundTexture);
    this.background.height = screenHeight;
    this.background.width = screenWidth;
    this.container.addChild(this.background);
    this.continueButton = getUIButton("NEXT", continueButtonTexture);
    this.continueButton.x = Math.floor(this.background.width * .75);
    this.continueButton.y = Math.floor(this.background.height * .8);
    this.continueButton.onclick = onContinue;
    this.dialogueText = getDialogueText(textToDisplay, screenWidth*0.95);
    this.dialogueText.x = screenWidth*0.03
    this.dialogueText.y = screenHeight*0.03
    this.container.addChild(this.continueButton);
    this.container.addChild(this.dialogueText);
    this.container.eventMode = "passive";
    this.container.zIndex = 1000;
    this.currentCustomerPrice = 0;
  }

  updateDialogueBox(text, onContinue, continueButtonText) {
    this.dialogueText.text = text;
    if (onContinue) {
      this.continueButton.onclick = onContinue;
    }
    if (continueButtonText) {
      this.continueButton.children
        .forEach(child => {
          if (child.text) {
            child.text = continueButtonText
          }
        })
    }
  }
}

function getDialogueText(text, wordWrapLength) {
  return new PIXI.Text(text , {fontFamily : 'Verdana', fontSize: 48, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: wordWrapLength - 2});
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

export const DIALOGUES = [
  "Your parents have decided it's time you move your childhood things out of their house.\n\nIn order to make some extra cash, you decide to sell them plus some other of our parents possessions at the flea market.\n\nApparently, it's pretty competitive? So if you can't outsell the kind, old couple Herbert and Gerty, you can't come back.\n\nTime to crush the elderly.",
  "The elderly are thoroughly crushed!\n\nYou've been invited back next week, but you'll be going up against Xane, a hip young lad who smells of foreign wood and desperation.\n\nBetter spruce up your booth if you want to stand a chance!",
  "Xane's aesthetics are no match for your sales tactics and guile. But ho, who is this on the horizon?\n\nThey say he's the sellin-est seller of all sellers.\n\nThe crown prince of the Haggle.\n\nThe demon lord of the Swaggle.\n\nRosin up your booth and sell your stock hard!",
  "Congratulations! You are now officially\n\nTHE SOVERIGN OF THE SALE\nOVERLORD OF OVERSTOCK\nCHIEF OF CHEAP\n\nThanks for playing!\n\nMade by: twitch/codingvibe && twitch/feburg06"
]