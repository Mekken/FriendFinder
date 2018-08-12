const path = require("path");
const matches = require("../app/data/friends");
const MAX_DIFF = 50;

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
        totalDifferences = [],
        bestMatchIdx = -1,
        bestMatchScore = MAX_DIFF;
        newMatchScores = newMatch.scores,
        candidates = matches.filter(function(match) {
            return match.name !== name; 
        });

    for(let i = 0; i <   candidates.length; ++i) {
        let diffArr = [];
        for(let j = 0; j < candidates[i].scores.length; ++j) {
            let diff = Math.abs(newMatchScores[j] - candidates[i].scores[j]);

            diffArr.push(diff);
        }   
        totalDifferences.push(diffArr.reduce(function(acc,val) { return acc + val; }));
        //console.log(totalDifferences);
    }

    totalDifferences.forEach( function(diff,idx) {
        if(diff < bestMatchScore) {
            bestMatchIdx = idx;
            bestMatchScore = diff; 
            //console.log("New Match Found at Index:",idx);
        }
    });

    //console.log(candidates[bestMatchIdx]);
    res.send(candidates[bestMatchIdx]).end();
}