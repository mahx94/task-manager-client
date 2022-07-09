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
		if (body.error) return console.log(body)
		const tasks = JSON.parse(body)
		res.render('index', {title: 'Task Manager', name, tasks})
	}).auth(null, null, true, req.cookies.authToken)
})

// TODO
app.get('filter', (req, res) => {})


app.get('/me', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')

	request.get('https://mahx-task-manager.herokuapp.com/users/me', (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) {
			const user = JSON.parse(body)
			const url = 'https://mahx-task-manager.herokuapp.com/users/' + user._id + '/avatar'

			request.get(url, (err, response, avatar) => {
				if (response.statusCode === 200) res.render('profile', {title: 'My Profile', name, user, avatar})
				else return res.render('profile', {title: 'My Profile', name, user})
			}).auth(null, null, true, req.cookies.authToken)

		} else console.log(body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.post('/me/update', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')
	
	const body = {}
	const allowedUpdates = ['name', 'email', 'password', 'age']
	allowedUpdates.forEach((update) => { if (req.body[update]) body[update] = req.body[update] })

	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/users/me',
		json: true,
		body
	}

	request.patch(options, (err, response) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) res.status(203).redirect('/')
		else console.log(response.body)
	}).auth(null, null, true, req.cookies.authToken)
})


app.post('/me/delete', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')

	request.delete('https://mahx-task-manager.herokuapp.com/users/me', (err, response, body) => {
		if (err) console.log(err)
		else if (response.statusCode === 200) {
			const user = JSON.parse(body)
			res.clearCookie('authToken')
			return res.render('goodbye', { title: 'Goodbye', name, user })
			//return res.redirect('/')
		} else console.log(response.body)
		res.redirect('/me', response.statusCode)
	}).auth(null, null, true, req.cookies.authToken)
})

// TODO 
app.post('/me/avatar', (req, res) => {})


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
		} else res.status(400).redirect('/')
	})
})

app.post('/signup', (req, res) => {
	var name = req.body.email.replace(/@.*/g, '')
	name = name.replace(/[._]/g, ' ')
	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/users',
		json: true,
		body: {
			name,
			email: req.body.email,
			password: req.body.password
		}
	}

	request.post(options, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 201) {
			res.cookie('authToken', body.token)
			res.redirect('/')
		} else console.log(body)
	})
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

// TODO
app.post('logout/all', (req, res) => {})


app.post('/task/create', (req, res) => {
	if (!req.cookies.authToken) return res.redirect(403, '/')
	
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
	if (!req.cookies.authToken) return res.redirect(403, '/')
	request.get('https://mahx-task-manager.herokuapp.com/tasks/' + req.params.id, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) {
			const task = JSON.parse(body)
			res.render('edit_task', {title: 'Edit Task', name, task})
		} else console.log(body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.post('/task/:id', (req, res) =>{
	if (!req.cookies.authToken) return res.redirect(403, '/')

	const options = {
		url: 'https://mahx-task-manager.herokuapp.com/tasks/' + req.params.id,
		json: true,
		body: {
			name: req.body.name,
			description: req.body.description,
			compleated: req.body.compleated
		}
	}

	request.patch(options, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) res.redirect('/')
		else console.log(body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.post('/delete/:id', (req, res) =>{
	if (!req.cookies.authToken) return res.redirect(403, '/')

	const url = 'https://mahx-task-manager.herokuapp.com/tasks/' + req.params.id

	request.delete(url, (err, response, body) => {
		if (err) return console.log(err)
		else if (response.statusCode === 200) res.redirect('/')
		else console.log(body)
	}).auth(null, null, true, req.cookies.authToken)
})

app.get('*', (req, res) => {
	if (!req.cookies.authToken) return res.render('404', {title: "404", name})
	res.render('404', {title: "404", name, authenticated: true})
})


app.listen(port, () => {
	console.log('Server is up on port ' + port)
})