const mongoose = require('mongoose')
const {Schema} = mongoose; // =const Schema = mongoose.Schema;  destructuring


const herbSchema = new Schema ({
    herbName: String,
    herbCategory: String,
    herbProperties: String,
    herbLinks: String,
    herbNameLatin: String,
    herbNameChinese: String,
    herbNameFrench: String,
    herbProducts: String,
    herbComments: String,
    herbTags: String,
    herbText: String
    
})

mongoose.model('herbs',herbSchema);