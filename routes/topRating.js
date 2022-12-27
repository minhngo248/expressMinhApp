var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require("./SPARQLQueryDispatcher");

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/", (req, res, next) => {
  var query = `SELECT DISTINCT ?item ?itemLabel ?dirData ?director
  (GROUP_CONCAT(DISTINCT ?rating; SEPARATOR=", ") AS ?ratings)  
WHERE {
?item p:P136 ?genreState;
    p:P444 ?ratingState;
    p:P57 ?directorState.
?ratingState ps:P444 ?rating.
?directorState ps:P57 ?dirData.
?genreState (ps:P136/(wdt:P279*)) wd:Q1107.
SERVICE wikibase:label { bd:serviceParam wikibase:language "en".
              ?item rdfs:label ?itemLabel.
              ?dirData rdfs:label ?director.  
             }
} GROUP BY ?item ?itemLabel ?dirData ?director
ORDER BY ?itemLabel`;

  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
