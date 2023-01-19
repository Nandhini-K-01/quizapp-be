const { PrismaClient } = require('@prisma/client')
const express = require("express");
const registerRouter = require("./router/registerRouter");

const prisma = new PrismaClient()

const app = express()

app.use(express.json())
app.set('view engine', 'ejs');

app.use("/register", registerRouter);

async function main() {
  const allUsers = await prisma.user.findMany({
    where:{userName:"xx@gmail.com"}
  })
  console.log(allUsers)
  if(!allUsers[0]){
    console.log("yes")
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
