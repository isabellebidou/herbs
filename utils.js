function findTagsList(gallery) {
  return new Promise((resolve, reject) => {
    let result = [];
    let places = [];
    let countries = [];
    for (i = 0; i < gallery.length; i++) {
      var photo = gallery[i];
      if (photo.photoCountry) {
        countries.push(photo.photoCountry.trim().toLowerCase());
      }
      if (photo.photoTags && photo.photoTags != []) {
        var tags = photo.photoTags;
        var values = tags.split(",");
        if (values) {
          for (j = 0; j < values.length; j++) {
            if (values[j] && values[j] != "[]" && values[j] != "undefined")
              result.push(values[j].trim().toLowerCase());
          }
        }
      }
      if (photo.photoPlace) {
        places.push(photo.photoPlace.trim().toLowerCase());
      }
    }
    result = [...result, ...places, ...countries];
    const uniqueResult = new Set(result);
    const finalResult = [...uniqueResult];
    if (finalResult) resolve(finalResult.sort());
  });
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
function stripPhotoName(name) {
  return name.replace(/[0-9]/g, "").replace(/.jpg/g, "").trim().toLowerCase();
}
function findPhotoSetValues(gallery) {
  return new Promise((resolve, reject) => {
    var setNameArray = [];
    for (var i = 0; i < gallery.length; i++) {
      var setName = stripPhotoName(gallery[i].photoName);
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

function findPhotoInJsonArray(id, gallery) {
  return gallery.find((item) => item.photoId === id);
}
function findPhotoInJsonArray2(id, gallery) {
  for (let index = 0; index < gallery.length; index++) {
    const photo = gallery[index];
    if (photo.photoId === id)
    return photo  
  }

}

module.exports = {
  findTagsList: findTagsList,
  checkAuthenticated,
  checkNotAuthenticated,
  isValidJSON,
  log,
  findPhotoSetValues,
  getKey,
  stripPhotoName,
  findPhotoInJsonArray,
  findPhotoInJsonArray2
  
};
