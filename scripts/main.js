const fs = require('fs');
const scrape = require('./scraper_function.js');

//checking if events were scraped previously

fs.readFile('../events.json', 'utf-8', (err, data_fromFile) => {
 if (err) return console.error('Failed reading file:', err);
 
 //if not - scrape 

 if(!data_fromFile){
  return scraped();
 }
 
 //if they were scraped: 
 //1. taking existing data from events.json
 //2. scraping current events
 //3. comparing the two
 //4 if different - writing into added_events.txt
 //5 if not - done.

 let data_fromFile_parsed = JSON.parse(data_fromFile);
 
 scraped()
  .then((data)=>isDifferent(Array.from(data_fromFile_parsed), Array.from(data)))
  .catch((err)=>{
   throw new Error(err.message + '' + 'problem checking if different');
  })
  .then((res)=>{
   if(res.length<1){
    return;
   }
   fs.writeFile('../added_events.txt', JSON.stringify(res, null, 4), (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file');
   });
  }).catch((err)=>{
   throw err.message;
  });
 
});

async function scraped(){
 let res = await scrape();
 fs.writeFile('../events.json',JSON.stringify(res, null, 4),'utf-8', (err)=>{
  if(err) throw new Error('something went wrong during writing to the file');
 });
 return res;
}

function isDifferent(o1,o2){

 let mapping = (obj)=>{
  return obj.map(function(val){
   return val.shows;
  });
 };

 let arr1 = mapping(o1);
 let arr2 = mapping(o2);

 let added_shows = Object.values(arr2[0]).filter(function(val){
  if( (!Object.values(arr1[0]).includes(val)) ){
   return val;
  }
 });

 return added_shows;

}

