import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const PORT = process.env.PORT || 3000;
const PORT = 3000;
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));



const db = new pg.Client({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: String(process.env.password),
  port: process.env.port
});



db.connect();





// const capitals = [
//     {country: 'USA',capital:'New York'},
//     {country: 'Ghana',capital:'Accra'},
//     {country: 'Canada',capital:'Angeles'}
// ]

let capitals =[]

let totalScore=0;
let currentQuestion ={}
let isCorrect = false;

   db.query("SELECT * from capitals",(err, result)=>{
       if (err){
           console.log(err);
       }else{
           capitals = result.rows;
           // console.log(result.rows);
           console.log(capitals);
           db.end()
       }
   })

const nextQuestion = ()=>{
    const capitalRandom = capitals[Math.floor(Math.random() * capitals.length)];

    currentQuestion = capitalRandom;
}




app.get('/', async (req, res) => {
    await nextQuestion();
    res.render('countryView.ejs',{total:totalScore,question:currentQuestion});
})

app.post('/random', async(req, res) => {
    isCorrect = false;
    const answer= req.body.capitals.trim()
    if(answer.toLowerCase() === currentQuestion.capital.toLowerCase())
    {
         totalScore++
        isCorrect = true;
    }
      await nextQuestion();
    res.render('countryView.ejs',{total:totalScore,question:currentQuestion});

})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));