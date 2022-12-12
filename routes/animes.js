var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

// the SPARQL query itself
var query = `SELECT DISTINCT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "English". }
  {
    SELECT DISTINCT ?item WHERE {
      ?item p:P136 ?statement0.
      ?statement0 (ps:P136/(wdt:P279*)) wd:Q1107.
    }
  }
}`;

const endpointUrl = 'https://query.wikidata.org/sparql';

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( query ).then( d =>  {
  router.get("/", (req, res, next) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
