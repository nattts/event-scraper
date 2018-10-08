const puppeteer = require('puppeteer');
const currentDate = require('../currentDate.js');
var fs = require('fs');

let link = 'http://www.robertwilson.com/events-list/';

let scrape = async () => {
 const browser = await puppeteer.launch();
 const page = await browser.newPage();
 
 const { err, data } = await page.goto(link);
 if(err) console.log(err + ' ' + 'problem with link');
  
 const allEvents = await page.evaluate(()=>{
  let evts =[];
  try{

   let eventList = document.querySelector('.archive-group-list'); 
   let arr = Array.from(eventList.children);
 
   arr.forEach((val)=>{
    let month_name = val.querySelector('.archive-group-name-link').innerText.trim(); 
    let dates_and_shows_ul = Array.from(val.children[1].children);

    let shows = {};
    dates_and_shows_ul.forEach((val,index)=>{
     shows['date'+index] = val.querySelector('.archive-item-date-after').innerText;
     shows['show'+index] = val.querySelector('.archive-item-link').innerText;
      
    });

    evts.push({
     month_name,
     shows,
     
    });
   });
    
   return{
    evts
      
   };
  }
  catch(e){
   console.log('problem finding right element');
  }
 });

 const result = await (()=>{
 // function to find index to use it to slice array later
  function find_index(data){
   for (let index in data){
    if (data[index].month_name === currentDate()){
     return parseInt(index);
    }
   }
  }
  try{
   let arr = allEvents.evts.slice(0,find_index(allEvents.evts)+1 );
   return arr;

  }catch(e){
   console.log('problem slicing the list');
  }

 })();

 browser.close();
 return result;
};


module.exports = scrape;
 