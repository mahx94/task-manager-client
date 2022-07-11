function validatePassword() {
	const password1 = document.getElementById('password').value

	if(password1.length < 6 || password1.toLowerCase().includes('password')) {
		document.getElementById('val_err').innerHTML = 'Password is too weak!'
		document.getElementById('password').style.border = '2px solid red'

		return false
	}

	return true
}