<template>
  <transition name="fade">
    <div class="menu-modal-background" @click="$emit('close')">
      <section class="menu-modal">
        <div class="menu-modal-title flex">
          <span class="qwello-icon"></span>
          <h2>Qwello</h2>
        </div>
        <router-link v-if="$route.name !== 'home'" to="/"
          ><span class="home-icon"></span>Home</router-link
        >
        <router-link v-if="$route.name !== 'board-list'" to="/board"
          ><span class="board-icon"></span>Boards</router-link
        >
        <router-link to="/about"
          ><span class="about-icon"></span>About</router-link
        >
      </section>
    </div>
  </transition>
</template>
