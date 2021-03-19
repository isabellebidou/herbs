
const {findTagsList} = require('./utils');

test('properly extracts tags from gallery', () => { 
const gallery = [
    {
       "photoId":497,
       "photoName":"phone15.jpg",
       "photoThumbnail":"phone15s.jpg",
       "photoCategory":" city",
       "photoCountry":" france",
       "photoPlace":"paris ",
       "photoYear":" ",
       "photoComments":" ",
       "photoTags":"tree",
       "photoPath":"http://isabellebidou.com/images/phone15.jpg"
    },
    {
       "photoId":496,
       "photoName":"phone14.jpg",
       "photoThumbnail":"phone14s.jpg",
       "photoCategory":" city",
       "photoCountry":" france",
       "photoPlace":" paris",
       "photoYear":" ",
       "photoComments":" ",
       "photoTags":"seine, river, castle",
       "photoPath":"http://isabellebidou.com/images/phone14.jpg"
    }
 ]
 const tags = ['tree','seine','river','castle','france', 'paris'].sort();
 return expect(Promise.resolve(findTagsList(gallery))).resolves.toEqual(tags);
});

// const {getGlobalGallery} = require('./getgallery');
//  test('returns gallery from db', () => {
//     return expect(Promise.resolve(getGlobalGallery()).resolves.not.toBe([]));
    
//  });

