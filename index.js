import express from "express"
import bodyParser from "body-parser";
import multer from "multer";
import _ from "lodash";

const app = express();
const port = 3000 ;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
})
  
const upload = multer({ storage })


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [] ;


app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.get("/compose", (req,res) => {
    res.render("compose.ejs");
})

app.get("/views", (req,res) => {
    res.render("views.ejs", 
    {
        posts:posts
    });
})

app.get("/ideas", (req,res) => {
    res.render("ideas.ejs");
})
app.get("/learning", (req,res) => {
    res.render("learning.ejs");
})


app.get("/posts/:postName", (req, res) => {
    //Making the view funcitonality work by searching the post present or not 
    const requestedTitle = _.lowerCase(req.params.postName);
    const post = posts.find((post) => _.lowerCase(post.title) === requestedTitle);
    
    //if present then perform the xyz... task 
    if (post) {
        res.render("posts.ejs", {
            post:post,
            title:post.title,
            content:post.content
        });
    } else {
        res.render("pageNotFound.ejs"); // Render pageNotFound only if no match is found
    }
});

app.get("/posts/edit/:postName", (req,res) => {
    const post = posts.find((post) => _.lowerCase(post.title) === _.lowerCase(req.params.postName));
    res.render("editBlog.ejs", {
        title:post.title,
        content:post.content
    })
});

app.get("/edit/:postName", (req,res) => {
    const post = posts.find((post) => _.lowerCase(post.title) === _.lowerCase(req.params.postName));
    if(post) {
        res.render("editBlog.ejs", {
            title:post.title,
            content:post.content
        })
    }
});

app.post("/posts/edit/:postName",upload.single('file') ,(req,res) => {
    const titleName = req.params.postName;
    const editBlog = posts.find((post) => _.lowerCase(post.title) === _.lowerCase(req.params.postName));
    
    const updateTitle = req.body.title;
    const updateContent = req.body.content;

    if(editBlog) {
        res.render("posts.ejs", {
            title:updateTitle,
            content:updateContent
        })
    } 
    
    res.render("views.ejs")
    
})




app.post("/compose",upload.single('file'), (req,res) => {
    const post = {
        title: req.body.title,
        content: req.body.content,
        file: req.file.filename
    };

    posts.push(post);

    // console.log(req.file);
    // console.log(req.body);
    //  res.redirect("views.ejs");
    // console.log(posts);
    res.redirect("/views");
})


app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
})
