<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: {
    board: Object,
    cardsPerMemberStat: Object,
  },
  data() {
    return {
      members: {
        amirinbar: 2,
        ziv: 1,
        mor: 5,
        gal: 7,
      },
      membersMap: this.cardsPerMemberStat,
    };
  },
  created() {
    for (const [key, value] of Object.entries(this.membersMap)) {
      this.members[key] = value;
    }
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: Object.keys(this.membersMap),
      datasets: [
        {
          label: "Toys in-stock",
          backgroundColor: [
            "#78C257",
            "#555555",
            "#E50914",
            "#0096D6",
            "#FF5403",
            "#F3ED9E",
          ],
          data: Object.values(this.membersMap),
        },
      ],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  },
  computed: {},
};
</script>

<style>
</style>