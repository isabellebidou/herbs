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

module.exports = {
  findTagsList,
  checkAuthenticated,
  checkNotAuthenticated,
};
