<template>
  <div style="background-color: #202424" class="home h-full w-full text-white">
    <div class="bg-black">
        <div class="flex py-5 px-5">
            <img class="rounded-full h-10 w-10" :src="jb" />
            <p class="px-3 flex items-center justify-center">Post To your friends...</p>
        </div>
    </div>
    <div class="h-screen flex items-center justify-center">
        <p class="text-center text-xl">No Recent Activity</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedView',
  components: {
  },
  data(){
        return {
            jb: require('../assets/JB.png'),
            
        };
  },
}
</script>

<style>
  .home{
    background-color: #202424; 
  }
</style>
