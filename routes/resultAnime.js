var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:idAnime", (req, res, next) => {
  var idAnime = req.params.idAnime;
  var query = `SELECT DISTINCT ?filmLabel ?logo ?director ?genre WHERE {
    wd:${idAnime} p:P57  ?statement1;
                  p:P136 ?genreStatement.
    ?statement1 ps:P57 ?directorLab.
    ?genreStatement ps:P136 ?genreLabel.
    OPTIONAL { 
      wd:${idAnime} (p:P18 | p:P154) ?logoStatement.
      ?logoStatement (ps:P18 | ps:P154) ?logo. }
    SERVICE wikibase:label { 
      bd:serviceParam wikibase:language "en". 
      wd:${idAnime} rdfs:label ?filmLabel.
      ?directorLab rdfs:label ?director.
      ?genreLabel rdfs:label ?genre.
    }
}`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings[0]);
    res.end();
  });
});

module.exports = router;
