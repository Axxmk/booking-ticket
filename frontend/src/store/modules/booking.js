import axios from '../../util/axios'
import router from '../../router'

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
	dialog: (state) => state.dialog,

	dates: (state) => {
		let list = state.bookingShowtimes.map(showtime => showtime.date);
		return [...new Set(list)];
	},
	start_times: (state) => {
		let dateSelect = state.bookingShowtimes.filter(showtime => showtime.date == state.bookingInfo.date);
		return [...new Set(dateSelect.map(showtime => showtime.start_time))];
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
		console.log(value);
		state.bookingShowtimes = value;
	},
	set_bookingSeats(state, value) {
		state.bookingSeats = value;
	},
	set_bookingInfo_title(state, value) {
		state.bookingInfo.title = value;
	},
	set_bookingInfo_date(state, value) {
		state.bookingInfo.date = value;
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
	bookingShowtime({ commit }, movieId) {
		axios
			.get(`/booking/showtimes/${movieId}`)
			.then(
				(response) => {
					const data = response.data;
					commit("set_bookingShowtimes", data.showtimes);
					commit("set_bookingInfo_title", data.movieTitle);
					commit("set_bookingInfo_date", data.showtimes[0].date);
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
					commit("set_bookingSeats", response.data.seats);
				},
				(error) => console.log(error)
			);
	},

	checkPassword({ commit, dispatch }, password) {
		axios
			.post('/booking/check', password)
			.then(
				(response) => {
					const data = response.data;
					if (data.success) {
						commit("set_dialog", true);
						dispatch("showSuccess", "Password is correct", { root: true });
					}
					else dispatch("showError", data.error_reason, { root: true });
				},
				(error) => console.log(error)
			);
	},

	buyTicket({ dispatch, commit }, ticket) {
		axios
			.post('/tickets', ticket)
			.then(
				(response) => {
					console.log(response.data);
					dispatch("sendMail");
					commit("set_dialog", false);
					router.push({ name: "Home" });
				},
				(error) => console.log(error)
			);
	},

	sendMail({ getters, dispatch }) {
		let info = getters.bookingInfo;
		let ticket = {
			title: info.title,
			theatre: Number(info.theatre),
			date: info.date,
			start_time: info.start_time,
			seatNumbers: info.seat.join(),
			price: Number(info.price),
		};

		axios
			.post('/tickets/mail', ticket)
			.then(
				(response) => {
					const data = response.data;
					if (data.success) {
						dispatch("showSuccess", "We have already sent you an email", { root: true });
					}
					else dispatch("showError", data.error_reason, { root: true });
				},
				(error) => console.log(error)
			)
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