import axios from '../../util/axios'

const state = () => ({
	bookingShowtimes: [],
	bookingSeats: [],
	bookingInfo: {
		title: "",
		theatre: "",
		date: "",
		start_time: "",
		seat: [],
		price: 0,
	},
	dialog: false,
})

const getters = {
	bookingShowtimes: (state) => state.bookingShowtimes,
	bookingSeats: (state) => state.bookingSeats,
	bookingInfo: (state) => state.bookingInfo,

	dates: (state) => {
		let list = state.bookingShowtimes.map(showtime => showtime.date);
		return [...new Set(list)];
	},
	start_times: (state) => {
		let dateSelect = state.bookingShowtimes.filter(showtime => showtime.date == state.bookingInfo.date);
		return dateSelect.map(showtime => showtime.start_time);
	},
	theatres: (state) => {
		const info = state.bookingInfo;
		let showtimeSelect = state.bookingShowtimes.filter(showtime => showtime.date == info.date && showtime.start_time == info.start_time);
		return showtimeSelect.map(showtime => showtime.theatre);
	},
	showtimeId: (state) => {
		const info = state.bookingInfo;
		let showtimeSelect = state.bookingShowtimes.filter(showtime => showtime.date == info.date && showtime.start_time == info.start_time && showtime.theatre == info.theatre);
		return showtimeSelect[0].showtimeId;
	},
}

const mutations = {
	set_bookingShowtimes(state, value) {
		state.bookingShowtimes = value;
	},
	set_bookingSeats(state, value) {
		state.bookingSeats = value;
	},
	set_bookingInfo_title(state, value) {
		state.bookingInfo.title = value;
	},
	set_empty(state) {
		state.bookingInfo = {
			title: "",
			theatre: "",
			date: "",
			start_time: "",
			seat: [],
			price: 0,
		}
	},
	set_dialog(state, value) {
		state.dialog = value;
	}
}

const actions = {
	bookingShowtime({ commit, rootGetters }, movieId) {
		console.log(movieId);
		axios
			.get(`/booking/showtimes/${movieId}`)
			.then(
				(response) => {
					console.log(response.data);
					commit("set_bookingShowtimes", response.data.showtimes);

					let movie = rootGetters.movies.find((movie) => movie.id == movieId);
					commit("set_bookingInfo_title", movie.title);
				},
				(error) => console.log(error)
			);
	},

	bookingSeats({ commit, getters }) {
		let showtimeId = getters.showtimeId;
		axios
			.get(`/booking/seats/${showtimeId}`)
			.then(
				(response) => {
					console.log(response.data);
					commit("set_bookingSeats", response.data.seats);
				},
				(error) => console.log(error)
			);
	},

	checkPassword(_app, data) {
		axios
			.post('/booking/check', data)
			.then(
				(response) => {
					if (response.data.success) {
						alert("password is correct");
					}
					else alert(response.data.error_reason);
				},
				(error) => console.log(error)
			);
	},

	buyTicket(_app, data) {
		axios
			.post('/tickets', data)
			.then(
				(response) => {
					console.log(response.data);
				},
				(error) => console.log(error)
			);
	},

	clearInfo({ commit }) {
		commit("set_empty");
	},
}

export default {
	state,
	getters,
	mutations,
	actions
}