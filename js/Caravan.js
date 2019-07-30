/* eslint-disable func-names */


class Caravan {
  constructor(game) {
    this.game = game;
    this.stats = {
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      oxen: 2,
      money: 300,
      firepower: 2,
    };

    this.init(this.stats);
  }

  init(stats) {
    this.day = stats.day;
    this.distance = stats.distance;
    this.crew = stats.crew;
    this.food = stats.food;
    this.oxen = stats.oxen;
    this.money = stats.money;
    this.firepower = stats.firepower;
  }

  updateWeight() {
    let droppedFood = 0;
    let droppedGuns = 0;

    // how much can the caravan carry
    this.capacity = this.oxen * this.game.WEIGHT_PER_OX + this.crew * this.game.WEIGHT_PER_PERSON;

    // how much weight do we currently have
    this.weight = this.food * this.game.FOOD_WEIGHT + this.firepower * this.game.FIREPOWER_WEIGHT;

    // drop things behind if it's too much weight
    // assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
      this.firepower -= 1;
      this.weight -= this.game.FIREPOWER_WEIGHT;
      droppedGuns += 1;
    }

    if (droppedGuns) {
      this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
    }

    while (this.food && this.capacity <= this.weight) {
      this.food -= 1;
      this.weight -= this.game.FOOD_WEIGHT;
      droppedFood += 1;
    }

    if (droppedFood) {
      this.ui.notify(`Left ${droppedFood} food provisions behind`, 'negative');
    }
  }

  updateDistance() {
    // the closer to capacity, the slower
    const diff = this.capacity - this.weight;
    const speed = this.game.SLOW_SPEED + diff / this.capacity * this.game.FULL_SPEED;
    this.distance += speed;
  }

  consumeFood() {
    this.food -= this.crew * this.game.FOOD_PER_PERSON;

    if (this.food < 0) {
      this.food = 0;
    }
  }
}


// this.game.Caravan.init = function (stats) {

// };

// update weight and capacity
// this.game.Caravan.updateWeight = function () {

// };

// update covered distance
// this.game.Caravan.updateDistance = function () {

// };

// food consumption
// this.game.Caravan.consumeFood = function () {

// };
