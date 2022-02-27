<template>
  <div class="notification-container"></div>
</template>
<script>
import addNotification from "./add-notification.vue";
export default {
  props: {
    activity: Object,
  },
  computed: {
    activate() {
      const user = this.$store.getters.loggedinUser;
      return (
        this.activity &&
        this.activity.createdBy._id !== user._id &&
        this.activity.mentions.find((mention) => mention._id === user._id)
      );
    },
    shortActivate() {
      return {
        position: "top-right",
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: false,
        rtl: false,
      };
    },
  },
  created() {
    if (this.activate) {
      this.$toast(
        {
          component: addNotification,
          bodyClassName: "notification-container",
          props: {
            activity: this.activity,
          },
          listeners: {
            click: async () => {
              await this.$router.push({
                path: `${this.$route.path}?listId=${this.activity.listId}&cardId=${this.activity.cardId}`,
              });
            },
          },
        },
        this.shortActivate
      );
    }
    this.$emit("close");
  },
};
</script>
