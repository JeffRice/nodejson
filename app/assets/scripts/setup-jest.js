 const jsdom = require("jsdom");
 const { JSDOM } = jsdom;


 //destructure window object from JSDOM
 const { window } = new JSDOM(`<!DOCTYPE html><html><head>
 </head><body></body></html>`, {
     contentType: "text/html",
     includeNodeLocations: true,
     resources: "usable",
     storageQuota: 10000000,
     runScripts: "dangerously"
 });

 const $ = require('jquery')(window);

 global.window = window
 global.document = window.document

 global.jQuery = $
 global.$ = $




