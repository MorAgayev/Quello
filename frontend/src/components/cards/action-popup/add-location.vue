<template>
  <section class="location">
    <div class="new-location flex" v-if="!card.location || isEdit">
      <label>
        <GmapAutocomplete
          class="autocomplete"
          @place_changed="setPlace"
          :options="{
            fields: ['geometry', 'formatted_address', 'address_components'],
          }"
        >
        </GmapAutocomplete>
      </label>

      <button @click="addMarker">Add Marker</button>
    </div>

    <div class="current-location flex" v-else>
      <div class="control-btns flex">
        <button @click="isEdit = true">Change location</button>
        <button @click="removeLocation">Remove</button>
      </div>
    </div>
  </section>
</template>

<script>
import { cardService } from "../../../service/card.service";
import { GOOGLEAPI } from "../../../main";

export default {
  props: {
    action: Object,
    card: Object,
  },
  data() {
    return {
      title: "Location",
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      location: null,
      position: {},
      isEdit: false,
    };
  },
  created() {
    console.log(location);
  },
  methods: {
    add() {
      this.$emit("add", { key: "location", item: this.location });
      this.$emit("close");
    },
    setPlace(place) {
      this.currentPlace = place;
      const shortAddress = place.address_components[0].short_name;
      const longAddress = place.formatted_address;
      this.location = cardService.addLocation({ longAddress, shortAddress });
    },
    addMarker() {
      if (this.currentPlace) {
        this.location.lat = this.currentPlace.geometry.location.lat();
        this.location.lng = this.currentPlace.geometry.location.lng();
        const { lat, lng } = this.location;
        this.location.api = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=512x160&markers=color:red|size:mid|label:|${lat},${lng}&sensor=false&key=${GOOGLEAPI}&scale=2`;
        this.currentPlace = null;
        console.log(this.location.api);
        this.add();
      }
    },
    removeLocation() {
      this.$emit("remove", { item: this.card.location, key: "location" });
      this.$emit("close");
    },
  },
  components: {},
};
</script>

<style></style>
