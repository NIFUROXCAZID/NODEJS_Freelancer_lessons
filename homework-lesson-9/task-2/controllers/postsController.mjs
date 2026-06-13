import PostsDBService from '../models/post/PostsDBService.mjs'
import UsersDBService from '../models/user/UsersDBService.mjs'
import { buildPostFilter } from '../utils/postFilter.mjs'

class PostsController {
  static async getList(req, res) {
    try {

      const filters = buildPostFilter(req.query)

      const users = await UsersDBService.getList({})
      const posts = await PostsDBService.getList(filters)
      res.render('posts/list', {
        posts,
        users,
        query: req.query,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id
      let post = null
      if (id) {
        post = await PostsDBService.getById(id)
      }
      const users = await UsersDBService.getList({})
      const types = []
      res.render('posts/form', {
        formTitle: id ? 'Редагувати пост' : 'Створити пост',
        formAction: '/posts/register' + (id ? `/${id}` : ''),
        post,
        users,
        types,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  static async register(req, res) {
    const users = await UsersDBService.getList({})
    const types = []
    const data = req.body
    if (req.validationErrors) {
      if (req.params.id) data.id = req.params.id
      return res.status(400).render('posts/form', {
        formTitle: req.params.id ? 'Редагувати пост' : 'Створити пост',
        formAction:
          '/posts/register' + (req.params.id ? `/${req.params.id}` : ''),
        post: data,
        users,
        types,
        errors: req.validationErrors,
      })
    }
    try {
      const dataObj = data
      if (req.params.id) {
        await PostsDBService.update(req.params.id, dataObj)
      } else {
        await PostsDBService.create(dataObj)
      }
      res.redirect('/posts')
    } catch (err) {
      res.status(500).render('posts/form', {
        formTitle: req.params.id ? 'Редагувати пост' : 'Створити пост',
        formAction:
          '/posts/register' + (req.params.id ? `/${req.params.id}` : ''),
        post: data,
        users,
        types,
        errors: [{ msg: err.message }],
      })
    }
  }

  static async delete(req, res) {
    try {
      await PostsDBService.deleteById(req.body.id)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete post' })
    }
  }
  //---- comments----------
  // Метод для створення коментаря
  static async createComment(req, res) {
    try {
      const post = await PostsDBService.getById(req.params.postId)
      if (!post) {
        throw new Error('Post not found')
      }
      const { commenter, commentText } = req.body
      const newComment = { commenter, commentText }
      post.comments.push(newComment)
      await post.save()

      res.redirect('/posts')
    } catch (error) {
      throw new Error('Error creating comment: ' + error.message)
    }
  }
  // Метод для видалення коментаря
  static async deleteComment(req, res) {
    try {
      const post = await PostsDBService.getById(req.params.postId)
      if (!post) {
        throw new Error('Post not found')
      }
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== req.body.id,
      )
      await post.save()

      res.redirect('/posts')
    } catch (error) {
      throw new Error('Error deleting comment: ' + error.message)
    }
  }
}

export default PostsController
