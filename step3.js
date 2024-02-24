const fs = require("fs");
const process = require("process");
const axios = require("axios");

function output(text, out) {
  if (out) {
    fs.writeFile(out, text, "utf-8", function (err) {
      if (err) {
        console.log(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

function cat(path, out) {
  fs.readFile(path, "utf-8", function (err, data) {
    if (err) {
      console.log(`Error reading ${path}: ${err}`);
      process.exit(1);
    } else {
      output(data, out);
    }
  });
}

async function webCat(url, out) {
  try {
    let res = await axios.get(url);
    output(res.data, out);
  } catch (err) {
    console.log(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

let path;
let out;

if (process.argv[2] === "--out") {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.slice(0, 4) === "http") {
  webCat(path, out);
} else {
  cat(path, out);
}
