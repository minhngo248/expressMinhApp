var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

// the SPARQL query itself
var query = `SELECT DISTINCT ?item ?itemLabel ?dirData ?director WHERE {
  ?item p:P136 ?genreStatement;
        p:P57  ?dirState.
  ?genreStatement (ps:P136/(wdt:P279*)) wd:Q1107.
  ?dirState ps:P57 ?dirData.
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en". 
    ?item rdfs:label ?itemLabel.
    ?dirData rdfs:label ?director.
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
