import Post from './Post.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class PostsDBService extends MongooseCRUDManager {
  async getList(filters) {
    try {
      const res = await super.getList(filters, { password: 0 }, [
        'authors',
        {
          fieldForPopulation: 'comments.commenter',
          requiredFieldsFromTargetObject: 'name',
        },
      ])

      return res
    } catch (error) {
      return []
    }
  }
}

export default new PostsDBService(Post)
