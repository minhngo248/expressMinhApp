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
    ?item p:P136 ?genreStatement;
          p:P57  ?dirStatement;
          p:P577 ?dateStatement.
    ?genreStatement (ps:P136/(wdt:P279*)) wd:Q1107.
    ?dirStatement ps:P57 ?dirData.
    ?dateStatement ps:P577 ?datePub.
    SERVICE wikibase:label { 
      bd:serviceParam wikibase:language "en". 
      ?item rdfs:label ?name.
      ?dirData rdfs:label ?director.
    }
    FILTER(contains(lcase(?name), lcase('${nameAnime}')) && contains(lcase(?director), lcase('${director}')) 
    && '${dateFrom}'^^xsd:dateTime <= ?datePub && ?datePub <= '${dateTo}'^^xsd:dateTime).
  }
  ORDER BY (?datePub)`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
