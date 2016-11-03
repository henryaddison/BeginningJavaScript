var suits = ["clubs", "diamonds", "hearts", "spades"];
var ranks = ["two", "three", "four", "five", "six", "seven", "eight",
             "nine", "ten", "jack", "queen", "king", "ace"];

// return true if the input is a suit, false otherwise.
var isSuit = function (input) {
  if (!typeof(input) === "string") {
    return false;
  }

  return suits.some(function(suit) { return suit === input });
};

// return true if the input is a rank, false otherwise.
var isRank = function (input) {
  if (!typeof(input) === "string") {
    return false;
  }

  return ranks.some(function(rank) { return rank === input });
};

// return true if the input is a card object, false otherwise.
var isCard = function (input) {
  return typeof(input) === "object" &&
    Object.keys(input).length === 2 &&
    isSuit(input['suit']) &&
    isRank(input['rank']);
};

// return true if the input is a deck of cards (an array of 52 cards
// with no duplicates)
var isDeck = function (input) {
  return Array.isArray(input) &&
    input.length === 52 &&
    input.every(function(entry) { return isCard(entry) }) &&
    input.every(function(card) {
      var sameCards = input.reduce(function(sameCardCount, card2) {
        if(card['suit'] === card2['suit'] && card['rank'] === card2['rank']) {
          sameCardCount = sameCardCount + 1
        }
        return sameCardCount;
      }, 0);
      return sameCards === 1;
    });
};

// construct a deck of 52 cards that will pass the isDeck method
var createDeck = function () {
  deck = [];
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      card = {"suit": suit, "rank": rank}
      deck.push(card);
    });
  });
  return deck;
};

// fisher-yates shuffle
var shuffle = function (deck) {
  return deck;
};

// return true if the input is an array of 5 valid cards
var isHand = function (input) {
  return Array.isArray(input) &&
    input.length === 5 &&
    input.every(function(entry) { return isCard(entry) });
};

// This function should return the first five cards from a shuffled
// deck.
var dealHand = function (shuffledDeck) {
  if(!isDeck(shuffledDeck)) {
    throw "hand must be dealt from a deck - argument is not a deck!";
  }

  return shuffledDeck.slice(0, 5)
};

// This function should accept two card objects, and return true if
// the first card is higher than the second one. The ordering is based
// on the rank first. If the rank of the first card is bigger than the
// rank of the second, the first is always bigger. If the rank is the
// same, then the suit is the tie breaker in this order: clubs,
// diamonds, hearts, spades. In this case, clubs is the lowest suit,
// and spades is the highest. If they are the same rank and suit then
// this function should return false since they are equal.
var isHigherThan = function (cardA, cardB) {
  if (!isCard(cardA) || !isCard(cardB)) {
    throw "inputs must be cards";
  }
  if(ranks.indexOf(cardA["rank"]) > ranks.indexOf(cardB["rank"])) {
    return true;
  } else if(ranks.indexOf(cardA["rank"]) < ranks.indexOf(cardB["rank"])) {
    return false;
  } else {
    if(suits.indexOf(cardA["suit"]) > suits.indexOf(cardB["suit"])) {
      return true;
    } else if(suits.indexOf(cardA["suit"]) < suits.indexOf(cardB["suit"])) {
      return false;
    } else {
      return false;
    }
  }
};

// This function is similar (though not the opposite) of the isHigher
// function.
var isLowerThan = function (cardA, cardB) {
  if (cardA['suit'] === cardB['suit'] && cardA['rank'] === cardB['rank']) {
    return false;
  }
  return !isHigherThan(cardA, cardB);
};

// Use the isHigher function to find the highest card in an array
// of cards
var highCard = function (cards) {
  return cards.reduce(function(highestCard, card) {
    if(isHigherThan(card, highestCard)) {
      highestCard = card;
    }
    return highestCard;
  });
};

// Use the isLower function to find the lowest card in an array
// of cards
var lowCard = function (cards) {
  return cards.reduce(function(lowestCard, card) {
    if(isLowerThan(card, lowestCard)) {
      lowestCard = card;
    }
    return lowestCard;
  });
};

// Returns true if the hand contains a pair. Remember -- it returns
// true if the hand *contains* a pair, so if you send in two-pair or
// three-of-a-kind it should still return true. We'll account for that
// later.

var hasPair = function (hand, card) {
  return hasMatching(hand, card, 2);
}

var hasMatching = function (hand, card, matchCount) {
  var sameRanks = hand.filter(function(comparedCard) {
    return card['rank'] == comparedCard['rank'];
  }).length
  return sameRanks >= matchCount;
}

var containsPair = function (hand) {
  return hand.some(function(card) {
    return hasPair(hand, card);
  });
};

// Returns true if the hand contains two-pair
var containsTwoPair = function (hand) {
  return hand.filter(function(card) {
    return hasPair(hand, card);
  }).length >= 4;
};

// Returns true if the hand contains three-of-a-kind
var containsThreeOfAKind = function (hand) {
  return hand.some(function(card) {
    var sameRanks = hand.filter(function(comparedCard) {
      return card['rank'] == comparedCard['rank'];
    }).length
    return sameRanks >= 3;
  });
};

// Returns true if the hand contains any kind of straight, including
// one where the ace is low
var containsStraight = function (hand) {
  var ranksAsInts = hand.map(function(card) {
    return ranks.indexOf(card['rank']); 
  });
  var sortedRanks = ranksAsInts.sort(function(a,b) { return a-b; });

  // check for ace low straight
  if(
    sortedRanks[0] === 0 &&
    sortedRanks[1] === 1 &&
    sortedRanks[2] === 2 &&
    sortedRanks[3] === 3 &&
    sortedRanks[4] === 12
  ) {
    return true;
  }

  // check for normal straight
  var comparativeRanks = sortedRanks.map(function(rankInt) {
    return rankInt - sortedRanks[0];
  });

  return comparativeRanks[0] === 0 &&
    comparativeRanks[1] === 1 &&
    comparativeRanks[2] === 2 &&
    comparativeRanks[3] === 3 &&
    comparativeRanks[4] === 4;

};

// Returns true if the hand contains a flush
var containsFlush = function (hand) {
  return hand.every(function(card) {
    return card['suit'] == hand[0]['suit'];
  });
};

// Returns true if the hand contains a full house
var containsFullHouse = function (hand) {
  return containsTwoPair(hand) && containsThreeOfAKind(hand);
};

// Returns true if the hand contains four-of-a-kind
var containsFourOfAKind = function (hand) {
  return hand.some(function(card) {
    var sameRanks = hand.filter(function(comparedCard) {
      return card['rank'] == comparedCard['rank'];
    }).length
    return sameRanks >= 4;
  });
};

// Returns true if the hand contains a straight-flush
var containsStraightFlush = function (hand) {
  return containsStraight(hand) && containsFlush(hand);
};

// Returns true if the hand contains a royal-flush
var containsRoyalFlush = function (hand) {
  return containsStraightFlush(hand) &&
    hand.some(function(card) { return card['rank'] === 'ten'; }) &&
    hand.some(function(card) { return card['rank'] === 'ace'; });
};

// Returns a string representing the highest rank a hand has. For
// example, if you send in a full-house, it will contain a pair and a
// three-of-a-kind as well, but a full-house is the highest rank
var highestRank = function (hand) {
  if(containsRoyalFlush(hand)) {
    return "royal flush";
  } else if(containsStraightFlush(hand)) {
    return "straight flush";
  } else if(containsFourOfAKind(hand)) {
    return "four of a kind";
  } else if(containsFullHouse(hand)) {
    return "full house";
  } else if(containsFlush(hand)) {
    return "flush";
  } else if(containsStraight(hand)) {
    return "straight";
  } else if(containsThreeOfAKind(hand)) {
    return "three of a kind";
  } else if(containsTwoPair(hand)) {
    return "two pair";
  } else if(containsPair(hand)) {
    return "pair";
  } else {
    return "bust";
  }
};
