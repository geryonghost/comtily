const express = require('express')
const app = express()
const path = require('path')
// const { render } = require('ejs')
console.log("Something")
// const session = require('express-session')
// const MongoStore = require('connect-mongo')

// Custom functions
// const logic = require('./scripts/logic')
// const { connectToDatabase, getClient, dbName } = require('./scripts/db')
// connectToDatabase()

// app.set('view engine', 'ejs')
// app.set('views', `${__dirname}/views`)
// console.log(path.join(__dirname, '/build/static'))
// app.use('/static', express.static(path.join(__dirname, '/build/static')))
// app.use(express.urlencoded({ extended: true }))

// app.use(
//     session({
//         secret: 'pnr.tjb0apx6VBK1trv',
//         resave: true,
//         saveUninitialized: false,
//         store: new MongoStore({ client: getClient(), dbName: dbName }),
//     })
// )

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// console.log(path.join(__dirname, '/build', 'index.html'))
// app.get('/', express.static(path.join(__dirname, '/build')))
    // req.session.loggedin = true
    // req.session.team = 'Mill Street'
    // if (req.session.loggedin) {
    //     const pageTitle = 'Behavio'
    //     const entries = await logic.getEntries(req.session.team)
    //     res.render('index', { pageTitle: pageTitle, entries: entries })
    // } else {
    //     const pageTitle = 'Login'
    //     res.redirect('/login')
    // }
// })

// app.get('*', (req, res) => {
//     res.send('Successful response.');
//   });

// app.get('/login', (req, res) => {
//     const pageTitle = 'Login'
//     const isLoggedOut = true
//     res.render('login', { pageTitle: pageTitle, isLoggedOut })
// })

// app.get('/logout', (req, res) => {
//     req.session.destroy()
//     res.redirect('/login')
// })

// app.get('/releases', async (req, res) => {
//     const pageTitle = 'Release Notes'

//     res.render('releases', { pageTitle: pageTitle })
// })

// app.post('/addentry', async (req, res) => {
//     query = {
//         date: req.body.date,
//         rating: req.body.rating,
//         zipcode: req.session.zipcode,
//         team: req.session.team,
//     }

//     logic.addEntry(query)
//     res.redirect('/')
// })

// app.post('/auth', async (req, res) => {
//     // let username = request.body.username;
//     let password = req.body.password
//     // // if (username && password) {
//     if (password) {
//         const client = getClient()
//         const db = client.db(dbName)

//         const users = db.collection('accounts')
//         try {
//             const filter = { team: 'Mill Street', password: password }
//             const user = await users.findOne(filter)
//             if (user != null) {
//                 req.session.loggedin = true
//                 req.session.team = user.team
//                 req.session.zipcode = user.zipcode
//                 res.redirect('/')
//             } else {
//                 const error = 'Bad login'
//                 console.error('BEH:Error', 'Bad login')
//             }
//         } catch (error) {
//             console.error('BEH:Error', error)
//         }
//     } else {
//         const error = 'Empty login'
//         console.error('BEH:Error', 'Empty Login')
//     }
// })

// //The 404 Route (ALWAYS Keep this as the last route)
// app.get('*', function (req, res) {
//     res.redirect('/')
// })

module.exports = app
