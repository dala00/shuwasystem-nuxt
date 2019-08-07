<template>
  <div>
    <h1 class="title">Posts</h1>
    <div class="field">
      <label class="label">タイトル</label>
      <div class="control">
        <input class="input" type="text" v-model="post.title" placeholder="タイトル" />
      </div>
    </div>
    <div class="field">
      <label class="label">内容</label>
      <div class="control">
        <textarea class="textarea" v-model="post.body" placeholder="内容"></textarea>
      </div>
    </div>
    <div style="margin-bottom: 2rem">
      <button
        type="button"
        :class="{ button: true, 'is-primary': true, 'is-loading': loading }"
        @click="storePost"
      >投稿</button>
    </div>

    <div v-for="post in posts" :key="post.id" class="box">
      <div class="content">
        <h2 class="subtitle">{{ post.title }}</h2>
        <small class="has-text-grey">{{ formatDate(post.createdAt) }}</small>
        <p>{{ post.body }}</p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <n-link :to="`/posts/${post.id}/edit`" class="button level-item" aria-label="reply">編集</n-link>
        </div>
        <div class="level-left">
          <a
            class="button is-danger level-item"
            aria-label="reply"
            @click.prevent="deletePost(post.id)"
          >削除</a>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import * as moment from 'moment'
const db = firebase.firestore()
const postsRef = db.collection('posts')

export default {
  data() {
    return {
      post: {
        title: '',
        body: ''
      },
      posts: [],
      loading: false
    }
  },

  async mounted() {
    const snapshot = await postsRef.orderBy('createdAt', 'desc').get()
    if (snapshot.empty) {
      return
    }
    const posts = []
    snapshot.forEach(doc => {
      const post = doc.data()
      post.id = doc.id
      post.createdAt = post.createdAt.toDate()
      posts.push(post)
    })
    this.posts = posts
  },

  methods: {
    async storePost() {
      this.loading = true
      const newPost = { ...this.post, createdAt: new Date() }
      const ref = await postsRef.add(newPost)
      newPost.id = ref.id
      this.posts = [newPost].concat(this.posts)
      this.post.title = ''
      this.post.body = ''
      this.loading = false
    },

    formatDate(date) {
      return moment(date).format('YYYY-MM-DD h:mm')
    },

    async deletePost(id) {
      if (!confirm('削除してよろしいですか？')) {
        return
      }
      const deleteDoc = await postsRef
        .doc(id)
        .delete()
        .catch(error => {
          console.error(error)
          return null
        })
      if (deleteDoc === null) {
        return
      }
      this.posts = this.posts.filter(post => post.id !== id)
    }
  }
}
</script>
