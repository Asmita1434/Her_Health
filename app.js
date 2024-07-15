const express = require("express");
const app= express();
const path= require("path");
const mongoose = require("mongoose");
const Disease= require("./models/disease.js");
const News= require("./models/news.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");


main()
.then((res) => {
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/herHealth');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


app.get("/", (req,res) => {
    let sampleNews= new News (    {
        title: "If you’re pregnant, how accurate is your ‘due date’?",
        description: "More than 1,700 pregnant women in South Australia have reportedly been given the wrong “due date” due to a technical error in their computerised medical records. This has prompted concerns some women may have had an early induction of labour as a result.",
        publisDate: new Date(),
        image:"https://media.istockphoto.com/id/1835179103/photo/pregnant-woman-holds-hands-on-her-belly-pregnancy-maternity-preparation-and-expectation.jpg?s=2048x2048&w=is&k=20&c=w6yuyQjQcanGpqybdpcGPDca6Z3UZZ86oMUkT8uuboE=",
        tags:"#pregnancy #women #health",
        source:"https://theconversation.com/if-youre-pregnant-how-accurate-is-your-due-date-233547",
    });
    sampleNews.save().then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
});

//all Disesases list route

app.get("/diseases/:cat", async (req,res) => {
    const cat = req.params.cat;
    const catList= await Disease.find({category: cat});
    res.render("./diseases/allDis.ejs", {catList, cat});
 });
 

//Show ROUTE
app.get("/diseases/:id/show",async (req,res) => {
    let{id} = req.params;
    const dis = await Disease.findById(id);
    res.render("./diseases/show2.ejs", {dis});
});

// HOME ROUTE

app.get("/home", (req,res) => {
    res.render("./diseases/index.ejs");
});

// NEWS&ALERT ROUTE

app.get("/news&alert", async (req,res) => {
    const allNews= await News.find({});

    res.render("./navbaritems/news.ejs", {allNews});
});



//SEARCH ROUTE

app.get("/search", async (req,res) => {
    
    let data= await Disease.find(
        {
            "$or": [
                {name: {"$regex": req.query.searchterm}}
            ]
        }
    );

    
    res.render("./diseases/show.ejs", {data});
});

//ABOUT PAGE

app.get("/about", (req,res) => {
    res.render("./navbaritems/about.ejs");
});

//CAREGUIDE PAGE

app.get("/careguide", (req,res) => {
    res.render("./navbaritems/careguide.ejs");
});

//Query page

app.get("/query", (req,res) => {
    res.render("./includes/query.ejs");
});

//Contact page

app.get("/contact", (req,res) => {
    res.render("./includes/contact.ejs");
});


app.listen(8080, () => {
    console.log("server is listening to port 8080.");
});