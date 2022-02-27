<template>
  <section class="dashboard-page full flex" v-if="board">
    <div class="close" @click="$emit('close')">
      <span></span>
    </div>
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
              <span>{{ boardStat.card.completed }} Complited</span>
              <span>{{ boardStat.card.overdue }} Overdue</span>
              <span>{{ boardStat.card.archive }} Archive</span>
            </div>
          </div>
          <div class="checklist-box">
            <div class="number flex">
              <span>{{ getChecklistNum }}</span>
              <span>Checklist</span>
            </div>
            <div class="checklist-info">
              <span>{{ boardStat.checklists.completed }} Complited</span>
              <span>{{ boardStat.checklists.total }} Todos</span>
              <span
                >{{
                  boardStat.checklists.total - boardStat.checklists.completed
                }}
                Open todo</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="graph">
        <h4>Total labels used</h4>
        <label-chart :board="board" :totalLabels="totalLabelsCount" />
      </div>
    </div>
    <div class="members-charts">
      <div
        class="member-card"
        v-for="memberCard in memberCards"
        :key="memberCard.member._id"
      >
        <div class="member-card-head flex">
          <avatar
            class="avatar"
            :size="90"
            :username="memberCard.member.fullname"
            :src="memberCard.member.imgUrl"
          ></avatar>
          <div class="member-card-title">
            <h3>{{ memberCard.member.fullname }}</h3>
            <small>{{ memberCard.member.username }}</small>
          </div>
        </div>
        <div class="member-card-info flex">
          <div class="card-count">
            <h4>Member cards</h4>
            <span>{{ memberCard.count }}</span>
          </div>
          <div class="activity-count">
            <h4>Member activities</h4>
            <span>{{ memberCard.activity.length }}</span>
          </div>
        </div>
        <div class="member-card-chart">
          <member-activity :activities="memberCard.activity"></member-activity>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Avatar from "vue-avatar";
import memberActivity from "../components/charts/member-activity-chart.vue";
import labelChart from "../components/charts/label-chart.vue";

export default {
  props: {
    board: Object,
  },
  data() {
    return {
      memberCards: this.membersStatistic(),
      boardStat: this.boardStatistic(),
    };
  },
  methods: {
    getMembersCards() {
      this.board.lists;
    },
    membersStatistic(sum = []) {
      const { lists } = this.board;
      sum = lists.reduce((sum, list) => {
        return list.cards.reduce((sum, card) => {
          const userId = card.createdBy._id;
          const user = sum.find((user) => user.member._id === userId);
          if (!user)
            sum.push({ count: 1, activity: [], member: card.createdBy });
          else user.count++;
          return sum;
        }, sum);
      }, sum);
      const { activities } = this.board;
      sum = activities.reduce((sum, activity) => {
        const userId = activity.createdBy._id;
        const user = sum.find((user) => user.member._id === userId);
        if (!user)
          sum.push({
            count: 0,
            activity: [activity.createdAt],
            member: activity.createdBy,
          });
        else user.activity.push(activity.createdAt);
        return sum;
      }, sum);
      return sum;
    },
    boardStatistic(sum = {}) {
      const { lists } = this.board;
      sum = lists.reduce((sum, list) => {
        return list.cards.reduce((sum, card) => {
          const { isComplete, date } = card.dueDate;
          const { archiveAt } = card;
          sum.card = {
            completed: isComplete
              ? (sum.card?.completed || 0) + 1
              : sum.card?.completed || 0,
            overdue:
              date && date < Date.now() && !isComplete
                ? (sum.card?.overdue || 0) + 1
                : sum.card?.overdue || 0,
            archive: archiveAt
              ? (sum.card?.archive || 0) + 1
              : sum.card?.archive || 0,
            total: sum.card?.total + 1 || 1,
          };
          const checklists = card.checkList;
          sum = checklists.reduce((sum, checklist) => {
            const todos = checklist.items;
            sum = todos.reduce((sum, todo) => {
              const { isDone, dueDate } = todo;
              sum.checklists = {
                completed: isDone
                  ? (sum.checklists?.completed || 0) + 1
                  : sum.checklists?.completed || 0,
                overdue:
                  dueDate.date && dueDate.date < Date.now() && !isDone
                    ? (sum.checklists?.overdue || 0) + 1
                    : sum.checklists?.overdue || 0,
                total: sum.checklists?.total + 1 || 1,
              };
              return sum;
            }, sum);
            return sum;
          }, sum);
          return sum;
        }, sum);
      }, sum);
      return sum;
    },
  },
  computed: {
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
    totalLabelsCount() {
      const { lists, labels } = this.board;
      const countMap = lists.reduce((map, list) => {
        return list.cards.reduce((map, card) => {
          card.labelsIds.reduce((map, id) => {
            const label = labels.find((label) => label.id === id);
            const mapped = map.find((label) => label.id === id);
            if (mapped) {
              mapped.count++;
            } else
              map.push({
                id,
                title: label.title,
                color: label.color,
                count: 1,
              });
            // map[label.title] = map[label.title] ? map[label.title] + 1 : 1;
            // console.log(map);
            return map;
          }, map);
          return map;
        }, map);
      }, []);
      // console.log(countMap);
      return countMap;
    },
  },
  components: {
    Avatar,
    memberActivity,
    labelChart,
  },
};
</script>

<style></style>
