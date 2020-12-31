function newUser() {
  return [
    {
      id: 1,
      username: "Davet",
      email: "random1@gmail.com",
      pass: "Harrisville",
      subscription: "Late Nights",
    },
    {
      id: 2,
      username: "Davet312",
      email: "random2@gmail.com",
      pass: "Ville",
      subscription: "Straight Up Always Working",
    },
    {
      id: 3,
      username: "DaveRoad",
      email: "random3@gmail.com",
      pass: "Springfield",
      subscription: "Late Nights",
    },
    {
      id: 4,
      username: "Dave",
      email: "random4@gmail.com",
      pass: "Sydney",
      subscription: "Most Late Nights",
    },
  ];
}

function noBuenoAttack() {
  const userAttack = {
    id: 911,
    username: "noBuenoDave",
    email: "noBuenoDave@badGuy.com",
    pass: "badPassword",
    subscription: "NotASubscriptionChoice",
  };

  const expectedUser = {
    id: 911,
    username: "noBuenoDave",
    email: "noBuenoDave@badGuy.com",
    pass: "badPassword",
    subscription: "NotASubscriptionChoice",
  };
  return {
    userAttack,
    expectedUser,
  };
}

module.exports = {
  newUser,
  noBuenoAttack,
};
