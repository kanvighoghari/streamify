const aj = require("../lib/arcjet")
const { isSpoofedBot } = require("@arcjet/inspect");

const arcjetProctection = async (req,res,next)=>{
    try{
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message : "Rate limit exceed .Please try again later"})
            }else if(decision.reason.isBot()){
                return res.status(403).json({message: "Bot access denied"})
            }else{
                return res.status(403).json({message:"access denied by security policy"})
            }
        }

        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error:"spoof bot detected",
                message:"Malicous bot activity detected"
            })
        }

        next();
    }catch(err){
        console.log("arcjet protection error : " , err)
        next()
    }
}

module.exports = arcjetProctection