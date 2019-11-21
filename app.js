//REQUIRED

var express            =        require("express"),
	bodyParser         =        require("body-parser"),
	mongoose           =        require("mongoose"),
	expressSantizer    =        require("express-sanitizer"),
	methodOverride     =        require("method-override");

var app = express();

//app config

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSantizer());

//SERVER
app.listen(process.env.PORT || 3000,()=>{
	console.log("Server Running");
})

//databaase
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true,useUnifiedTopology: true});

var personSchema = new mongoose.Schema({
	name:String,
	age:String,
	gender:String,
	mobile_number:String
});

var Person = mongoose.model("Persons",personSchema);


//routes

//index route
app.get("/",(req,res)=>{
	res.render("index");
});

//GET /person
app.get("/person",(req,res)=>{
	Person.find({},(err,person)=>{
		if(err){
			console.log(err);
		}else{
			res.render("show",{person:person});
		}
	});
});

//new person form
app.get("/person/new",(req,res)=>{
	res.render("newpersonform");
})

// POST /person
app.post("/person", (req,res)=>{
	var name = req.body.name;
	var age =req.body.age;
	var gender = req.body.gender;
	var mobile_number = req.body.mobile_number;
	var p_ele = {name:name,age:age,gender:gender,mobile_number:mobile_number};
	Person.create(p_ele,(err,newlyCreated)=>{
		if(err){
			console.log(err);
		}else{
			res.redirect("/person");
		}
	});
	
});



//PUT  /person/{:id} 
app.get("/person/:id",(req,res)=>{
	Person.findById(req.params.id,(err,fperson)=>{
		if(err){
			res.redirect("/person");
		}else{
			res.render("edit",{person:fperson});
		}
	});
});

    //updating
app.post("/person/:id",(req,res)=>{
	 Person.findByIdAndUpdate(req.params.id,req.body.person,(err,uperson)=>{
	 	if(err){
	 		res.redirect("/person");
	 	}else{
	 		res.redirect("/person");
	 	}
	});
});

// //delete /person/{id}
 
app.get("/delete/person",(req,res)=>{
	Person.find({},(err,person)=>{
		if(err){
			console.log(err);
		}else{
			res.render("deleteform",{person:person});
		}
	});
});
 
app.post("/person/delete/:id",(req,res)=>{
	 Person.findByIdAndRemove(req.params.id,(err,dperson)=>{
		 if(err){ 
			 console.log(err)
		 }else{
			 res.redirect("/person");
		 }
	 }); 
});


