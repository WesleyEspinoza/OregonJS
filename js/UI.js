/* eslint-disable func-names */


class UI {
  constructor(game) {
    this.game = game;

    this.firepower = 0;
    this.gold = 0;

    // add event listeners for fight dialog box
    // fight

    console.log('Init UI');
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));
    // run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));
  }

  notify(message, type) {
    document.getElementById('updates-area').innerHTML = `<div class="update-${type}">Day ${Math.ceil(this.game.caravan.day)}: ${message}</div>${document.getElementById('updates-area').innerHTML}`;
  }

  refreshStats() {
    // modify the dom
    document.getElementById('stat-day').innerHTML = Math.ceil(this.game.caravan.day);
    document.getElementById('stat-distance').innerHTML = Math.floor(this.game.caravan.distance);
    document.getElementById('stat-crew').innerHTML = this.game.caravan.crew;
    document.getElementById('stat-oxen').innerHTML = this.game.caravan.oxen;
    document.getElementById('stat-food').innerHTML = Math.ceil(this.caravan.food);
    document.getElementById('stat-money').innerHTML = this.game.caravan.money;
    document.getElementById('stat-firepower').innerHTML = this.game.caravan.firepower;
    document.getElementById('stat-weight').innerHTML = `${Math.ceil(this.game.caravan.weight)}/${this.game.caravan.capacity}`;

    // update caravan position
    document.getElementById('caravan').style.left = `${380 * this.game.caravan.distance / this.game.FINAL_DISTANCE}px`;
  }

  showAttack(firepower, gold) {
    const attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');

    this.firepower = firepower;
    this.gold = gold;

    // keep properties
    this.game.caravan.firepower = firepower;
    this.game.caravan.gold = gold;

    console.log('show attack');
    console.log(firepower, gold);

    // show firepower
    document.getElementById('attack-description').innerHTML = `Firepower: ${firepower}`;
  }


  fight() {
    const { firepower, money, crew } = this.game.caravan;
    const { gold, firepower: enemyFirepower } = this; // { firepower }

    const damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - enemyFirepower));

    console.log('fight!');
    console.log(enemyFirepower, money, crew, damage);

    // check there are survivors
    if (damage < crew) {
      this.game.caravan.crew -= damage;
      this.game.caravan.money += gold;
      this.notify(`${damage} people were killed fighting`, 'negative');
      this.notify(`Found $${gold}`, 'gold');
    } else {
      this.game.caravan.crew = 0;
      this.notify('Everybody died in the fight', 'negative');
    }

    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  }

  runaway() {
    const { firepower } = this;

    const damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));

    // check there are survivors
    if (damage < this.game.caravan.crew) {
      this.game.caravan.crew -= damage;
      this.notify(`${damage} people were killed running`, 'negative');
    } else {
      this.game.caravan.crew = 0;
      this.notify('Everybody died running away', 'negative');
    }


    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  }

  showShop(products) {
    // get shop area
    const shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    // init the shop just once
    if (!this.shopInitiated) {
    // event delegation
      shopDiv.addEventListener('click', (e) => {
      // what was clicked
        const target = e.target || e.src;

        // exit button
        if (target.tagName === 'BUTTON') {
        // resume journey
          shopDiv.classList.add('hidden');
          this.game.resumeJourney();
        } else if (target.tagName === 'DIV' && target.className.match(/product/)) {
          this.buyProduct({
            item: target.getAttribute('data-item'),
            qty: target.getAttribute('data-qty'),
            price: target.getAttribute('data-price'),
          });
        }
      });

      this.shopInitiated = true;
    }

    // clear existing content
    const prodsDiv = document.getElementById('prods');
    prodsDiv.innerHTML = '';

    // show products
    let product;
    for (let i = 0; i < products.length; i += 1) {
      product = products[i];
      prodsDiv.innerHTML += `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}">${product.qty} ${product.item} - $${product.price}</div>`;
    }
  }

  // eslint-disable-next-line consistent-return
  buyProduct(product) {
  // check we can afford it
    if (product.price > this.game.caravan.money) {
      this.notify('Not enough money', 'negative');
      return false;
    }

    this.game.caravan.money -= product.price;

    this.game.caravan[product.item] += +product.qty;

    this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');

    // update weight
    this.game.caravan.updateWeight();

    // update visuals
    this.refreshStats();
  }
}

// show a notification in the message area
// OregonH.UI.notify = function (message, type) {

// };

// // refresh visual caravan stats
// OregonH.UI.refreshStats = function () {

// };

// show attack
// OregonH.UI.showAttack = function (firepower, gold) {

// };

// fight
// OregonH.UI.fight = function () {

// };

// runing away from enemy
// OregonH.UI.runaway = function () {

// };

// show shop
// OregonH.UI.showShop = function (products) {

// };

// buy product
// OregonH.UI.buyProduct = function (product) {

// };
