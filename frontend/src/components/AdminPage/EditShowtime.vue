<template>
  <v-card>
    <v-card-title class="pl-8 pt-5" style="color: #0361b9">
      Showtime
    </v-card-title>

    <v-card-text class="pb-0">
      <v-container>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="5" md="5">
              <v-select
                v-model="theatre"
                :items="allTheatre"
                label="Theatre"
                item-color="blue lighten-2"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="7" md="7">
              <v-menu
                ref="menu"
                v-model="menu"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  color="blue lighten-2"
                  scrollable
                  @change="$refs.menu.save(date)"
                >
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="start_times"
                :items="timeTable"
                label="showtime"
                item-color="blue lighten-2"
                multiple
              ></v-combobox>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <v-divider class="mx-6"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue lighten-2" text @click="close"> Cancel </v-btn>
      <v-btn color="blue lighten-2" text @click="addnew"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    movieId: Number,
  },
  data: () => ({
    menu: false,
    theatre: 0,
    date: "",
    start_times: [],
    timeTable: [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ],
    allTheatre: ["1", "2", "3", "4", "5", "6", "7", "8"],
  }),
  methods: {
    addnew() {
      if (this.theatre && this.date && this.start_times.length > 0) {
        let newShowtime = {
          movieId: this.movieId,
          theatre: Number(this.theatre),
          date: this.date,
          start_times: this.start_times.join(),
        };

        this.$store.dispatch("addShowtime", newShowtime);
        this.close();
      }
    },
    close() {
      this.$refs.form.reset();
      this.$emit("close");
    },
  },
};
</script>