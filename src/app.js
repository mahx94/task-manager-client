const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const request = require('postman-request')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const { response } = require('express')

const app = express()
const port = process.env.PORT

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))
app.use(express.static(path.join(__dirname, '../public')))

//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const name = 'Mihaly-André Hadnagy'

app.get('', (req, res) => {
	if (!req.cookies.authToken) return res.render('login', {title: 'Sign In', name })

	request.get('https://mahx-task-manager.herokuapp.com/tasks', (err, response, body) => {
		if (err) return console.log(err)
		if (body.error) return console.log(body.error)
		const tasks = JSON.parse(body)
		res.render('index', {title: 'Task Manager', name, tasks})
	}).auth(null, null, true, req.cookies.authToken)
})

app.post('/login', (req, res) => {

	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/users/login',
		json: true,
		body: {
			email: req.body.email,
			password: req.body.password
		}
	}

	request.post(options, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) {
			res.cookie('authToken', body.token)
			res.redirect('/')
		} else console.log(body)
	})
})

app.post('/signup', (req, res) => {
	// TODO: Create actual signup router
	console.log('Email:', req.body.email)
	console.log('Pass:', req.body.password)
	res.redirect('/')
})

app.get('/logout', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')
	request.post('https://mahx-task-manager.herokuapp.com/users/logout', (err, response) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) {
			res.clearCookie('authToken')
			res.redirect('/')
		} else console.log(response.body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.post('/task/create', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')
	console.log(req.body.compleated)
	
	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/tasks',
		json: true,
		body: {
			name: req.body.name,
			description: req.body.description,
			compleated: req.body.compleated
		}
	}
	
	request.post(options, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 201) res.redirect('/')
		else console.log(body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.get('/task/:id', (req, res) => {
	// TODO: Make Get Task call and create and render Edit Task view
})


app.listen(port, () => {
	console.log('Server is up on port ' + port)
})