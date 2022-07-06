const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const request = require('postman-request')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')

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
	
	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/tasks',
	}
	request.get(options, (err, response, body) => {
		console.log(req.cookies.authToken)
		console.log('E:', err)
		console.log('B:', body)
		console.log('T:', body.tasks)
		const tasks = body
		res.render('index', {title: 'Task Manager', name, tasks})
	}).auth(null, null, null, req.cookies.authToken)
})

app.post('/login', async (req, res) => {
	console.log('Email:', req.body.email)
	console.log('Pass:', req.body.password)
	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/users/login',
		json: true,
		body: {
			email: 'andre.hadnagy@example.mail',
			password: 'IdiotSandwich'
		}
	}

	request.post(options, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) {
			res.cookie('authToken', body.token)
			res.cookie('user', body.user)
			res.redirect('/')
		} else console.log(body)
	})
})

app.post('/signup', (req, res) => {
	console.dir('/signup was called')
	res.redirect('/')
})

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})