var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:idAnime", (req, res, next) => {
  var idAnime = req.params.idAnime;
  var query = `SELECT DISTINCT ?filmLabel ?logo ?director ?genre WHERE {
    wd:${idAnime} rdfs:label ?filmLabel;
                  p:P57  ?statement1;
                  p:P136 ?genreStatement.
    ?statement1 ps:P57 ?directorLab.
    ?directorLab rdfs:label ?director.
    ?genreStatement ps:P136 ?genreLabel.
    ?genreLabel rdfs:label ?genre.
    OPTIONAL { 
      wd:${idAnime} (p:P18 | p:P154) ?logoStatement.
      ?logoStatement (ps:P18 | ps:P154) ?logo. }
    FILTER(langMatches(lang(?filmLabel), "EN") && langMatches(lang(?director), "EN") && 
           langMatches(lang(?genre), "EN")).
}`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings[0]);
    res.end();
  });
});

module.exports = router;
