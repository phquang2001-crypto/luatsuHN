const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Middleware bảo vệ admin
app.use("/admin.html", (req, res, next) => {
    const auth = { user: "admin", pass: "1324" };

    const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
    const [user, pass] = Buffer.from(b64auth, "base64").toString().split(":");

    if (user === auth.user && pass === auth.pass) {
        return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    res.status(401).send("Yêu cầu đăng nhập!");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});


app.get("/admin.html", (req, res) => {
    res.status(403).send("Forbidden");
});




app.use(express.static("public"));

const FILE = "./data/bookings.json";

// API lấy danh sách khách
app.get("/api/bookings", (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE));
    res.json(data);
});

// API thêm khách
app.post("/api/book", (req, res) => {
    const bookings = JSON.parse(fs.readFileSync(FILE));

    const newBooking = {
        id: Date.now(),
        ...req.body,
        status: "Mới",
        time: new Date()
    };

    bookings.push(newBooking);
    fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2));

    res.json({ message: "Đặt lịch thành công!" });
});

// API xoá
app.delete("/api/book/:id", (req, res) => {
    let bookings = JSON.parse(fs.readFileSync(FILE));
    bookings = bookings.filter(b => b.id != req.params.id);
    fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2));
    res.json({ message: "Đã xoá" });
});

// API cập nhật trạng thái
app.put("/api/book/:id", (req, res) => {
    let bookings = JSON.parse(fs.readFileSync(FILE));

    bookings = bookings.map(b => {
        if (b.id == req.params.id) {
            return { ...b, status: req.body.status };
        }
        return b;
    });

    fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2));
    res.json({ message: "Đã cập nhật" });
});

app.listen(PORT, () => {
    console.log("Server chạy tại http://localhost:" + PORT);
});
