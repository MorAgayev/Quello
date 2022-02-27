<template>
  <section class="dashboard-page full flex" v-if="board">
    <div class="main-chart flex">
      <div class="main-details">
        <div class="title">
          <h4>{{ board.title }} Dashboard</h4>
          <span>Created by {{ board.createdBy.fullname }}</span>
          <span>Created {{ board.createdAt | moment("from") }}</span>
        </div>
        <div class="top-box flex">
          <div class="member-box">
            <div class="number flex">
              <span>{{ board.members.length }}</span>
              <span>Members</span>
            </div>
            <div class="member-icon">
              <span></span>
            </div>
          </div>
          <div class="activity-box">
            <div class="number flex">
              <span>{{ board.activities.length }}</span>
              <span>Activity</span>
            </div>
            <div class="activity-details">
              <span></span>
            </div>
          </div>
        </div>
        <div class="bottom-box flex">
          <div class="card-box">
            <div class="number flex">
              <span>{{ getCardsNum }}</span>
              <span>Cards</span>
            </div>
            <div class="card-info">
              <span>6 Complited</span>
              <span>4 Overdue</span>
              <span>6 Archive</span>
            </div>
          </div>
          <div class="checklist-box">
            <div class="number flex">
              <span>{{ getChecklistNum }}</span>
              <span>Checklist</span>
            </div>
            <div class="checklist-info">
              <span>7 Complited</span>
              <span>5 Todos</span>
              <span>6 Open todo</span>
            </div>
          </div>
        </div>
      </div>
      <div class="graph">
        <h4>Total labels used</h4>
        <label-chart
          :board="board"
          :totalLabels="totalLabelsCount"
          v-if="totalLabels"
        />
      </div>
      <div class="graph">
        <h4>Cards Per User</h4>
        <members-chart
          :board="board"
          :cardsPerMemberStat="cardsPerMemberStat"
          v-if="cardsPerMemberStat"
        />
      </div>
    </div>
    <div class="members-charts">
      <div
        class="member-card"
        v-for="member in cardsCount.members"
        :key="member._id"
      >
        <div class="member-card-head flex">
          <avatar
            class="avatar"
            :size="90"
            :username="member.fullname"
            :src="member.imgUrl"
          ></avatar>
          <div class="member-card-title">
            <h3>{{ member.fullname }}</h3>
            <small>{{ member.username }}</small>
          </div>
        </div>
        <div class="member-card-info flex">
          <div class="card-count flex">
            <h4>Member cards</h4>
            <span>{{ cardsCount.count[member.username] }}</span>
          </div>
          <div class="activity-count flex">
            <h4>Member activities</h4>
            <span>15</span>
          </div>
        </div>
        <div class="member-card-chart">
          <!-- <member-activity :member="member"></member-activity> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import labelChart from "../components/charts/label-chart.vue";
import membersChart from "../components/charts/members-chart.vue";
import memberActivity from "../components/charts/member-activity-chart.vue";
import { utilService } from "../service/util.service";
import Avatar from "vue-avatar";

export default {
  props: [],
  data() {
    return {
      board: this.$store.getters.getBoard,
      cardsPerMemberStat: "",
      totalLabels: this.totalLabelsCount,
      cardsCount: null,
    };
  },
  created() {
    this.cardsCount = this.cardsPerMember();
  },
  methods: {
    async loadBoard() {
      this.board = await this.$store.dispatch({
        type: "getBoard",
        boardId: this.$route.params.id,
      });
      await this.cardsPerMember;
      await this.totalLabelsCount;
    },
    memberActivities(memberId) {
      return this.board.activities.filter(
        (activity) => activity.createdBy._id === memberId
      );
    },
    getMemberCards(fullname) {
      this.cardsPerMemberStat[fullname].value;
      return 20;
    },
    cardsPerMember() {
      if (!this.board.members) return null;
      const { lists } = this.board;
      const countMap = lists.reduce((sum, list) => {
        return list.cards.reduce((sum, card) => {
          const user = utilService.sentenceToCamelCase(card.createdBy.username);
          if (!sum[user]) {
            sum[user] = { count: 1, member: card.createdBy };
          } else sum[user].count++;
          return sum;
        }, sum);
      }, {});
      return countMap;
    },
    // {'amir':{count:10,member:{miniMember}}}
  },
  computed: {
    getMembers() {
      console.log("members dashboard", this.$store.getters.getMembers);
      return this.$store.getters.getMembers;
    },
    getCardsNum() {
      var cardCount = 0;
      this.board.lists.forEach((list) => {
        return (cardCount += list.cards.length);
      });
      return cardCount;
    },
    getChecklistNum() {
      var chacklistCount = 0;
      this.board.lists.forEach((list) => {
        list.cards.forEach((card) => {
          return (chacklistCount += card.checkList.length);
        });
      });
      return chacklistCount;
    },
    getMemberActivity() {
      return this.board.activities.reduce(function (acc, obj) {
        const memberId = obj.createdBy._id;
        if (!acc[memberId]) {
          acc[memberId] = [];
          acc[memberId].push(obj);
        }
        console.log("acc:", acc);
        return acc;
      }, {});
    },
    totalLabelsCount() {
      if (!this.board) return null;
      const { lists } = this.board;
      const countMap = lists.reduce((sum, list) => {
        return list.cards.reduce((sum, card) => {
          card.labelsIds.filter((label) => {
            if (!sum[label.title]) sum[label.title] = 1;
            else sum[label.title]++;
          });
          return sum;
        }, sum);
      }, {});
      return countMap;
    },
    getBoard() {
      return this.$store.getters.getBoard;
    },
  },
  watch: {},
  components: {
    membersChart,
    labelChart,
    memberActivity,
    Avatar,
  },
};
</script>
