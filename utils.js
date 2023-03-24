//const fs = require("fs");

function findTagsList(gallery) {
  return new Promise((resolve, reject) => {
    let result = [];
    let properties = [];
    let names = [];
    for (i = 0; i < gallery.length; i++) {
      var herb = gallery[i];

      if (herb.herbTags && herb.herbTags != []) {
        var tags = herb.herbTags;
        var values = tags.split(",");
        if (values) {
          for (j = 0; j < values.length; j++) {
            if (values[j] && values[j] != "[]" && values[j] != "undefined")
              result.push(values[j].trim().toLowerCase());
          }
        }
      }
      if (herb.herbProperties && herb.herbProperties != []) {
        var herbProperties = herb.herbProperties;
        var values = herbProperties.split(",");
        if (values) {
          for (j = 0; j < values.length; j++) {
            if (values[j] && values[j] != "[]" && values[j] != "undefined")
              properties.push(values[j].trim().toLowerCase());
          }
        }
      }
      if (herb.herbName) {
        var herbProperties = herb.herbProperties;
        var values = herbProperties.split(",");
        if (values) {
          for (j = 0; j < values.length; j++) {
            if (values[j] && values[j] != "[]" && values[j] != "undefined")
              names.push(values[j].trim().toLowerCase());
          }
        }
      }
      if (herb.herbNameLatin) {
        names.push(herb.herbNameLatin.trim().toLowerCase());
      }
      if (herb.herbNameFrench) {
        names.push(herb.herbNameLatin.trim().toLowerCase());
      }
      if (herb.herbNameChinese) {
        names.push(herb.herbNameLatin.trim().toLowerCase());
      }
    }
    result = [...result, ...names, ...properties];
    const uniqueResult = new Set(result);
    const finalResult = [...uniqueResult];
    //var data = JSON.stringify(finalResult);
    //fs.writeFileSync("./models/datalist.json", data);
    if (finalResult) resolve(finalResult.sort());
  });
}
function stringToArray(str) {
  var array = [];
  if ((typeof(str) === 'string') && (str.includes(','))){
  
    var values = str.split(",")

  if (values.length>1) {
    for (j = 0; j < values.length; j++) {
      if (values[j] && values[j] != "[]" && values[j] != "undefined") {
        var url = values[j].trim().toLowerCase();
        if (url && url !== null){
          try {
            let domain = new URL(url);
            domain = domain.hostname;
          array.push({ url, domain });
          } catch (error) {
            log(url+ ' '+error)
            
          }
        } 
      }
    }
  }
} else {
  return str
}
  return array;
}
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
//https://stackoverflow.com/questions/50211006/how-to-validate-json-objects-without-using-any-external-libraries
function isValidJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}
function log(text) {
  if (process.env.NODE_ENV !== "production") {
    console.log(text);
  }
}
function stripherbName(name) {
  return name.replace(/[0-9]/g, "").replace(/.jpg/g, "").trim().toLowerCase();
}
function findherbSetValues(gallery) {
  return new Promise((resolve, reject) => {
    var setNameArray = [];
    for (var i = 0; i < gallery.length; i++) {
      var setName = stripherbName(gallery[i].herbName);
      setNameArray.push(setName);
    }
    setNameArray = setNameArray.sort();
    setNameArray = new Set(setNameArray);
    const finalResult = [...setNameArray];
    if (finalResult) resolve(finalResult.sort());
  });
}
//https://stackoverflow.com/questions/47135661/how-can-i-get-a-key-in-a-javascript-map-by-its-value
function getKey(val, map) {
  log(`${val}  ${map}`);
  let invertedMap = new Map(
    [...map.entries()].map(([key, value]) => [value, key])
  );

  return invertedMap.get(val);
}
function makeSqlQuery(filtered, searchItem){
  var sql = "";
  if (filtered === true) {
    sql =
  'select * FROM herb WHERE herbTags LIKE  "%' +
  searchItem +
  '%" OR herbProperties LIKE "%' +
  searchItem +
  '%" OR herbName LIKE "%' +
  searchItem +
  '%" OR herbNameChinese LIKE "%' +
  searchItem +
  '%" OR herbNameFrench LIKE "%' +
  searchItem +
  '%" OR herbNameLatin LIKE "%' +
  searchItem +
  '%" OR herbCategory LIKE "%' +
  searchItem +
  '%" ORDER BY herbName;';
  } else {
    sql = "select * FROM herb ORDER BY herbName ASC; "
  }

return sql;
}

function findherbInJsonArray(id, gallery) {
  return gallery.find((item) => item.herbId === id);
}
function findherbInJsonArray2(id, gallery) {
  for (let index = 0; index < gallery.length; index++) {
    const herb = gallery[index];
    if (herb.herbId === id) return herb;
  }
}


module.exports = {
  findTagsList: findTagsList,
  checkAuthenticated,
  checkNotAuthenticated,
  isValidJSON,
  log,
  findherbSetValues,
  getKey,
  stripherbName,
  findherbInJsonArray,
  findherbInJsonArray2,
  stringToArray,
  makeSqlQuery
};
