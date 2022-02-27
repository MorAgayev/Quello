<template>
  <section class="location-container" v-if="card.location.address">
    <div class="location-header flex">
      <span></span>
      <h3 class="card-item-title">Location</h3>
    </div>
    <div class="main-location">
      <img v-if="card.location" :src="card.location.api" alt="" />
      <div class="location-control align-center flex">
        <div class="location-address flex" v-if="card.location">
          <span class="main-address">{{
            card.location.address.shortAddress
          }}</span>
          <span>{{ card.location.address.longAddress }}</span>
        </div>
        <div class="location-bts">
          <span class="google-map" @click="openGoogleMap"></span>
          <span
            class="location-change"
            @click="
              $emit('popup', {
                type: 'Location',
                offset: { x: 0, y: 0 },
                target: $event.target,
                value: card,
              })
            "
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    card: Object,
  },
  name: "GoogleMap",
  data() {
    return {
      markers: [],
      places: [],
      currentPlace: null,
      position: {
        lat: this.card.location.lat,
        lng: this.card.location.lng,
      },
    };
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    removeLocation() {
      this.$emit("add", this.location);
    },
    openGoogleMap() {
      const { lat, lng } = this.card.location;
      const link = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      const query = Object.assign(
        { ...this.$route.query },
        { media: decodeURIComponent(link), tag: "map" }
      );
      this.$router.replace({ query });
    },
  },
  watch: {
    "card.location": {
      handler(location) {
        const { lat, lng } = location;
        this.position = { lat, lng };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
