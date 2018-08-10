const path = require("path");
const matches = require("../app/data/friends");
const MAX_DIFF = 3;

module.exports = function(app) {
    app.get("/api/friends", function(req, res) {
        res.json(matches);
    });

    app.post("/api/friends", function(req, res) {
        let newMatch = req.body;
        matches.push(newMatch);

        //Determine Compatability, display a match!
        findMatch(newMatch,res);
    });
}   

function findMatch(newMatch,res) {
    let name = newMatch.name,
        scores = newMatch.scores,
        candidates = matches.filter(function(match) {
            return match.name !== name; 
        });

    let foundMatch = candidates.find(function(potentMatch, idx) {
        let diff = [],
            matchScores = potentMatch.scores;
        
        for(let i = 0; i < matchScores.length; ++i)
            diff.push(Math.abs(parseInt(scores[i]) - parseInt(matchScores[i]))); 

        let sum = diff.reduce(function(acc,currVal) { return Math.abs(acc - currVal)}, 0);
        return sum <= MAX_DIFF;
    });

    //console.log(foundMatch);
    res.send(foundMatch).end();
}