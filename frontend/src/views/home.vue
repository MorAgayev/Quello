<template>
  <div class="home-page">
    <main class="main-layout">
      <div class="information section1">
        <div class="txt">
          <h1>Qwello helps teams move work forward</h1>
          <p>
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to ths gome office, the way your your team works in
            unique - accomplish it all with Qwello
          </p>
          <button @click="login">Start as guest</button>
        </div>
        <div class="img">
          <img src="@/assets/imgs/trello-cover.png" alt="" />
        </div>
      </div>

      <div class="information section2">
        <div class="txt">
          <h1>It’s more than work. It’s a way of working together.</h1>
          <p>
            Start with a Qwello board, lists, and cards. Customize and expand
            with more features as your teamwork grows. Manage projects, organize
            tasks, and build team spirit—all in one place.
          </p>
        </div>
        <div class="img">
          <img src="@/assets/imgs/demo-board.png" alt="" />
        </div>
      </div>

      <div class="information section3">
        <div class="txt">
          <h1>Features to help your team succeed.</h1>
          <p>
            Powering a productive team means using a powerful tool (and plenty
            of snacks). From meetings and projects to events and goal setting,
            Qwello intuitive features give any team the ability to quickly set
            up and customize workflows for just about anything.
          </p>
        </div>
      </div>

      <div class="information section4">
        <div class="txt">
          <h1>The board is just the beginning</h1>
          <p>
            Lists and cards are the building blocks of organizing work on a
            Qwello board. Grow from there with task assignments, timelines,
            productivity metrics, calendars, and more.
          </p>
        </div>
        <div class="img">
          <img src="@/assets/imgs/view.30c721bc.svg" alt="" />
        </div>
      </div>

      <div class="information section5">
        <div class="txt">
          <h1>Cards contain everything you need</h1>
          <p>
            Qwello cards are your portal to more organized work—where every
            single part of your task can be managed, tracked, and shared with
            teammates. Open any card to uncover an ecosystem of checklists, due
            dates, attachments, conversations, and more..
          </p>
        </div>
        <div class="img">
          <img src="@/assets/imgs/card-back.11e5c427.svg" alt="" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  created() {},
  methods: {
    async login() {
      const user = { username: "Guest", password: "Guest", fullname: "Guest" };
      try {
        await this.$store.dispatch({ type: "login", user });
        this.$router.push("/board");
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    getBoard() {
      return this.$store.getters.getBoard;
    },
  },
  components: {},
};
</script>
