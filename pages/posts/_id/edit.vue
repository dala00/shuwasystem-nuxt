<template>
  <div>
    <h1 class="title">編集する</h1>
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
        @click="updatePost"
      >更新</button>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
const db = firebase.firestore()
const postsRef = db.collection('posts')

export default {
  data() {
    return {
      post: {
        id: '',
        title: '',
        body: ''
      },
      loading: false
    }
  },

  async mounted() {
    const doc = await postsRef
      .doc(this.$route.params.id)
      .get()
      .catch(error => {
        console.log(error)
        return null
      })
    if (!doc || !doc.exists) {
      return
    }
    const post = doc.data()
    post.id = doc.id
    this.post = post
  },

  methods: {
    async updatePost() {
      this.loading = true
      const updatePost = {
        title: this.post.title,
        body: this.post.body
      }
      const ref = await postsRef
        .doc(this.$route.params.id)
        .update(updatePost)
        .catch(error => {
          console.error(error)
          return null
        })
      this.$router.push('/')
    }
  }
}
</script>

