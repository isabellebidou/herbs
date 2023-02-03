const _ = require ('lodash')
const fs = require("fs");
const mongoose = require('mongoose');
const upload = require("../storage-config");
const Pic = mongoose.model('herbpics');


  async function getHerbPic(id) {

    return new Promise((resolve,reject) => {
      var  result = '';
      getHerbPicData(id).then( (picData)=> {
  
        picData.map( async (pic) => {
          const data = pic.pic.data;
          const b64str= await makeBase64String(data);
          result = b64str;

  
  
         
      });
  
  
      }).then(()=>{
        resolve (result);
        reject (null);
      })


      })

    }
  
  

async function getHerbPic2(id) {

   
    result = await getHerbPicData(id).then(function (d){

      b64(d)

    return d;

    })
    //const finalb64= await b64();


    return result;

    
    
    }

    async function getHerbPicData(herbId){
        const herbPicData =  await Pic.find({plantId : herbId});

        
        return herbPicData;

    }

    async function b64(hpdata) {
        hpdata.map( async (pic) => {
            const data = pic.pic.data;
            const b64str= await makeBase64String(data);
    
            return b64str;
        });
      }

    async function makeBase64String(d){
        const b64=   btoa (
            new Uint8Array(d).reduce(function (data, byte) {
              return data + String.fromCharCode(byte);
            }, "")
          );
          return b64

    }
    
    module.exports = {
        getHerbPic
    };