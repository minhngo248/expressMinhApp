var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require("./SPARQLQueryDispatcher");

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/", (req, res, next) => {
  var query = `SELECT DISTINCT ?item ?itemLabel 
  (GROUP_CONCAT(DISTINCT ?box; SEPARATOR=", ") AS ?boxOffice)  
WHERE {
?item p:P136 ?genreState;
    p:P2142 ?boxState.
?boxState ps:P2142 ?box.
?genreState (ps:P136/(wdt:P279*)) wd:Q1107.
SERVICE wikibase:label { bd:serviceParam wikibase:language "en".
              ?item rdfs:label ?itemLabel.
             }
} GROUP BY ?item ?itemLabel
ORDER BY ?itemLabel`;

  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
