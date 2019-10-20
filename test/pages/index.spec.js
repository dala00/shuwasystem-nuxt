import { mount, RouterLinkStub } from '@vue/test-utils'
import flushPromises from 'flush-promises'

let mockPostsRefOrderBy

jest.mock('firebase', () => ({
  firestore() {
    return {
      collection(collectionName) {
        if (collectionName === 'posts') {
          return {
            orderBy: () => mockPostsRefOrderBy
          }
        }
      }
    }
  }
}))

import IndexPage from '@/pages/index.vue'

describe('IndexPage', () => {
  test('is a Vue instance', async () => {
    const post = {
      title: 'title',
      body: 'body',
      createdAt: {
        toDate() {
          return new Date()
        }
      }
    }

    const doc = {
      id: 1,
      data() {
        return post
      }
    }

    mockPostsRefOrderBy = {
      async get() {
        return {
          empty: false,
          forEach: callback => callback(doc)
        }
      }
    }
    const wrapper = mount(IndexPage, {
      stubs: { 'n-link': RouterLinkStub }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
    await flushPromises()
    expect(wrapper.find('h2.subtitle').text()).toBe(post.title)
  })
})
