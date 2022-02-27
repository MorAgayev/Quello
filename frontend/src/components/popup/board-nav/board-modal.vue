<template>
  <transition name="fade">
    <section class="board-modal">
      <div class="board-link">
        <div class="title align-center">
          <span></span>
          <span>Board</span>
        </div>
        <span class="description">Organized cards in lists on board.</span>
      </div>
      <div class="dashboard-link" @click="toggleDashboard">
        <div class="title align-center">
          <span></span>
          <span>Dashboard</span>
        </div>
        <span class="description"
          >Generate charts, visuals, and metrics for work on this <br />
          board.</span
        >
      </div>
      <div class="map-link">
        <div class="title align-center">
          <span></span>
          <span>Map</span>
        </div>
        <span class="description">Visually plan time and workload.</span>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  methods: {
    toggleDashboard() {
      this.$emit("toggleDashboard");
    },
  },
};
</script>

<style></style>
