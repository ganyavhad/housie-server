const _ = require("lodash");

module.exports = function () {
  let drawNumbers = [];
  for (i = 1; i <= 90; i++) {
    drawNumbers.push(i);
  }

  drawNumbers = _.shuffle(_.shuffle(_.shuffle(drawNumbers)));

  setInterval(() => {
    _.shuffle(_.shuffle(_.shuffle(drawNumbers)));
    let num = drawNumbers.pop();
    // let num = _.shuffle(_.shuffle(_.shuffle(drawNumbers))).pop();
    io.emit("draw", num);
    console.log(num, drawNumbers.length);
  }, 5 * 1000);
};
