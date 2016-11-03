// simulation goes here

console.log("poker simulation");

var deck = suits.reduce(function(protoDeck, suit) {
  var suitDeckPart = ranks.map(function(rank) {
    return {"suit": suit, "rank": rank};
  });
  protoDeck = protoDeck.concat(suitDeckPart);
  return protoDeck;
}, []);

if(!isDeck(deck)) {
  throw "do not have a properly formed deck";
}

var simulatePoker = function(runs, deck) {
  var counts = {};
  for(var i=0;i<runs;i=i+1) {
    var shuffledDeck = shuffle(deck);
    var hand = dealHand(shuffledDeck);

    if(!isHand(hand)) {
      throw "do not have a properly formed deck";
    }

    var handType = highestRank(hand);
    if(!counts[handType]) {
      counts[handType] = 0;
    }
    counts[handType] = counts[handType] + 1;
  }
  return counts
}

console.log(simulatePoker(1000, deck));
