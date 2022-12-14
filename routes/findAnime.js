var express = require("express");
var router = express.Router();
var SPARQLQueryDispatcher = require('./SPARQLQueryDispatcher');

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

router.get("/:name/:director/:date", (req, res, next) => {
  var nameAnime = req.params.name;
  var director = req.params.director;
  var date = req.params.date;
  var query = `SELECT DISTINCT ?anime ?englishName ?japaneseTitle1 ?japaneseTitle2 ?duration (MIN(?r) AS ?releaseDate) ?directorName ?screenwriterName ?prodName
  WHERE 
  {
    ?anime wdt:P31 wd:Q1107.
    ?anime rdfs:label ?englishName.
    FILTER(langMatches(lang(?englishName), "EN") && contains(lcase(?englishName), lcase('${nameAnime}')))
    OPTIONAL{ ?anime wdt:P1476 ?japaneseTitle1. FILTER(langMatches(lang(?japaneseTitle1), "JA"))}
    OPTIONAL{ ?anime wdt:P1705 ?japaneseTitle2. FILTER(langMatches(lang(?japaneseTitle2), "JA"))}
    OPTIONAL{ ?anime wdt:P2047 ?duration.}  
    OPTIONAL{ ?anime wdt:P577 ?r. FILTER(?r> '${date}'^^xsd:dateTime)}
    OPTIONAL{ ?anime wdt:P57 ?director. ?director rdfs:label ?directorName.  FILTER( langMatches(lang(?directorName), "EN") && contains(lcase(?directorName), lcase('${director}')) ) }
    OPTIONAL{ ?anime wdt:P58 ?screenwriter. ?screenwriter rdfs:label ?screenwriterName. FILTER(langMatches(lang(?screenwriterName), "EN"))}
    OPTIONAL{ ?anime wdt:P272 ?prod. ?prod rdfs:label ?prodName.  FILTER(langMatches(lang(?prodName), "EN"))}
  }
  GROUP BY ?anime ?englishName ?japaneseTitle1 ?japaneseTitle2 ?duration ?releaseDate ?directorName ?screenwriterName ?prodName
  ORDER BY ASC (?englishName)`;
 
  queryDispatcher.query(query).then((d) => {
    res.send(d.results.bindings);
    res.end();
  });
});

module.exports = router;
