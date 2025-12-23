const prisma = require("./db.service");

// Create user
async function createUser(wallet) {
  // Check existing
  const existing = await prisma.user.findUnique({
    where: { wallet }
  });

  if (existing) return { error: "USER_EXISTS" };

  // Create new user
  return await prisma.user.create({
    data: { wallet }
  });
}

// Get users
async function getUsers() {
  return await prisma.user.findMany();
}

module.exports = { createUser, getUsers };
