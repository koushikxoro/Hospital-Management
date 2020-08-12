const express=require('express')
const path=require('path')
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
const assert=require('assert')
const app=express()
var http=require('http').Server(app)
var io=require('socket.io')(http)
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname)) 
app.set("view engine", "ejs") 

app.use(bodyParser.urlencoded({extended:true}))
const dburl="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const dbname="newdb"
const client=new MongoClient(dburl,{useUnifiedTopology:true})
var db
client.connect((err)=>{
    assert.equal(err,null)
    console.log("Data base connected")
    db=client.db('newdb')
    //client.close()
})
app.get("/",(req,res)=>{
    res.render("index",{})
})
app.get("/Update_patient",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:""
    }
    res.render("Update_patient",{result:result})
})
app.get("/patientsregistration",(req,res)=>{
    res.render("hms_registration",{})
})
app.get("/Deletepatients",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:""
    }
    res.render("delete_patient",{result:result})
})
app.get("/viewpatients",(req,res)=>{
    db.collection("hospital").find({}).toArray((err,result)=>{
        assert.equal(err,null)
        res.render("view_all_patient",{result:result})
    })
    
})
app.get("/searchpatients",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:""
    }
    res.render("SearchPatient",{result:result})
})
app.get("/patientsbilling",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:"",
        medissued:[],
        test:[]
    }
    res.render("finalbill",{result:result})
})
app.get("/Issuemedicine",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:"",
        medissued:[],
        test:[]
    }
    res.render("issuemedicine",{result:result})
})
app.get("/diagonstic",(req,res)=>{
    result={
        pid:"",
        pname:"",
        p_age:"",
        date:"",
        bed:"",
        address:"",
        state:"",
        city:"",
        test:[]
    }
    res.render("dianostics",{result:result})
})
app.post('/login',(req,res)=>{
    
    if((req.body.uname=="Koushik") && (req.body.psw=="12345"))
    {
     res.render("hms_registration",{})  
    }
    else{
    res.render("index",{})
    }
})

app.post('/register',(req,res)=>{
    db.collection('hospital').insertOne(req.body,(err,result)=>{
        assert.equal(err,null)
        assert.equal(result.result.n,1)
        assert.equal(result.ops.length,1)
        console.log("inserted patient doc successfully")
    })
    db.collection('hospital').updateOne({"pid":req.body.pid},{$set:{medissued:[]}})
    db.collection('hospital').updateOne({"pid":req.body.pid},{$set:{test:[]}})
    res.render("hms_registration",{})
})
var pid
app.post("/pid",(req,res)=>{
    pid=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        console.log(result)
        res.render("Update_patient",{result:result})
    })
})
app.post("/update",(req,res)=>{
    db.collection('hospital').updateOne({"pid":pid},{$set:{"pname":req.body.pname,"p_age":req.body.page,"date":req.body.dateofadd,"bed":req.body.beds,"address":req.body.Address,"state":req.body.state,"city":req.body.city}},(err,result)=>{
        assert.equal(err,null)
        console.log("Updated")
        db.collection('hospital').findOne({"pid":pid},(err,result)=>{
            assert.equal(err,null)
            //console.log(result)
            res.render("Update_patient",{result:result})
        })
    })
})
var piddel
app.post("/piddel",(req,res)=>{
    piddel=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        console.log(result)
        res.render("delete_patient",{result:result})
    })
})
app.post("/delete",(req,res)=>{
    db.collection('hospital').deleteOne({"pid":piddel},(err,result)=>{
        assert.equal(err,null)
        
    })
    var res1={
        pid:"",
    pname:"",
    p_age:"",
    date:"",
    bed:"",
    address:"",
    state:"",
    city:""
    }
    res.render("delete_patient",{result:res1})
})
app.post("/psearch",(req,res)=>{
    //piddel=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        //console.log(result)
        res.render("SearchPatient",{result:result})
    })
})
var us1
app.post("/phar",(req,res)=>{
    console.log("inside phar")
    //piddel=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        //console.log(result.medissued.length)
        us1=result
        res.render("issuemedicine",{result:result})
    })
})
app.post("/newmed",(req,res)=>{
    //console.log(req.body)
    var arr=[]
    if(typeof(req.body.Medicine)=='string')
    {
        var obj={"med":req.body.Medicine,"qty":req.body.Quantity,"rt":req.body.Rate,"at":req.body.Amount}
        arr.push(obj)
    }
    else{
    for(i=0;i<req.body.Medicine.length;i++)
    {
        var obj={"med":req.body.Medicine[i],"qty":req.body.Quantity[i],"rt":req.body.Rate[i],"at":req.body.Amount[i]}
        arr.push(obj)
    }}
    console.log(arr)
    db.collection('hospital').updateOne({"pid":us1.pid},{$push:{"medissued":{$each:arr}}},(err,result)=>{
        assert.equal(err,null)
        console.log("upadted")
    })
    res.render("issuemedicine",{result:us1})
})
var us2
app.post("/diag",(req,res)=>{
    console.log("inside diag")
    //piddel=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        //console.log(result.medissued.length)
        us2=result
        res.render("dianostics",{result:result})
    })
})
app.post("/newtest",(req,res)=>{
    //console.log(req.body)
    var arr=[]
    if(typeof(req.body.tname)=='string')
    {
        var obj={"tname":req.body.tname,"cost":req.body.cost}
        arr.push(obj)
    }
    else{
    for(i=0;i<req.body.tname.length;i++)
    {
        var obj={"tname":req.body.tname[i],"cost":req.body.cost[i]}
        arr.push(obj)
    }}
    console.log(arr)
    db.collection('hospital').updateOne({"pid":us2.pid},{$push:{"test":{$each:arr}}},(err,result)=>{
        assert.equal(err,null)
        console.log("upadted")
    })

    res.render("dianostics",{result:us2})
})
app.post("/final",(req,res)=>{
    console.log("inside diag")
    //piddel=(req.body.pid)
    db.collection('hospital').findOne({"pid":req.body.pid},(err,result)=>{
        assert.equal(err,null)
        //console.log(result.medissued.length)
        //us2=result
        res.render("finalbill",{result:result})
    })
})
io.on('connection',(socket)=>{
    console.log("user connected")
})
const s=http.listen(8080,()=>{
    console.log("app running")
})
