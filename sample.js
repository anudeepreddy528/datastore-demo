var express= require('express');
var app=express();
var DataStore=require('@google-cloud/datastore');
var bodyParser = require('body-parser')
var config=require('./config');
app.use(bodyParser.urlencoded({ extended: false }))
const kind='customers';
// parse application/json
app.use(bodyParser.json())

//datastore client
const datastore= new DataStore({
projectId:config.projectId,
keyFile:config.keyFile
});

//welcome response
app.get('/',(req,res)=>{
    res.send('welcome to Application. Use /getCustomers endpoint for find');
})

//To fetch data from datastore
app.get('/getCustomers',(req,res)=>{
  //If no input is send all results will be shown
    var query=datastore.createQuery(kind);

    datastore.runQuery(query,(err,data)=>{
    if(err)
        res.json("Error is:"+err);

    if(Object.keys(data).length==0)//If data is empty in datastore
        res.status(200).json('No data is available');
    else
        res.status(200).send(data);//all data will be displayed
})
});

app.get('/getCustomer',(req,res)=>{
    var id=JSON.parse(req.query.id);

    let query = datastore.createQuery(kind).filter('custId','=',id);//filtering based on id
    datastore.runQuery(query,(err,data)=>{
        
    if(err)
        res.json("Error is:"+err);

    if(Object.keys(data).length==0) //checking for empty data
         res.status(200).json('Invalid id please try with valid one');
    else
         res.status(200).send(data);//data with custid is fetched and displayed 
        })   
})

app.post('/postCustomer',(req,res)=>{
    var keykind=datastore.key([kind,(req.body.custId).toString()]);
    var entity={
        key:keykind,
        data:req.body
    }
    datastore.save(entity,()=>{
        res.status(200).json('Data successfully added');
    })
})
app.put('/updateCustomer',(req,res)=>{
    var query=datastore.createQuery([kind]).filter('custId','=',req.body.custId);
    datastore.runQuery(query,(err,entity)=>{
        if(!err)
        var key=entity[0][DataStore.KEY];
        var keykind=datastore.key([kind,parseInt(key.id)]);
        entity[0].phone=(req.body.phone);
        console.log(entity);
        datastore.save({
            key:keykind,
            data:entity[0]
            },(err,data)=>{
            if(err){
                res.json(err);
            }
            else{
            res.json(data+'updated');
            console.log("updated");
            }
        });
});
})

app.delete('/deleteCustomer',(req,res)=>{
    var query=datastore.createQuery([kind]).filter('custId','=',req.body.custId);
    datastore.runQuery(query,(err,entity)=>{
        if(!err)
        key=entity[0][DataStore.KEY];
        datastore.delete(key,(err)=>{
        if(!err)
         res.send('successfully deleted');    
    })
    })

})

const PORT=process.env.PORT || 3001;
app.listen(PORT,(req,res)=>{//default listening on port 3000 or set an environment variable
    console.log(`app started at port ${PORT}`);
})