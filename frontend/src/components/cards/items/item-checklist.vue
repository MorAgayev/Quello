<template>
  <div>
    <action-cmp
      v-if="action"
      @set="setByPop"
      @remove="removeByPop"
      @close="action = null"
      :card="card"
      :action="action"
    ></action-cmp>

    <!-- <Container @drop="onDrop">
      <Draggable>-->
    <section
      class="card-checklist"
      v-for="(checklist, clidx) in checklists"
      :key="'checklist' + clidx"
    >
      <div class="title">
        <span class="icon" />
        <input
          class="hidden-input card-item-title"
          @focus="openId = null"
          v-model="checklist.title"
        />
        <button
          class="activity-toggle-btn"
          @click="toggleClickedHidden(clidx)"
          v-if="getCompletedCount(checklist)"
        >
          {{ checkItemTitle(checklist, clidx) }}
        </button>
        <button class="activity-toggle-btn" @click="onRemove(checklist, clidx)">
          Delete
        </button>
      </div>
      <div class="progress">
        <span class="percentage">{{ precentProgress(checklist).precent }}</span>
        <div class="bar">
          <div class="current" :style="precentProgress(checklist).style"></div>
        </div>
      </div>
      <div class="todos">
        <div
          class="todo"
          v-for="(todo, idx) in checklist.items"
          :key="'todo' + idx"
        >
          <template
            v-if="!todo.isDone || (isCheckedHidden[clidx] && todo.isDone)"
          >
            <input
              type="checkbox"
              :value="todo.isDone"
              @focus="openId = null"
              v-model="todo.isDone"
            />
            <textarea
              class="details"
              v-model="todo.title"
              :style="textAreaStyle(todo.title)"
              :class="{ complete: todo.isDone }"
              row="1"
              spellcheck="false"
            />
            <div class="controls">
              <div
                v-if="todo.dueDate"
                class="due-date"
                :style="todo.dueDate.date ? { display: 'block' } : {}"
                @click="
                  setTodoToEdit(todo, 'dates', $event, 'Set due date', {
                    format: 'date',
                    timestamp: todo.dueDate.date,
                  })
                "
              >
                <span
                  v-if="!todo.dueDate.date"
                  class="preview"
                  role="img"
                  aria-label="ClockIcon"
                >
                  <svg
                    width="18"
                    height="18"
                    role="presentation"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                      fill="currentColor"
                    ></path></svg
                ></span>
                <div
                  class="preview"
                  v-else
                  :class="{
                    done: todo.isDone,
                    incomplete: !todo.isDone,
                    overdue: !todo.isDone && todo.dueDate.date < Date.now(),
                  }"
                >
                  {{ getPreviewDate(todo.dueDate.date) }}
                </div>
              </div>
              <div
                @click="
                  setTodoToEdit(todo, 'Members', $event, 'Assign', {
                    limit: 1,
                    members: todo.members,
                  })
                "
                :style="todo.members.length ? { display: 'block' } : {}"
              >
                <svg
                  v-if="!todo.members.length"
                  width="18"
                  height="18"
                  role="presentation"
                  focusable="false"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 9.44777 7.61532 10.7518 8.59871 11.6649C5.31433 13.0065 3 16.233 3 20C3 20.5523 3.44772 21 4 21H12C12.5523 21 13 20.5523 13 20C13 19.4477 12.5523 19 12 19H5.07089C5.55612 15.6077 8.47353 13 12 13ZM15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H19V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V18H15C14.4477 18 14 17.5523 14 17C14 16.4477 14.4477 16 15 16H17V14Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <avatar
                  v-else
                  v-for="member in todo.members"
                  :key="member._id"
                  :size="16"
                  :username="member.fullname"
                  :src="member.imgUrl"
                  :title="`Assign to ${member.fullname}`"
                ></avatar>
              </div>
            </div>
          </template>
        </div>
      </div>
      <template class="todo-text-area" v-if="openId === checklist.id">
        <textarea class="add" v-model="todo" @blur="exit"></textarea>
        <div class="controls">
          <button @click="onAdd(checklist)" class="save task-btn">Add</button>
          <button @click="openId = null" class="remove task-btn">X</button>
        </div>
        {{ todo.id }}
      </template>
      <button
        v-if="openId !== checklist.id"
        @click="openId = checklist.id"
        class="activity-toggle-btn add-item"
      >
        Add an item
      </button>
    </section>
    <!-- </Draggable>
    </Container> -->
  </div>
</template>

<script>
import { cardService } from "../../../service/card.service.js";
import { debounce, deepCopy } from "../../../service/util.service.js";
import actionCmp from "../action-popup/actions-popup.vue";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "../../../service/draggable.service";
import Avatar from "vue-avatar";

var moment = require("moment");
moment().format();
export default {
  name: "checklist",
  props: {
    card: Object,
  },
  components: {
    actionCmp,
    Avatar,
    Container,
    Draggable,
  },
  data() {
    return {
      checklists: deepCopy(this.card.checkList),
      openId: null,
      todo: "",
      todoInEdit: null,
      isCheckedHidden: [],
      action: null,
    };
  },
  created() {
    this.toggleUpdate();
  },
  methods: {
    getPreviewDate(date) {
      const formatter = moment(date).format("ll");
      return moment(date).format("ll").slice(0, formatter.indexOf(","));
    },
    onDrop(dropResult) {
      this.checklists = applyDrag(this.checklists, dropResult).children;
    },
    exit() {
      debounce(() => {
        this.openId = null;
      }, 10);
    },
    onAdd(checklist) {
      if (this.todo)
        checklist.items.push(cardService.addCheckListItem(this.todo));
      this.todo = "";
    },
    onRemove(checklist, idx) {
      if (checklist.id) {
        this.$emit("remove", { item: checklist, key: "checkList" });
        this.openId = null;
        // this.checklists.splice(idx, 1);
      }
    },
    setTodoToEdit(todo, type, event, title, arg) {
      this.todoInEdit = todo;
      this.action = {
        type,
        offset: { x: 0, y: 0 },
        event,
        card: todo,
        board: this.card,
        title,
        ...arg,
      };
    },
    setByPop(data) {
      if (data.key === "dueDate") {
        const dueDate = data.item;
        delete dueDate.isComplete;
        delete dueDate.completedAt;
        this.todoInEdit.dueDate = dueDate;
      } else if (data.key === "members") {
        const members = this.todoInEdit.members;
        members.splice(0, members.length, ...data.item);
      }
    },
    removeByPop(data) {},
    precentProgress(checklist) {
      const sum = checklist.items.reduce(
        (sum, todo) => {
          return {
            total: sum.total + 1,
            complete: todo.isDone ? sum.complete + 1 : sum.complete,
          };
        },
        { total: 0, complete: 0 }
      );
      const precent = (sum.complete / sum.total) * 100;
      return {
        style: {
          width: `${precent}%`,
          "background-color":
            precent < 100 ? "rgb(91, 164, 207)" : "rgb(97, 189, 79)",
        },
        precent: sum.total ? precent.toFixed(0) + "%" : "0%",
      };
    },
    textAreaStyle(text) {
      const lineCount = text?.split("\n")?.length || 1;
      const height = lineCount * 24 + 8;
      return { height: height + "px" };
    },
    getCompletedCount(checklist) {
      return checklist.items.reduce(
        (sum, todo) => (sum = todo.isDone ? sum + 1 : sum),
        0
      );
    },
    checkItemTitle(checklist, idx) {
      const title = !this.isCheckedHidden[idx]
        ? `Show checked items (${this.getCompletedCount(checklist)})`
        : "Hide checked items";
      return title;
    },
    toggleClickedHidden(idx) {
      this.isCheckedHidden.splice(idx, 1, !this.isCheckedHidden[idx]);
    },
    toggleUpdate() {
      for (
        let index = this.isCheckedHidden.length;
        index < this.checklists.length;
        index++
      ) {
        this.isCheckedHidden.push(true);
      }
    },
  },
  watch: {
    checklists: {
      handler(data) {
        debounce(
          () => {
            data = data.filter(
              (checklist, idx) =>
                JSON.stringify(this.card.checkList[idx]) !==
                JSON.stringify(checklist)
            );
            data.forEach((checklist) =>
              this.$emit("set", {
                item: deepCopy(checklist),
                key: "checkList",
              })
            );
          },
          data.id,
          250
        );
        this.toggleUpdate();
      },
      deep: true,
    },
    "card.checkList": {
      handler(data) {
        debounce(
          () => {
            if (deepCopy(data) !== deepCopy(this.checklists))
              this.checklists = deepCopy(data);
          },
          "checklists",
          500
        );
      },
      deep: true,
    },
  },
};
</script>
