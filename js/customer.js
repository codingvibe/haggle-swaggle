/*
- Customer
  - money
  - interests
  - effectiveness of influence
  - haggle ability
  - haggle tolerance
  - wait tolerance
    - setTimeout(()=>{}, waitTolerance)
*/

export class Customer {
  constructor(sprite,
              indicator,
              interestPercentages,
              numOfInterests,
              maxMoney,
              maxWait,
              onScreenLength,
              additionalMoney = 0,
              additionalInfluenceability = 0,
              additionalHaggle = 0,
              additionalHaggleTolerance = 0,
              additionalWaitTolerance = 0) {
    this.sprite = sprite;
    this.sprite.eventMode = "static";
    this.indicator = indicator;
    this.interests = interestPercentages
      .sort((a,b) => a.interestPercentage - b.interestPercentage)
      .slice(0, numOfInterests-1);

    this.money = Math.floor(Math.random() * maxMoney + additionalMoney);
    this.influencability = Math.random() + additionalInfluenceability;
    this.haggleability = Math.random() + additionalHaggle;
    this.haggleTolerance = Math.random() + additionalHaggleTolerance;
    this.maxWaitTime = Math.max(Math.floor(maxWait * Math.random() + additionalWaitTolerance), 1000);
    const moveUp = Math.random() > 0.5;
    this.moveDirection = moveUp ? "UP" : "DOWN";
    this.moveSpeed = onScreenLength / (100 + Math.random()*500);
    this.id = Math.floor(Math.random() * 10000000);
  }

  isInfluenced(numberToBeat) {
    return (1 - this.influencability) < numberToBeat;
  }

  getHaggleOffer(inMoney, minPrice) {
    return (inMoney - minPrice) * ( 1 - this.haggleability) + minPrice;
  }

  hasWaitedLongEnough(inTime) {
    return inTime > this.maxWaitTime;
  }

  isFrustratedByHaggling() {
    this.haggleTolerance -= Math.random();
    return this.haggleTolerance <= 0;
  }

  getPersuadability(stockName) {
    const interestPercentage = this.interests
      .filter(custInterest => stockName == custInterest.name)
      .map(interest => interest.interestPercentage)[0] || 0;
    return (this.influencability) * 0.5 + (interestPercentage) * 0.5;
  }
}