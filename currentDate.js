const currentDate =()=>{
 let date = new Date();
 let locale = 'en-us';
 let month = date.toLocaleString(locale,{ month: 'long' });
 let year = date.getUTCFullYear();
 let currDate = `${month} ${year}`;
 return currDate;
};

module.exports = currentDate;