var xml2js = require('xml2js');
var express = require("express");
var router = express.Router();

// the SPARQL query itself
var query = `SELECT DISTINCT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  {
    SELECT DISTINCT ?item WHERE {
      ?item p:P136 ?statement0.
      ?statement0 (ps:P136/(wdt:P279*)) wd:Q1107.
      ?item p:P136 ?statement1.
      ?statement1 (ps:P136/(wdt:P279*)) wd:Q20650540.
    }
  }
}`;

// run query with promises
let value;
var url = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(query);

let options = {
  method: "GET",
  headers: {
    "content-Type": "application/sparql-results+json;charset=utf-8",
    "access-control-allow-origin": "*"
  },
};

let fetchRes = fetch(url, options);
fetchRes
  .then(response => {
    return response.text();
  })
  .then(d => {
    xml2js.parseString(d, (err, res) => {
      value = res;
      console.log(value.sparql.results);
    });
    router.get("/", function (req, res, next) {
      res.send(value.sparql.results);
    });
  });

module.exports = router;
