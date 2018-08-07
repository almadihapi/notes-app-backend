const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/notes.db',(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connected')
    }
});


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.get('/api', (req,res) => {
    db.all('select * from notes order by id DESC',[], (err,rows)=>{
    if(err){
       console.log(err) 
    }
   res.json(rows);
});
    
});


app.get('/', (req,res) =>{
    res.send('hello');
});

app.post('/api/new', (req,res) => {
    db.run('insert into notes (title,text,color) values(?,?,?)',[req.body.title,req.body.text,req.body.color],(err)=>{
    if(err){
        console.log(err);
    }
});
    res.json({msg:'success'});
});

app.post('/api/:id', (req,res) => {
    
    db.get('select * from notes where id = ?',[req.params.id], (err,row)=>{
    if(err){
        console.log(err);
          }
        
        res.json(row);
    });
    
});

app.post('/api/update/:id', (req,res) => {
     db.run('update notes set title = ?, text = ? , color = ? where id = ?',[req.body.title,req.body.text,req.body.color,req.params.id],(err)=>{
    if(err){
        console.log(err);
    }
});
    
});


app.delete('/api/:id',(req,res) =>{
   db.run('delete from notes where id = ?',[req.params.id],(err)=>{
    if(err){
        console.log(err);
    }
});
      
    
    
});




const listener = app.listen(3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
