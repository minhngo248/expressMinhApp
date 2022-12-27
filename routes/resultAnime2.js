var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require("./SPARQLQueryDispatcher");

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:idAnime", (req, res, next) => {
  var idAnime = req.params.idAnime;
  var query = `SELECT DISTINCT ?datePub ?screenWriter ?voiceActor WHERE {
    wd:${idAnime} p:P577 ?datePubStatement;
              p:P58 ?screenWriterState;
              p:P725 ?voiceActorState.
    ?datePubStatement ps:P577 ?datePub.
    ?screenWriterState ps:P58 ?screenWriterData.
    ?screenWriterData rdfs:label ?screenWriter.
    ?voiceActorState ps:P725 ?voiceActorData.
    ?voiceActorData rdfs:label ?voiceActor.
    FILTER(langMatches(lang(?screenWriter), "EN") && langMatches(lang(?voiceActor), "EN")).
    } 
    ORDER BY ?datePub`;

  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
