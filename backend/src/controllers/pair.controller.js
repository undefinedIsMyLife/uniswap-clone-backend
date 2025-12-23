const pairService = require("../services/pair.service")
// Controller to handle pair related requests

//Create a pair
async function createPair(req, res) {
    try {
            const { token0Id, token1Id} = req.body;
            if ( token0Id == token1Id || !token0Id || !token1Id){
                return res.status(400).json({ error: "Either both token IDs must be different and valid" });
            }
        
            const pair = await pairService.createPair(token0Id, token1Id);
             res.json(pair);

        } catch (error){
            console.error("Error creating pair:", error);
            res.status(500).json({ error : "Failed to create Pair"});
        }

}

//get all pairs
async function getPairs(req, res){
    try{
        const pairs = await pairService.getPairs();
        res.json(pairs);
    }
    catch(error){
        console.error("Error Fetching errors:",error);
        res.status(500).json({ error : "Failed to fetch pairs"})
    }
}

module.exports = { createPair, getPairs };