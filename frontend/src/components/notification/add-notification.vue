<template>
  <div @click="$emit('click', activity)" v-if="activity">
    <button>
      <avatar
        class="avatar"
        :size="24"
        :username="activity.createdBy.fullname"
        :src="activity.createdBy.imgUrl"
      ></avatar>
      <span class="name">{{ activity.createdBy.fullname }}:</span>
      <span class="text">{{ activity.title }}</span>
    </button>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
export default {
  props: {
    activity: Object,
  },
  components: {
    Avatar,
  },
};
</script>
