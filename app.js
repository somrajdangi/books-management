const express = require('express')
const app = express()
app.set('view engine','ejs');
app.use(express.static('public'));
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
const mongoose=require('mongoose');
let bookData=[{name:'Atomic habit',author:'James Clear',page:20,price:14,isAvailable:true},
{name:'Basic Electrial',author:'Bl Theraja',page:200,price:14,isAvailable:true}]

mongoose.connect(process.env.DATABASE_URL);
let  booksSchema=mongoose.Schema({
    name:String,
    author:String,
    pages:Number,
    price:Number,
    isAvailable:Boolean
})

let Books=new mongoose.model('books',booksSchema);

app.get('/',async(req,res)=>{
    let bookData=await Books.find();
    res.render('home',{items:bookData });
})
app.post('/add',(req,res)=>{
    let book=req.body;
    let tempBook=new Books({
         name:book.name,
         author:book.author,
         pages:book.pages,
         price:book.price,
         isAvailable:true
         })
    tempBook.save()
    res.redirect('/')
})
app.post('/delete',async(req,res)=>{
   
   let bookNameToRemove=req.body.bookName;
    await Books.deleteOne({name:bookNameToRemove})
    res.redirect('/')
})
app.post('/issue',async(req,res)=>{
    let bookName=req.body.bookName;
    await Books.updateOne({name:bookName},{$set:{isAvailable:false}})
    res.redirect('/')
})
app.post('/return',async(req,res)=>{
    let bookName=req.body.bookName;
    await Books.updateOne({name:bookName},{$set:{isAvailable:true}})
    res.redirect('/')
})
app.listen(process.env.PORT||3000,(req,res)=>{
    console.log('app running on port 3000');
})