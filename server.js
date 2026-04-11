const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// API nhận đặt lịch
app.post("/api/book", (req, res) => {
    const data = req.body;

    const bookings = JSON.parse(fs.readFileSync("./data/bookings.json"));
    bookings.push({
        ...data,
        time: new Date()
    });

    fs.writeFileSync("./data/bookings.json", JSON.stringify(bookings, null, 2));

    res.json({ message: "Đặt lịch thành công!" });
});

app.listen(PORT, () => {
    console.log("Server chạy tại http://localhost:" + PORT);
});
