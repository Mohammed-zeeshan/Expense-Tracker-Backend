const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
dotenv.config();

const signup = require('./routes/signup');
const expense = require('./routes/expense');
const purchase = require('./routes/purchase');
const premiumFeature = require('./routes/premiumFeature');
const password = require('./routes/forgotpassword');
const sequelize = require("./util/database");
const SignUp = require('./models/signup');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Download = require('./models/download');
const Forgotpassword = require('./models/forgotPassword');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());

app.use(signup);

app.use(expense);

app.use(purchase);

app.use(premiumFeature);

app.use(password);

app.use(helmet());

app.use(morgan('combined', {stream: accessLogStream}));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

sequelize.authenticate().then(() => {
    console.log("CONNECTION DONE");
}).catch((err) => {
    console.log(err);
});

SignUp.hasMany(Expense);
Expense.belongsTo(SignUp);

SignUp.hasMany(Order);
Order.belongsTo(SignUp);

SignUp.hasMany(Download);
Download.belongsTo(SignUp);

SignUp.hasMany(Forgotpassword);
Forgotpassword.belongsTo(SignUp);

sequelize.sync()
.then(() => {
    console.log('CREATE TABLE');
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});
