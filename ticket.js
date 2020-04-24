const _ = require("lodash");
module.exports = function () {
  let ticket = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  let numberArr = [];
  for (let i = 1; i <= 90; i++) {
    numberArr.push(i);
  }
  let colArr = [];
  let start = 0;
  let end = 10;
  for (i = 0; i < 9; i++) {
    let shuffleArr = _.shuffle(
      _.shuffle(_.shuffle(_.slice(numberArr, start, end)))
    );
    start = start + 10;
    end = end + 10;
    colArr.push(_.sortBy(shuffleArr.slice(0, 3)));
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 3; j++) {
      ticket[j][i] = {number: colArr[i][j], status: "Pending"};
    }
  }
  let tempArr = _.slice(numberArr, 0, 9);
  let shuffleArr = _.shuffle(_.shuffle(_.shuffle(tempArr)));
  for (let i = 0; i < 3; i++) {
    let arr = shuffleArr.slice(0, 4);
    shuffleArr = _.shuffle(_.shuffle(_.shuffle(shuffleArr.slice(4, 9))));
    arr.forEach((a) => {
      ticket[i][a - 1] = {number: 0, status: "None"};
    });
    if (arr.length == 1) {
      let newArr = _.slice(_.shuffle(_.shuffle(_.shuffle(tempArr))), 0, 4);
      let counter = 0;
      newArr.forEach((a) => {
        if (counter < 3 && a != arr[0]) {
          ticket[i][a - 1] = {number: 0, status: "None"};
          counter++;
        }
      });
    }
  }
  return ticket;
};
