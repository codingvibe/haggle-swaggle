import { Booth } from "./booth.js";
import { STOCK } from "./stock.js";

export class Villain {
  constructor(
    name,
    sprite,
    baseMoney,
    haggleAbility,
    persuasionAbility,
    transactionSpeed,
    stock,
    boothAttractiveness,
    screenWidth,
    screenHeight,
    villainTexture,
    boothTexture,
    displayCaseTexture,
    customerResolver
  ) {
    this.name = name;
    this.sprite = sprite;
    this.money = baseMoney;
    this.haggleAbility = haggleAbility;
    this.persuasionAbility = persuasionAbility;
    this.transactionSpeed = transactionSpeed;
    this.stock = stock;
    const boothStandingArea = {
      "maxY": screenHeight - 100,
      "minY": screenHeight * 3/4,
      "maxX": screenWidth * 2/3,
      "minX": screenWidth * 2/3+100
    }
    this.booth = new Booth(boothAttractiveness, boothStandingArea, boothTexture, displayCaseTexture, villainTexture, null, null, true);
    this.customerQueue = [];
    this.customerResolver = customerResolver;
    this.processingCustomer = false;
  }

  addMoney(additionalMoney) {
    this.money += additionalMoney;
  }

  buyStock(stockName) {
    for (let i = 0; i < this.stock.length; i++) {
      if (this.stock[i].name == stockName) {
        this.stock[i].inventory -= 1
      }
    }
  }

  addCustomerToQueue(customer) {
    this.customerQueue.push( {
      customer,
      timeout: customer.maxWaitTime + new Date().getTime()
    });
  }

  processCustomer(customer, timeout) {
    if (new Date().getTime() > timeout) {
      this.customerResolver({
        "result": "CUSTOMER_LEFT",
        customer
      })
      return;
    }
    let interestStock;
    for (let i = 0; i < customer.interests.length; i++) {
      const curStock = this.stock.filter(inv => inv.name == customer.interests[i].name)
      if (curStock && curStock.length > 0) {
        interestStock = curStock[0];
        break;
      }
    }
    if (!interestStock) {
      interestStock = this.stock[Math.floor(this.stock.length * Math.random())]
    }
    if (interestStock.inventory <= 0) {
      this.customerResolver({
        "result": "OUT_OF_STOCK",
        customer
      })
      return;
    }
    const requestedPrice = STOCK[interestStock.name].sellPrice
    const highestPrice = Math.max(requestedPrice * (1 - (0.5 - this.haggleAbility)), requestedPrice)
    const lowestPrice = Math.min(requestedPrice, requestedPrice - requestedPrice *  (1 - this.haggleAbility))
    const haggledPrice = customer.getHaggleOffer(highestPrice, lowestPrice)
    this.addMoney(haggledPrice)
    this.processingCustomer = true;
    setTimeout(() => {
      this.processingCustomer = false;
      this.customerResolver({
        "result": "SOLD",
        "price": haggledPrice,
        customer
      });
    }, this.transactionSpeed - 1000 + Math.random() * 1000)
  }
}

export function getVillainList(screenHeight, screenWidth, villainTextures, villainBoothTextures, displayCaseTexture, customerResolver) {
  const oldCouple = new Villain(
    "Herbert & Gerty",
    "sprites/old-couple.png",
    100,
    0.3,
    0.2,
    4000,
    [
      {
        "name": "Tools",
        "inventory": 50
      },
      {
        "name": "Home Goods",
        "inventory": 50
      }
    ],
    0.05,
    screenWidth,
    screenHeight,
    villainTextures['oldCouple'],
    villainBoothTextures['oldCoupleBooth'],
    displayCaseTexture,
    customerResolver
  )

  const hipster = new Villain(
    "Xane",
    "sprites/hipster.png",
    100,
    0.4,
    0.3,
    2500,
    [
      {
        "name": "Records",
        "inventory": 1000
      },
      {
        "name": "Tech",
        "inventory": 100
      },
      {
        "name": "Clothes",
        "inventory": 40
      }
    ],
    0.07,
    screenWidth,
    screenHeight,
    villainTextures['hipster'],
    villainBoothTextures['hipsterBooth'],
    displayCaseTexture,
    customerResolver
  )

  const satan = new Villain(
    "Beelza-Bob",
    "sprites/satan.png",
    100,
    0.5,
    0.5,
    1000,
    [
      {
        "name": "Records",
        "inventory": 1000
      },
      {
        "name": "Tech",
        "inventory": 1000
      },
      {
        "name": "Clothes",
        "inventory": 1000
      },
      {
        "name": "Home Goods",
        "inventory": 1000
      },
      {
        "name": "Weeb Stuff",
        "inventory": 100000
      },
      {
        "name": "Tools",
        "inventory": 1000
      }
    ],
    0.1,
    screenWidth,
    screenHeight,
    villainTextures['satan'],
    villainBoothTextures['satanBooth'],
    displayCaseTexture,
    customerResolver
  )

  return [
    oldCouple,
    hipster,
    satan
  ]
}