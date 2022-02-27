<template>
  <div
    class="card-scene"
    v-if="board"
    :style="widthLimit"
    :key="refresh"
    @touchend="returnTouch"
  >
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable
        v-for="(column, i) in scene.children"
        :key="`LIST${i}-${column.id}`"
      >
        <div :class="column.props.className" v-if="isShownList(column.data)">
          <div class="column-drag-handle">
            <div class="card-column-header flex">
              <textarea
                cols="30"
                rows="10"
                class="list-input"
                v-model="column.name"
                @change="setListTitle(column.name, i)"
                spellcheck="false"
              >
              </textarea>
              <span class="column-drag-handle-main">
                <span
                  class="column-drag-handle-inner"
                  @click="removeList(i)"
                ></span
              ></span>
            </div>
          </div>

          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable
              v-for="(card, j) in column.children"
              :key="`CARD${j}-${card.id}`"
            >
              <card-preview
                v-if="isShownCard(card.data)"
                :card="card.data"
                :listId="column.id"
                :props="card.props"
                :isShown="isShowLabels"
                @setShown="isShowLabels = !isShowLabels"
                @remove="(data) => $emit('removeCard', data)"
              />
            </Draggable>
          </Container>
          <card-add
            @add="(card) => $emit('addCard', card)"
            :columnId="column.id"
          />
        </div>
      </Draggable>
      <card-list-add @add="(list) => $emit('addList', list)" :board="board" />
    </Container>
  </div>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";

import {
  applyDrag,
  createDragMap,
  sortMap,
} from "../../service/draggable.service";
import { deepCopy } from "../../service/util.service";

import cardPreview from "./card-preview.vue";
import cardAdd from "./card-add.vue";
import cardListAdd from "./card-list-add.vue";

export default {
  name: "cards",
  props: {
    board: Object,
    filterBy: Object,
  },
  data() {
    return {
      scene: createDragMap(this.board.lists, "cards"),
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      isShowLabels: false,
      cardToEdit: null,
      listName: "",
      payloaded: null,
      refresh: "board" + Date.now(),
    };
  },
  methods: {
    returnTouch() {
      document.body.classList.remove(
        "smooth-dnd-no-user-select",
        "smooth-dnd-disable-touch-action"
      );
    },
    isShownCard(card) {
      if (card.archiveAt) return false;
      if (!this.filterBy) return true;
      const { keyword, members, dueDate, labelsIds } = this.filterBy;
      if (members.length) {
        const count = card.members.filter((item) =>
          members.includes(item?._id)
        );
        if (count.length !== members.length) return false;
      }
      if (dueDate[0]) {
        const tomorrow = {
          start: new Date(),
          end: new Date(),
        };
        tomorrow.start.setHours(24, 0, 0, 0);
        tomorrow.end.setHours(48, 0, 0, 0);
        if (dueDate[0] === 1 && card.dueDate.date) return false;
        else if (dueDate[0] === 2 && card.dueDate.date < Date.now())
          return false;
        else if (
          dueDate[0] === 3 &&
          !(
            card.dueDate.date > tomorrow.start &&
            card.dueDate.date < tomorrow.end
          )
        ) {
          return false;
        }
      }
      if (keyword) {
        const title = card.title.toLowerCase();
        const desc = card.desc.toLowerCase();
        const search = keyword.toLowerCase();
        if (!title.includes(search) && !desc.includes(search)) return false;
      }
      if (labelsIds.length) {
        const count = card.labelsIds.filter((id) => labelsIds.includes(id));
        if (count.length !== labelsIds.length) return false;
      }
      return true;
    },
    isShownList(list) {
      const { keyword, members, dueDate, labelsIds } = this.filterBy;
      if (!keyword && !members?.length && !dueDate[0] && !labelsIds?.length)
        return true;
      return list.cards.some((card) => this.isShownCard(card));
    },
    onColumnDrop(dropResult) {
      const scene = Object.assign({}, this.scene);
      const { children } = applyDrag(scene.children, dropResult, null);
      scene.children = children;
      this.scene = scene;
      const change = {
        from: dropResult.removedIndex,
        to: dropResult.addedIndex,
      };
      this.$store.dispatch({ type: "sortBoard", map: sortMap(this.scene) });
    },
    onCardDrop(columnId, dropResult) {
      if (dropResult.removedIndex === null && dropResult.addedIndex === null)
        return;
      const scene = Object.assign({}, this.scene);
      const column = scene.children.filter((p) => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);
      const newColumn = Object.assign({}, column);
      const { children, change } = applyDrag(
        newColumn.children,
        dropResult,
        columnId,
        this.payloaded
      );
      this.payloaded = change;
      newColumn.children = children;
      scene.children.splice(columnIndex, 1, newColumn);
      this.scene = scene;

      if (change.to && change.from) {
        this.payloaded = null;
        this.$store.dispatch({ type: "sortBoard", map: sortMap(this.scene) });
      }
    },
    getCardPayload(columnId) {
      return (index) => {
        return this.scene.children.filter((p) => p.id === columnId)[0].children[
          index
        ];
      };
    },
    removeList(idx) {
      const list = deepCopy(this.board.lists[idx]);
      this.$emit("removeList", list);
    },
    setListTitle(columnName, idx) {
      const list = deepCopy(this.board.lists[idx]);
      list.title = columnName;
      this.$store.dispatch({ type: "setList", list });
    },
  },
  watch: {
    filterBy: {
      handler() {
        this.refresh = "board" + Date.now();
      },
      deep: true,
      immediate: true,
    },
    "board.lists": {
      handler(lists) {
        this.scene = createDragMap(lists, "cards");
      },
      deep: true,
    },
  },
  computed: {
    widthLimit() {
      return this.$route.query.cardId
        ? { width: "100%", "overflow-x": "hidden", "overflow-y": "hidden" }
        : {};
    },
  },
  components: {
    Container,
    Draggable,
    cardPreview,
    cardAdd,
    cardListAdd,
  },
};
</script>
