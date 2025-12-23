//import prisma client
const prisma = require('./db.service')
// Service to handle pair related DB operations

//create a pair
async function createPair(token0Id, token1Id){
    // 1. Make sure BOTH tokens exist
    const token0 = await prisma.token.findUnique({ where: { id: token0Id }});
    const token1 = await prisma.token.findUnique({ where: { id: token1Id }});

    if (!token0 || !token1) {
        throw new Error("One or both token IDs do not exist.");
    }
   // 2. Check if pair already exists (regardless of order)
    const existing = await prisma.pair.findFirst({
        where: {
            OR: [
                { token0Id, token1Id },
                { token0Id: token1Id, token1Id: token0Id }  // reversed pair
            ]
        }
    });

    if (existing) {
        throw new Error("Pair already exists.");
    }
   // 3. Create the pair
  return await prisma.pair.create({
    data: {
        token0Id,
        token1Id,
    },
    include:{
        token0 : true,
        token1 :true,
    },
  })
}

//get all pairs
async function getPairs(){
    return await prisma.pair.findMany({
        include:{
            token0 : true,
            token1: true,
        },
    })
}


module.exports = { createPair, getPairs };