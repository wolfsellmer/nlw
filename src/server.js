const express = require("express")
const server = express()

const db = require("./database/db")


server.use(express.static("public"))

server.use(express.urlencoded({extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})
server.get("/", (req, res)=>{
    return res.render("index.html", {title: "titulo"})
})
server.get("/create-point", (req, res)=>{
    //console.log (req.query)


    return res.render("create-point.html")
})
server.post("/savepoint", (req, res)=>{

    //console.log(req.body)
        const query =`
        INSERT INTO places2 (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) values(?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
    function afterInsertData(err){
        if(err){
            return console.log(err)
            return res.send("Erro no Cadastro")
        }
        console.log("Cadastrado con sucesso")
        console.log(this)
        return res.render("create-point.html", {saved:true})
    }
    db.run(query, values, afterInsertData)


    

})
server.get("/search", (req, res)=>{

        const search = req.query.search
        if(search == ""){
            return res.render("search-results.html", { total: 0})
        }


    
    db.all(`SELECT * FROM places2 WHERE city LIKE '%${search}%'`, function(err, rows){
                if(err){
                    return console.log(err)
                }
                const total = rows.length
                // console.log("Aqui estão seus registros: ")  
                // console.log(rows)  
                return res.render("search-results.html", {places2: rows, total: total})
            })
    
})


server.listen(3000)