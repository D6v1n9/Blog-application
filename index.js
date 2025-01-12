import express from "express"

const app = express();
const port = 3000 ;

app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.get("/compose", (req,res) => {
    res.render("compose.ejs")
})

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
})
