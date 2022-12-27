var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/", (req, res, next) => {
  var nameAnime = decodeURIComponent(req.query.name);
  var director = decodeURIComponent(req.query.director);
  var dateFrom = req.query.dateFrom;
  var dateTo = req.query.dateTo;
  var query = `SELECT DISTINCT ?item ?name ?director ?datePub WHERE {
    ?item rdfs:label ?name;
          p:P136 ?statement0;
          p:P57  ?statement1;
          p:P577 ?statement2.
    ?statement0 (ps:P136/(wdt:P279*)) wd:Q1107.
    ?statement1 ps:P57 ?directorLab.
    ?directorLab rdfs:label ?director.
    ?statement2 ps:P577 ?datePub.
    FILTER(langMatches(lang(?name), "EN") && langMatches(lang(?director), "EN") && contains(lcase(?name), lcase('${nameAnime}')) && 
    contains(lcase(?director), lcase('${director}')) && '${dateFrom}'^^xsd:dateTime <= ?datePub && ?datePub <= '${dateTo}'^^xsd:dateTime).
  }
  ORDER BY (?datePub)`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
