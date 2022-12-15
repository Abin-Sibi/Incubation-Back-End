let createError = require("http-errors");
const express = require('express')
const cors = require('cors')
const app = express();
let path = require('path');
let logger = require("morgan")
const mongoose = require('mongoose')
var usersRouter = require('./Routes/users')
const cookieParser = require('cookie-parser')
const adminRouter = require("./routes/admin");

app.listen(3008, () => {
    console.log("server started on port 3008")
})



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST","PATCH"],
    credentials: true,

}));

app.use("/",usersRouter);
app.use("/api/user", usersRouter);
app.use("/api/admin", adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.render("errors");
  });

mongoose.connect("mongodb://localhost:27017/jwt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connection Succesfully")
}).catch((err) => {
    console.log(err.message);
})

module.exports = app;










