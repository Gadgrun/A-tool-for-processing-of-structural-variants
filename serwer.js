var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");


var app = express();
var server = http.createServer(app);
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 min
  max: 150 // 150 zapytań w 20min maax
});


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/index.html'));
});


app.post('/view', function(req,res){

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('licencjat')
    const collection = db.collection('licencjat')
    console.log('Connected to collection')
    if(req.body.id && req.body.pos && req.body.pos2 && req.body.FILTER){
    db.collection('licencjat').find({  CHROM: req.body.id , FILTER:req.body.FILTER , POS:{$gte: parseInt(req.body.pos), $lte: parseInt(req.body.pos2)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
    if(req.body.id && req.body.pos && req.body.pos2){
    db.collection('licencjat').find({  CHROM: req.body.id , POS:{$gte: parseInt(req.body.pos), $lte: parseInt(req.body.pos2)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
    if(req.body.id && req.body.pos && req.body.FILTER){
    db.collection('licencjat').find({  CHROM: req.body.id , FILTER:req.body.FILTER , POS:{$gte: parseInt(req.body.pos)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
    if(req.body.id && req.body.pos2 && req.body.FILTER){
    db.collection('licencjat').find({  CHROM: req.body.id , FILTER:req.body.FILTER , POS:{$lte: parseInt(req.body.pos2)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
   if(req.body.id && req.body.pos){
    db.collection('licencjat').find({  CHROM: req.body.id , POS:{$gte: parseInt(req.body.pos)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
if(req.body.id && req.body.FILTER){
    db.collection('licencjat').find({  CHROM: req.body.id , FILTER:req.body.FILTER }).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };
    if(req.body.id && req.body.pos2){
    db.collection('licencjat').find({  CHROM: req.body.id , POS:{$lte: parseInt(req.body.pos2)}}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };

    if(req.body.id){
    db.collection('licencjat').find({CHROM: req.body.id}).toArray()
    .then(results => {
      var Wynik = `
      <!DOCTYPE html>
<html lang = "pl">
<head>
  <meta charset = "UTF-8">
   <!-- <link rel = "stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <title> Licencjat Kamil Rettig </title>
</head>
<body>
  <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item active"> <a href="/">Home</a></li>
  </ol>
</nav>

<form action="/view" method="POST">
  <div class="container-lg p-3 my-3 border">
    
    <p>Po przeszukaniu bazy danych następuje wyswietlenie wynikow</p>
            <h3>Znalezione dokumenty:</h3>
            <ul>`;
            if(results.length>0){
        for(i = 0; i < results.length; i++){
            
            pojdokument = "<b>CHROM</b>: " + results[i].CHROM + "<b> POS: </b>" + results[i].POS + " <b>REF:</b> " + results[i].REF + " <b>ALT:</b> " + results[i].ALT +" <b>FILTER:</b> " + results[i].FILTER  + " <b>FORMAT:</b> " +  results[i].FORMAT +" <b>A_2780: </b>;"+results[i].A_2780+" <b>A_8PTX: </b>;" +results[i].A_8PTX+" <b>A_16PTX: </b>;" +results[i].A_16PTX;

            Wynik += `<li>${pojdokument}</li><br>`;
        }
      }
        if(results.length==0){
          Wynik += `<li class="alert alert-danger">Nie znaleziono zadnych dokumentow spelniajacych wymogi</li><br>`;
        }
        Wynik += "</ul>";
        Wynik+=`
   </div>
    

 </form>

 <footer class="footer">
      <div class="align-baseline">
      <h3 class="text-sm-left">Praca licencjacka: Aplikacja do przetwarzania wariantów strukturalnych przy użyciu bazy danych</h3> <br><br>
      <h4 class="text-sm-left">Kamil Rettig 141168 </h4>
    </div>
    </footer>
  </body>
</html> `  

        res.send(Wynik);
    })
    .catch(error => console.error(error))
    return;
  };

});

 

  });
app.listen(4000, function() {});