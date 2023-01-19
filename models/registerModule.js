const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require("bcrypt");
const jsw = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    //To check if the usser exists already
    const user = await prisma.user.findMany({
      where: { userName: req.body.userName },
    });
    if (user[0]) {
      return res.status(400).send({ msg: "You are already a registered user" });
    }
    //Password hashing
    const randomString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, randomString);

    //Save in DB
    const response = await prisma.user.create({
      data: { ...req.body },
    });
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Login API
exports.login = async (req, res) => {
  const user = await prisma.user.findMany({
    where: { userName: req.body.userName },
  });
  if (!user[0]) {
    return res.status(400).send({ msg: "You are not a registered user" });
  }
  //Password checking
  const isSamePassword = await bcrypt.compare(req.body.password, user[0].password);

  if (!isSamePassword) {
    return res.status(400).send({ msg: "Your password is incorrect" });
  }

  //Generate jsw token
  const token = jsw.sign(user[0], process.env.SECRET_KEY, {
    expiresIn: "12hr",
  });
  res.send(token);
};
