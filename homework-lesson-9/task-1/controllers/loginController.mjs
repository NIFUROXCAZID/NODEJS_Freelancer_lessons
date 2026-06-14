class LoginController {
  static loginForm(req, res) {
    res.render('products/login')
  }

  static login(req, res) {
    const username = req.body.username

    // запис у сесію
    req.session.userName = username

    // після логіну завжди сортуємо по зростанню
    req.session.sortOrder = 'asc'

    res.redirect('/products')
  }
}

export default LoginController