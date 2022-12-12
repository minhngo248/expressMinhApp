var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

var idAnime;
const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:id", (req, res, next) => {
  idAnime = req.params.id;
  var query = `SELECT DISTINCT ?p ?o WHERE {
    wd:${idAnime} ?p ?o.
  }`;
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
