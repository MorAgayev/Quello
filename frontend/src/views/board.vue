<template>
  <div
    v-if="board"
    class="board main-content"
    @filter="(filter) => (filterBy = filter)"
  >
    <msg-modal
      :msg="msg"
      @close="msg = null"
      @delete="(data) => remove('delete', data)"
      @cancel="msg = null"
    />
    <card-details
      v-if="$route.query.listId && $route.query.cardId"
      @close="$router.push({ path: $route.path })"
      @remove="removeCard"
      :board="board"
    />
    <div class="board-fixed-container" :style="background">
      <board-nav
        v-if="board"
        :board="board"
        :filter="filterBy"
        @toggleDashboard="toggleDashboard"
      ></board-nav>
      <card-list
        @addCard="addCard"
        @addList="addList"
        @removeCard="removeCard"
        @removeList="(data) => msgConfirm('list', data)"
        :filterBy="filterBy"
        :board="board"
      />
    </div>
    <notification
      :activity="activity"
      v-if="activity"
      @close="activity = null"
    />
    <dashboard v-if="isDashboard" :board="board" @close="isDashboard = false" />
  </div>
</template>

<script>
import boardNav from "../components/board-nav.vue";
import cardList from "../components/cards/card-list.vue";
import cardDetails from "../components/cards/card-details.vue";
import notification from "../components/notification/notification.vue";
import dashboard from "../components/dashboard-cmp.vue";
import msgModal from "@/components/msg-modal.vue";
import { socketService } from "../service/socket.service.js";
import { cardService } from "../service/card.service";

export default {
  props: [],
  data() {
    return {
      msg: null,
      board: null,
      filterBy: {
        keyword: "",
        members: [],
        dueDate: [0],
        labelsIds: [],
      },
      card: null,
      boardStyle: null,
      activity: null,
      isDashboard: false,
      fn: {
        removeList: async (list) => {
          console.log(list);
          await this.$store.dispatch({ type: "removeList", list });
        },
      },
    };
  },
  components: {
    cardList,
    boardNav,
    cardDetails,
    notification,
    dashboard,
    msgModal,
  },
  created() {
    socketService.on("COMMIT", this.socketUpdate);
  },
  methods: {
    async addCard({ listId, card }) {
      await this.$store.dispatch({ type: "setCard", listId, card });
    },
    async addList(list) {
      await this.$store.dispatch({ type: "setList", list });
    },
    async removeCard({ listId, card }) {
      this.card = await this.$store.dispatch({
        type: "removeCard",
        listId,
        card,
      });
    },
    async removeList(list) {
      await this.$store.dispatch({ type: "removeList", list });
    },
    async remove(type, { req, run }) {
      this.msg = null;
      type = run[type];
      switch (type) {
        case "removeList":
          await this.removeList(req);
          break;
      }
    },
    async msgConfirm(type, req) {
      switch (type) {
        case "list":
          this.msg = {
            title: "Delete list",
            value:
              "All actions will be removed from the activiy\nfeed and you won't be able to re-open the\ncard. There is no undo.",
            background: true,
            controls: { delete: "delete-btn", cancel: "cancel-btn" },
            req,
            run: { delete: "removeList" },
          };
          break;
      }
    },
    socketUpdate(data) {
      // console.log("socket >> ", data);
      this.$store.dispatch({ type: "socket", socketCmd: data });
      if (data.type === "setActivity") {
        const { activity } = data;
        if (!activity.mentions || !activity.mentions.length) {
          activity.mentions = cardService.getMentions(
            this.board,
            activity.listId,
            activity.cardId
          );
        }
        this.activity = activity;
      }
    },
    toggleDashboard() {
      this.isDashboard = !this.isDashboard;
    },
  },
  computed: {
    background() {
      const style = this.board.style;
      if (style.backgroundImage)
        return `backgroundImage: ${style.backgroundImage}`;
      else if (style.backgroundColor)
        return `backgroundColor: ${style.backgroundColor}`;
    },
  },
  watch: {
    "$route.params.id": {
      async handler(boardId) {
        this.board = await this.$store.dispatch({
          type: "getBoardById",
          boardId,
        });
        socketService.on(boardId, this.socketUpdate);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
