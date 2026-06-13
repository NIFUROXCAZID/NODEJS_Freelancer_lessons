import TypesDBService from '../models/type/TypesDBService.mjs'

class TypeController {
  static async getList(req, res) {
    try {
      const filters = {}
      for (const key in req.query) {
        if (req.query[key]) filters[key] = req.query[key]
      }
      const types = await TypesDBService.getList(filters)
      res.render('types/list', { types })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id
      let type = null
      if (id) {
        type = await TypesDBService.getById(id)
      }
      res.render('types/form', {
        formTitle: id ? 'Редагувати тип' : 'Створити тип',
        formAction: '/types/register' + (id ? `/${id}` : ''),
        type,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  static async register(req, res) {
    const data = req.body
    if (req.validationErrors) {
      if (req.params.id) data.id = req.params.id
      return res.status(400).render('types/form', {
        formTitle: req.params.id ? 'Редагувати тип' : 'Створити тип',
        formAction:
          '/types/register' + (req.params.id ? `/${req.params.id}` : ''),
        type: data,
        errors: req.validationErrors,
      })
    }
    try {
      const { title, description } = data
      const dataObj = { title, description }
      if (req.params.id) {
        await TypesDBService.update(req.params.id, dataObj)
      } else {
        await TypesDBService.create(dataObj)
      }
      res.redirect('/types')
    } catch (err) {
      res.status(500).render('types/form', {
        formTitle: req.params.id ? 'Редагувати тип' : 'Створити тип',
        formAction:
          '/types/register' + (req.params.id ? `/${req.params.id}` : ''),
        type: data,
        errors: [{ msg: err.message }],
      })
    }
  }

  static async delete(req, res) {
    console.log('----- req.body.id')
    console.log(req.body.id)

    try {
      await TypesDBService.deleteById(req.body.id)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
  }
}

export default TypeController
