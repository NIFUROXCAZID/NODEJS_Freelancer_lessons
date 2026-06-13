import UsersDBService from '../models/user/UsersDBService.mjs'
import TypesDBService from '../models/type/TypesDBService.mjs'
import FilesManager from '../utils/FilesManager.mjs'
import fs from 'fs'
import { buildUserFilter } from '../utils/userFilter.mjs'

class UserController {
  static async usersList(req, res) {
    try {
      console.log('Users --- req.query')
      console.log(req.query)

      const filters = buildUserFilter(req.query)

      console.log('----- filters')
      console.log(filters)

      const users = await UsersDBService.getList(filters)
      console.log(users)

      const types = await TypesDBService.getList({})
      res.render('users/list', { users, query: req.query, types })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id
      let user = null
      if (id) {
        user = await UsersDBService.getById(id)
      }
      const types = await TypesDBService.getList({})

      res.render('users/form', {
        formTitle: id ? 'Редагувати користувача' : 'Створити користувача',
        formAction: '/users/register' + (id ? `/${id}` : ''),
        user,
        types,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  static async registerUser(req, res) {
    const data = req.body
    if (req.validationErrors) {
      if (req.params.id) data.id = req.params.id
      const types = await TypesDBService.getList({})
      console.log('----types')
      console.log(types)
      console.log(req.validationErrors)

      return res.status(400).render('users/form', {
        formTitle: req.params.id
          ? 'Редагувати користувача'
          : 'Створити користувача',
        formAction:
          '/users/register' + (req.params.id ? `/${req.params.id}` : ''),
        user: data,
        errors: req.validationErrors,
        types,
      })
    }
    try {
      const { email, age, password, name, type } = req.body
      const dataObj = { email, age, password, name, type }
      if (req.file?.filename) {
        if (req.params.id) {
          const user = await UsersDBService.getById(req.params.id)
          FilesManager.removeImg(user.img, req.__dirname, 'uploads')
        }
        dataObj.img = req.file.filename
      }
      if (req.params.id) {
        await UsersDBService.update(req.params.id, dataObj)
      } else {
        await UsersDBService.create(dataObj)
      }
      res.redirect('/users')
    } catch (err) {
      if (req.file?.path) fs.unlinkSync(req.file.path)
      const types = await TypesDBService.getList({})
      res.status(500).render('users/form', {
        formTitle: req.params.id
          ? 'Редагувати користувача'
          : 'Створити користувача',
        formAction:
          '/users/register' + (req.params.id ? `/${req.params.id}` : ''),
        user: data,
        errors: [{ msg: err.message }],
        types,
      })
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await UsersDBService.getById(req.body.id)
      if (user.img) FilesManager.removeImg(user.img, req.__dirname, 'uploads')

      await UsersDBService.deleteById(req.body.id)

      res.json({ success: true })
    } catch (error) {
      дщ
      res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
  }
}

export default UserController
