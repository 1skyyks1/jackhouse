<template>
  <div>
    <navMenu></navMenu>
    <el-row justify="center">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-carousel :interval="4000" indicator-position="none" class="responsive-carousel">
          <el-carousel-item v-for="homeImg in homeImgs" :key="homeImg.img_id" @click="goToPage(homeImg.redirect_url)">
            <img :src="homeImg.signedUrl" :alt="homeImg.description">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row justify="center" :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 10px">
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span style="display: flex; align-items: center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                    </svg>
                    <span style="margin-left: 5px">{{ t('home.announcement') }}</span>
                  </span>
                </div>
              </template>
              <div>
                <el-carousel height="150px" direction="vertical" :autoplay="true" :interval="4000">
                  <el-carousel-item v-for="(notice, index) in notices" :key="index" @click="goToPost(notice.post_id)">
                    <div v-loading="noticeLoading" class="notice-carousel">
                      <div class="notice-title line-clamp-1">{{ getTitle(notice) }}</div>
                      <div class="notice-content line-clamp-5" v-html="getContent(notice)"></div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 10px">
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span style="display: flex; align-items: center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <span style="margin-left: 5px">{{ t('home.forum') }}</span>
                  </span>
                </div>
              </template>
              <div v-loading="postLoading">
                <div v-for="(post, index) in posts" :key="index" class="post-item" @click="goToPost(post.post_id)">
                  <div class="post-title">{{ getTitle(post) }}</div>
                  <div class="post-info">
                    <span class="post-username">{{ t('home.by') }} {{ post.user_name }}</span>
                    <span class="post-time">{{ formatDate(post.created_time) }}</span>
                  </div>
                  <el-divider />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4">
        <el-card shadow="never">
          <el-row justify="center" :gutter="10" class="dashboard-stat">
            <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="24">
              <el-statistic :title="t('home.dashboard.user')" :value="userValue" />
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="24">
              <el-statistic :title="t('home.dashboard.post')" :value="postValue" />
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-countdown :format="countdownFormat" :value="fourthAnni">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    {{ t('home.dashboard.anni') }}
                  </div>
                </template>
              </el-countdown>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import navMenu from '../components/navmenu.vue'
import { ref, onBeforeMount, computed } from "vue";
import { postList, postByType, postWithContentByType } from "@/api/post"
import { homeDashboard } from "@/api/dashboard"
import { homeImg } from "@/api/homeImg";
import { useI18n } from "vue-i18n";
import { dayjs } from "element-plus";
import router from "@/router";
const { locale, t } = useI18n();

const postLoading = ref(true) // 主页论坛加载
const noticeLoading = ref(true) // 主页公告加载

const notices = ref([])
const posts = ref([])
const homeImgs = ref([])

import { useTransition } from '@vueuse/core'

const userCount = ref(0)
const postCount = ref(0)

const userValue = useTransition(userCount, {
  duration: 1500,
})
const postValue = useTransition(postCount, {
  duration: 1500,
})

const fourthAnni = ref(dayjs('2026-06-01 00:00:00').valueOf());

const countdownFormat = computed(() => {
  return `DD [${t('home.dashboard.day')}] HH:mm:ss`
})

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD');
}

const getTitle = (post) => {
  if(locale.value === 'zh'){
    return post.title_zh || post.title_en || "暂无标题 (>_<)";
  }
  else{
    return post.title_en || post.title_zh || "No title available (>_<)";
  }
}

const getContent = (post) => {
  if(locale.value === 'zh'){
    return post.content_zh || post.content_en || "暂无内容 (>_<)";
  }
  else{
    return post.content_en || post.content_zh || "No content available (>_<)";
  }
}

const getNotice = () => {
  postWithContentByType(3, 1, 3).then(response => {
    notices.value = response.data;
    noticeLoading.value = false
  })
}

const getPostList = () => {
  postList(1, 3).then(response => { //获取前三个
    posts.value = response.data;
    postLoading.value = false;
  })
}

const getHomeImg = () => {
  homeImg().then(response => {
    homeImgs.value = response.data;
  })
}

const getHomeDashboard = () => {
  homeDashboard().then(response => {
    userCount.value = response.userCount;
    postCount.value = response.postCount;
  })
}

const goToPost = (postId) => {
  router.push(`/post/${postId}`)
}

const goToPage = (page) => {
  router.push(page)
}

onBeforeMount(() => {
  getPostList();
  getNotice();
  getHomeImg();
  getHomeDashboard();
})

</script>


<style scoped>
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
:deep(.el-card__header){
  padding: 10px 20px;
}
.notice-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.notice-content {
  font-size: 14px;
}
.post-item {
  padding: 5px 0 10px;
  cursor: pointer;
}
.post-item:hover{
  transform: scale(1.01);
  transition: all 0.2s ease;
}
.post-item:last-child{
  padding: 5px 0 0;
}
.post-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}
.post-info {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
.post-username {
  margin-right: 15px;
}
:deep(.el-divider--horizontal){
  margin: 15px 0 5px;
}
.notice-content :deep(img){
  display: none;
}
.dashboard-stat {
  text-align: center;
}
.dashboard-stat .el-col {
  margin-bottom: 19px;
}
.dashboard-stat .el-col:last-child {
  margin-bottom: 0;
}
.responsive-carousel :deep(.el-carousel__container) {
  aspect-ratio: 4 / 1;
  height: auto !important;
  max-height: 220px !important;
  &:hover{
    cursor: pointer;
    transform: scale(1.01);
    transition: all 0.2s ease-in-out;
  }
}
.responsive-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.notice-carousel {
  &:hover{
    cursor: pointer;
  }
}
.line-clamp-1,
.line-clamp-5 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.line-clamp-1 {
  -webkit-line-clamp: 1;
}

.line-clamp-5 {
  -webkit-line-clamp: 5;
}
</style>