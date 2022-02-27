<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    activities: Array,
  },
  created() {
    this.activityMap();
  },
  data() {
    return {
      chartData: {
        labels: [
          "Sunday",
          "Monday",
          "Third",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        datasets: [
          {
            label: "Member activities",
            data: [0, 4, 3, 2, 8, 4, 3],
            fill: false,
            borderColor: "#2554FF",
            backgroundColor: "#2554FF",
            borderWidth: 0.5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      currDate: new Date(),
      activitystat: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    };
  },
  methods: {
    activityMap() {
      this.activities.forEach((activity) => {
        const time = new Date(activity);
        const day = time.getDay();
        this.activitystat[day]++;
      });
      this.chartData.datasets[0].data = Object.values(this.activitystat);
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
