const avatar = document.getElementById('avatar')

avatar.addEventListener('change', () => {
	document.getElementById('val_msg').innerHTML = 'File Attached'
})

function validatePasswords() {
	const password1 = document.getElementById('password').value
	const password2 = document.getElementById('re_password').value

	if(password1.length < 6 && password1 !== '') {
		document.getElementById('val_err').innerHTML = 'Password is too weak!'
		document.getElementById('password').style.border = '2px solid red'
		document.getElementById('re_password').style.border = '2px solid red'

		return false
	}

	if(password1.toLowerCase().includes('password')) {
		document.getElementById('val_err').innerHTML = 'Password is too weak!'
		document.getElementById('password').style.border = '2px solid red'
		document.getElementById('re_password').style.border = '2px solid red'

		return false
	}

	if (!password1.match(password2)) {
		document.getElementById('val_err').innerHTML = 'Passwords don\'t match!'
		document.getElementById('password').style.border = '2px solid red'
		document.getElementById('re_password').style.border = '2px solid red'

		return false
	}

	return true
}