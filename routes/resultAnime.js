var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/", (req, res, next) => {
  var idAnime = req.params.idAnime;
  var query = `SELECT DISTINCT ?predicate ?target WHERE {
    wd:${idAnime} ?predicate ?target.
  }`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
