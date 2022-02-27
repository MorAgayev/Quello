  <template>
  <section class="add-new-list">
    <div
      class="center"
      v-if="!isListFormOpen"
      @click="isListFormOpen = !isListFormOpen"
    >
      <span class="icon"></span>
      Add a list
    </div>
    <div
      v-else
      class="list-form"
      :class="{ 'add-list-active': isListFormOpen }"
    >
      <input type="text" class="input-form" />
      <div class="add-card-control">
        <button>Add Card</button>
        <span class="icon" @click="isListFormOpen = !isListFormOpen"></span>
      </div>
    </div>
  </section>
</template>
  
<script>
export default {
  props: {},
  data() {
    return {
      isListFormOpen: false,
    };
  },
  methods: {},
};
</script>
