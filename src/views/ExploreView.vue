<template>
  <div style="background-color: #202424" class="h-full w-full md:h-screen text-white">
    <div class="p-3">
        <div class="pt-2 relative mx-auto text-gray-600">
          <input class="border-2 w-full border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search" name="search" placeholder="Search">
          <button type="submit" class="absolute right-0 top-0 mt-5 mr-4">
            <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
              viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"
              width="512px" height="512px">
              <path
                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
        <card-grid :content="content" type="explore" />
    </div>

  </div>
</template>

<script>
import CardGrid from '@/components/CardGrid.vue'
import jb from '../assets/JB.png'
export default {
  name: 'ExploreView',
  components: {
    CardGrid,
  },
  data(){
        return {
            content: [
                {title: 'Browse by Artist', image: jb},
                {title: 'All Shows in Pulo', image: jb},
                {title: 'Emerging Artists', image: jb},
                {title: 'Streaming Live This Weekend', image: jb},
                {title: 'Pop', image: jb},
                {title: 'Alternative', image: jb},
                {title: 'Elctronic', image: jb},
                {title: 'Rock', image: jb},
                {title: 'Hip Hop', image: jb},
                {title: 'Folk', image: jb},
                {title: 'RnB/Soul', image: jb},
                {title: 'Punk', image: jb},
                {title: 'Metal', image: jb},
                {title: 'Country', image: jb},
                {title: 'Blues', image: jb},
                {title: 'Jazz', image: jb},
                {title: 'Latin', image: jb},
                {title: 'Reggae', image: jb},
                {title: 'Classical', image: jb},
                {title: 'Christian / Gospel', image: jb},
            ],
        };
  },
}
</script>

<style>
</style>
