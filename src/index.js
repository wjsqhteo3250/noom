import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => {
    res.render("home");
})
app.get("/*", (_, res) => {
    res.redirect("/");
})

app.listen(4000, () => { console.log("listening on port 4000") });
