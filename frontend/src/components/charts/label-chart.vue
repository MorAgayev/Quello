<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    board: Object,
    totalLabels: Array,
  },
  data() {
    return {
      copyTotalLabels: this.totalLabels,
    };
  },
  mounted() {
    this.renderChart({
      labels: [""],
      datasets: this.chartData,
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: "Value",
            },
            min: 0,
            max: 20,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  },
  methods: {
    backgroundColor() {
      const bg = this.board.labels.map((label) => label.color);
      return bg;
    },
  },
  computed: {
    chartData() {
      return this.totalLabels.map((label) => {
        return {
          label: label.title,
          backgroundColor: label.color,
          data: [label.count],
        };
      });
    },
    chartLabels() {
      return this.totalLabels.map((label) => label.title);
    },
  },
};
</script>
