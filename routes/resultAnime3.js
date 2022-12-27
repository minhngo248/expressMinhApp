var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require("./SPARQLQueryDispatcher");

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:idAnime", (req, res, next) => {
  var idAnime = req.params.idAnime;
  var query = `SELECT DISTINCT ?producer ?productionCom ?distributed ?duration WHERE {
    wd:${idAnime} p:P2047 ?durationState.
    ?durationState ps:P2047 ?duration.
    OPTIONAL {
    wd:${idAnime} p:P162 ?producerStatement;
          p:P272 ?prodState;
          p:P750 ?distributedState.
    ?producerStatement ps:P162 ?producerData.
    ?prodState ps:P272 ?productionComData.
    ?distributedState ps:P750 ?distributedData.
    ?producerData rdfs:label ?producer.
    ?productionComData rdfs:label ?productionCom.
    ?distributedData rdfs:label ?distributed.
        FILTER(langMatches(lang(?producer), "EN") && langMatches(lang(?productionCom), "EN") && langMatches(lang(?distributed), "EN")).
        }
    }`;

  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;