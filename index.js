const express = require("express")
const app = express()
const sqlite3 = require("sqlite3")

const db = new sqlite3.Database(":memory:")

db.serialize(() => {
    db.run( `CREATE TABLE tiere (
    id INTEGER PRIMARY KEY,
    tierart VARCHAR(50),
    name VARCHAR(50),
    krankheit VARCHAR(100),
    age INT,
    gewicht REAL);`)
    db.run(`INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Hund","Bello","husten",5,12.4)`)

    selectAllTiereQuery = `SELECT * FROM tiere`
    db.all(selectAllTiereQuery, (err,rows) => {
        if(err){
            console.log(err)
        }else {
            console.log(rows)
        }
    })
    process.on("exit", () => {
        db.close()
    })
})

app.use(express.json()) // Ermöglicht Express Json aus einem Body auszulesen
app.get("/", (req,res) => {
    res.send("Die API funktioniert!")
})

app.get("/tiere", (req,res) => {
    db.all(selectAllTiereQuery, (err,rows) => {
        if(err){
            res.status(404).send("Fehler in deiner Query Anfrage")
        }else {
            res.json(rows)
        }
    })
})

app.post("/tiere", (req,res) => {
    const {tierart, name, krankheit, age, gewicht} = req.body
    db.run(`INSERT INTO tiere (tierart,name,krankheit,age,gewicht) VALUES(?,?,?,?,?)`,[tierart,name,krankheit,age,gewicht], function(err) {
        if (err) {
            return console.error(err.message);
            res.status(500).send("Fehler beim Hinzufügen des Tiers");
        }
        res.status(201).send(`Tier mit der ID ${this.lastID} wurde erfolgreich hinzugefügt`);
    });
})

// 1. GET /tiere/:id
app.get("/tiere/:id", (req, res) => {
    const id = req.params.id;
    const selectTierByIdQuery = `SELECT * FROM tiere WHERE id = ?`;
    db.get(selectTierByIdQuery, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Fehler beim Abrufen des Tiers.");
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
        }
    });
});

// 2. PUT /tiere/:id
app.put("/tiere/:id", (req, res) => {
    const id = req.params.id;
    const { tierart, name, krankheit, age, gewicht } = req.body;
    const updateTierQuery = `UPDATE tiere SET tierart = ?, name = ?, krankheit = ?, age = ?, gewicht = ? WHERE id = ?`;
    db.run(updateTierQuery, [tierart, name, krankheit, age, gewicht, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Fehler beim Aktualisieren des Tiers.");
            return;
        }
        if (this.changes > 0) {
            res.status(200).send(`Tier mit der ID ${id} wurde erfolgreich aktualisiert.`);
        } else {
            res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
        }
    });
});

// 3. DELETE /tiere/:id
app.delete("/tiere/:id", (req, res) => {
    const id = req.params.id;
    const deleteTierQuery = `DELETE FROM tiere WHERE id = ?`;
    db.run(deleteTierQuery, [id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Fehler beim Löschen des Tiers.");
            return;
        }
        if (this.changes > 0) {
            res.status(200).send(`Tier mit der ID ${id} wurde erfolgreich gelöscht.`);
        } else {
            res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
        }
    });
});

app.listen(3000)