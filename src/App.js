import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import "./App.css";
import "./styles/info.css";
import StepProgress from "../src/components/stepProgress";
import RegisterForm from "../src/components/registerForm";
import SelectTimeAppointment from "../src/components/selectTimeAppointment";
import BookAppointment from "../src/components/boookAppointment";
import { blocks } from "../src/config/constans.js";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import * as crypto from "crypto-js";

function App() {
	const params = new URLSearchParams(window.location.search);
	const languageList = { en: "English", es: "Spanish" };
	const [firstLoad, setFirstLoad] = useState(true);
	const [localTime, setLocalTime] = useState({ date: new Date() });
	const [selectedBlock, setSelectBlock] = useState(null);
	const [width, setWindowWidth] = useState(0);
	const [state, setState] = useState({
		step: "registerForm",
		status: "IDLE",
		availabilityRequestStatus: "IDLE",
		appointmentRequestStatus: "IDLE",
		city: params.get("city") || "N/A",
		message: "",
		siteId: params.get("id") || "490100",
		latitude: params.get("latitude") || "0",
		longitude: params.get("longitude") || "0",
		language: languageList[params.get("lang")] || "English",
		locationId: params.get("city") !== "coral-springs" ? "1" : "2",
		authorization: "",
		address: params.get("address") || "N/A",
		phone: params.get("phone") || "N/A",
		howtoarrive: params.get("howtoarrive") || "N/A",
		startDate: moment(new Date()).format("MM/DD/YYYY").toString(),
		block: {
			id: "",
		},
		captchaReady: true,
		showAddons: false,
		textMessageStatus: "IDLE",
		textMessage: "",
		displayTerms: false,
	});
	const [clientState, setClientState] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		weeks: "",
		sessionTypeId: "",
		sessionTypeName: "",
		clientRequestStatus: "IDLE",
		createClientRequestStatus: "IDLE",
		searchResults: [],
		clientObject: {},
		clientIsEqual: undefined,
		ipAddress: "",
	});

	const [availableBlocks, setAvailableBlocks] = useState([]);
	const [services, setServices] = useState([]);
	const [selectedOptionAddons, setSelectedOptionAddons] = useState(null);
	const [stepOne, setStepOne] = useState("default");
	const [stepTwo, setStepTwo] = useState("default");
	const [stepThree, setStepThree] = useState("default");
	const [addHeartbeatBuddies, setAddHeartbeatBuddies] = useState(false);
	const [add8kRealisticView, setAdd8kRealisticView] = useState(false);
	const [ultrasounds, setUltrasounds] = useState([]);
	const [consultedUltrasounds, setConsultedUltrasounds] = useState([]);
	const [weeks, setWeeks] = useState([]);
	const [sitesInfo, setSitesInfo] = useState([]);
	const [sendForm, setSendForm] = useState(false);
	const [fixedServices, setFixedServices] = useState({
		specialPromotion25min: "",
		genderdetermination: "",
		earlypregnancy: "",
		meetyourbaby25: "",
		meetyourbaby15: "",
	});
	const [hoverIndex8kRealisticView, setHoverIndex8kRealisticView] = useState(false);
	const [hoverIndexBabyGrow, setHoverIndexBabyGrow] = useState(false);
	const [hoverIndexHearthbeat, setHoverIndexHearthbeat] = useState(false);
	const [modalBabyGrow, setModalBabyGrow] = useState(false);
	const [modalHearthbeat, setModalHearthbeat] = useState(false);
	const [modal8kRealisticView, setModal8kRealisticView] = useState(false);
	const [clickButtonForm, setClickButtonForm] = useState(false);
	const [addBabysGrowth, setAddBabysGrowth] = useState(false);

	const [seletedService, setSeletedService] = useState(null);
	const [addOns, setAddOns] = useState();

	const [leadState, setLeadState] = useState({
		clientFound: false,
		leadRegistered: false,
		leadDeleted: false,
		leadUpdate: false,
		partititonKey: "",
		orderKey: "",
	});

	const parent_origin = `${process.env.REACT_APP_FOLLOWING_URL}`;
	const scrollParenTop = () => {
		window.parent.postMessage({ task: "scroll_top" }, parent_origin);
	};

	const googleTrackBooking = ({ name, service, date, time }) => {
		console.log("sending task to parent");
		window.parent.postMessage({ task: "google_track_booking", name, service, date, time }, parent_origin);
	};

	const getSitesInfo = async () => {
		try {
			const getSitesData = {
				method: "GET",
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			};
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/config/sites`, getSitesData);
			const data = await response.json();
			if (response.ok) {
				const allSitesItem = data.sites.find((site) => site.site === "0-0");
				let sitesArray = [];
				if (allSitesItem !== undefined) {
					sitesArray = data.sites.filter((site) => site.site !== "0-0");
				} else {
					sitesArray = data.sites;
				}
				setSitesInfo(sitesArray);
			} else {
				console.error(response);
			}
		} catch (error) {
			console.error(JSON.stringify(error));
		}
	};

	useEffect(() => {
		const filterSite = sitesInfo.find((i) => i.site === `${state.siteId}-${state.locationId}`);
		if (filterSite !== undefined) {
			const date = new Date();
			const timeZone = date.toLocaleString("en-US", { timeZone: filterSite?.timeZone });
			setLocalTime((localTime) => ({
				...localTime,
				date: timeZone,
			}));
		}
	}, [sitesInfo, localTime.date]);

	const getPrice = (service) => {
		return parseInt(service.split("$")[1]);
	};

	const orderServices = (services) => {
		return services.sort(function (a, b) {
			if (getPrice(a.label) < getPrice(b.label)) {
				return -1;
			}
			if (getPrice(a.label) > getPrice(b.label)) {
				return 1;
			}
			return 0;
		});
	};

	const getServiceId = (serviceName, servicesArray) => {
		const sessionTypeName = serviceName;
		let purifiedServiceName = "";
		let remaining = "";
		let serviceId = "";
		const regex = /[-.()+\s]/g;

		if (sessionTypeName.toLowerCase().includes("$")) {
			const indexPrice = sessionTypeName.toLowerCase().indexOf("$");
			remaining = sessionTypeName.toLowerCase().slice(0, indexPrice);
		} else {
			remaining = serviceName;
		}
		purifiedServiceName = remaining.replace(regex, "");

		servicesArray.forEach((serviceItem) => {
			let purifiedServiceArray = "";
			let remainingService = "";

			if (serviceItem.name.toLowerCase().includes("$")) {
				const indexPrice = serviceItem.name.toLowerCase().indexOf("$");
				remainingService = serviceItem.name.toLowerCase().slice(0, indexPrice);
			} else {
				remainingService = serviceItem.name;
			}
			purifiedServiceArray = remainingService.replace(regex, "");
			if (purifiedServiceArray === purifiedServiceName) {
				serviceId = serviceItem.sessionTypeId;
			}
		});
		return serviceId;
	};

	useEffect(() => {
		if (state.siteId === "5731081") {
			const today = moment().format("MM/DD/YYYY").toString();
			const dayFriday = moment("03/31/2023").format("MM/DD/YYYY").toString();
			setState((state) => ({
				...state,
				startDate: today > dayFriday ? today : dayFriday,
			}));
		}
	}, [state.siteId]);
	// Loads the dropdown values and set the states for that display on first load
	useEffect(() => {
		async function getServices() {
			try {
				const authPayload = {
					Username: `${process.env.REACT_APP_USER_NAME}`,
					Password: `${process.env.REACT_APP_PASSWORD}`,
				};

				const key = process.env.REACT_APP_ENCRYPTION_KEY;
				const encrypted = crypto.AES.encrypt(JSON.stringify(authPayload), key).toString();
				const body = { data: encrypted };
				const authRequest = {
					method: "PUT",
					headers: {
						"Content-type": "application/json; charset=UTF-8",
						siteid: state.siteId,
					},
					body: JSON.stringify(body),
				};
				const authResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/userToken/`, authRequest);
				const authData = await authResponse.json();
				if (authResponse.ok) {
					setState((state) => ({
						...state,
						authorization: authData.accesssToken,
					}));
					const ultrasoundsRequest = {
						method: "GET",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
							siteid: state.siteId,
							authorization: authData.accesssToken,
							locationid: state.locationId,
						},
					};
					const ultrasoundResponse = await fetch(
						`${process.env.REACT_APP_API_URL}/api/sessionTypes/2`,
						ultrasoundsRequest
					);
					const ultrasoundsData = await ultrasoundResponse.json();
					let filterMassageData;
					if (ultrasoundResponse.ok) {
						const servicesUltrasounds = [...ultrasoundsData.services];

						const filterServicesBySeeOnline = servicesUltrasounds
							.filter((i) => {
								if (state.siteId === "557418" && state.locationId === "2") {
									let specialpromotion25min = i.name
										.toLowerCase()
										.replace(/[-.()+\s]/g, "")
										.search("specialpromotion25min");
									if (specialpromotion25min !== 0) return i.seeOnLine === true;
								} else {
									return i.seeOnLine === true;
								}
							})
							.map((i) => {
								return i.name;
							})
							.sort((a, b) => {
								if (a > b) return 1;
								if (a < b) return -1;
								return 0;
							});

						if (
							state.siteId === "557418" ||
							state.siteId === "902886" ||
							state.siteId === "5721382" ||
							state.siteId === "5721159" ||
							state.siteId === "888809"
						) {
							const massageRequest = {
								method: "GET",
								headers: {
									"Content-type": "application/json; charset=UTF-8",
									siteid: state.siteId,
									authorization: authData.accesssToken,
									locationid: state.locationId,
								},
							};
							const massageResponse = await fetch(
								`${process.env.REACT_APP_API_URL}/api/sessionTypes/3`,
								massageRequest
							);
							const massageData = await massageResponse.json();
							filterMassageData = massageData.services.filter((i) => {
								return i.seeOnLine === true;
							});
						}
						const ultrasounds = [];
						const massages = [];
						const existingServices = [];

						filterServicesBySeeOnline.forEach((service) => {
							const serviceTypeId = getServiceId(service, ultrasoundsData.services);
							if (serviceTypeId !== "") {
								const servicePrice = getPrice(service);
								const serviceObject = {
									sessionTypeId: serviceTypeId,
									name: service,
									price: servicePrice,
								};
								existingServices.push(serviceObject);
							}
						});

						const ultrasoundServices = {
							services: existingServices,
						};

						ultrasoundServices.services.forEach((item) => {
							const mutableItem = {
								value: item.sessionTypeId,
								label: item.name,
							};
							ultrasounds.push(mutableItem);
						});

						setUltrasounds(ultrasounds);
						setConsultedUltrasounds(ultrasoundsData.services);

						if (
							state.siteId === "557418" ||
							state.siteId === "902886" ||
							state.siteId === "5721382" ||
							state.siteId === "5721159" ||
							state.siteId === "888809"
						) {
							filterMassageData.forEach((item) => {
								const mutableItem = {
									value: item.sessionTypeId,
									label: item.name,
								};
								massages.push(mutableItem);
							});
						}

						const displayableServices = [
							{
								label: "Ultrasounds",
								options: ultrasounds,
							},
							{
								label: "Massages",
								options: orderServices(massages),
							},
						];
						setServices(displayableServices);
					}
				}
			} catch (error) {
				console.error(JSON.stringify(error));
			}
		}
		getSitesInfo();
		getServices();
		const arrayOfWeeks = [];
		arrayOfWeeks.push({
			value: "I don't know",
			label: "I don't know",
		});
		for (let index = 5; index < 43; index++) {
			const element = {
				value: "" + index,
				label: "" + index,
			};
			arrayOfWeeks.push(element);
		}
		setWeeks(arrayOfWeeks);
	}, []);

	const getFirstAvailability = (availabilities) => {
		return availabilities.reduce((a, b) => {
			let minDate;
			if (a && b) a.startDateTime < b.startDateTime ? (minDate = a) : (minDate = b);
			return minDate;
		}, {});
	};

	useEffect(() => {
		if (state.authorization === "") {
			return;
		}
		const getAvailability = async () => {
			setState((state) => ({
				...state,
				availabilityRequestStatus: "loading",
			}));

			try {
				const sessionTypeId = "" + clientState.sessionTypeId;
				const queryStartDate = moment(state.startDate).format("MM/DD/YYYY").toString();

				const availabilityRequest = {
					method: "GET",
					headers: {
						"Content-type": "application/json; charset=UTF-8",
						siteid: state.siteId,
						authorization: state.authorization,
						locationid: state.locationId,
					},
				};

				const availabilityResponse = await fetch(
					`${process.env.REACT_APP_API_URL}/api/book/sites/${state.siteId}/locations/${state.locationId}/schedule?sessionTypeId=${sessionTypeId}&startDate=${queryStartDate}&endDate=${queryStartDate}`,
					availabilityRequest
				);

				const availabilityData = await availabilityResponse.json();
				if (availabilityResponse.ok) {
					const rooms = availabilityData.schedule.map((room) => {
						const appointments = [];
						room.appointments.forEach((appointment) => {
							const mutableAppointment = appointment;
							const segment = new Date(mutableAppointment.startDateTime).toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							});
							mutableAppointment.segment = segment;
							appointments.push(mutableAppointment);
						});

						const listApointments = [];
						availabilityData.schedule.forEach((i) => {
							listApointments.push(i.appointments[0]);
						});

						const searchFirstAppointment = listApointments.reduce((acc, app) => {
							acc[app?.startDateTime] = ++acc[app?.startDateTime] || 0;
							return acc;
						}, {});

						const firstDatesMatches = listApointments.filter((app) => {
							return searchFirstAppointment[app?.startDateTime];
						});

						let firstDates = {
							matches: firstDatesMatches.length !== 0,
							severalRooms: listApointments.length > 1,
						};

						const roomReturn = {
							staffId: room.id,
							staffName: room.name,
							unavailabilities: room.unavailabilities,
							availabilities: room.availabilities,
							roomBlocks: [],
							appointments: appointments,
							firstDatesMatches: firstDates,
						};
						return roomReturn;
					});

					const displayableRooms = [];
					rooms.forEach((room) => {
						const mutableBlocks = [...blocks];
						const availableBlocks = [];
						const roomBlocks = mutableBlocks.map((block) => {
							const mutableBlock = { ...block };
							const addTwelve = mutableBlock.segment.includes("PM");
							const rawHours = parseInt(mutableBlock.segment.split(" ")[0].split(":")[0]);
							const hours = addTwelve && rawHours !== 12 ? rawHours + 12 : rawHours;
							const minutes = parseInt(mutableBlock.segment.split(" ")[0].split(":")[1]);
							const stringDate = moment(state.startDate).format("MM/DD/YYYY").toString();
							const startDateTime = moment(stringDate)
								.add(hours, "hours")
								.add(minutes, "minutes")
								.format("YYYY-MM-DD[T]HH:mm:ss");
							const endDateTime = moment(startDateTime).add(30, "minutes").format("YYYY-MM-DD[T]HH:mm:ss");
							mutableBlock.startDateTime = startDateTime;
							mutableBlock.endDateTime = endDateTime;
							const blockDate = moment(stringDate).add(hours, "hours").add(minutes, "minutes").toString();
							mutableBlock.blockDate = blockDate;
							mutableBlock.selected = false;
							let available = false;
							let firstBlockTime;
							const isToday = moment().format("MM/DD/YYYY");
							const localStartTime = moment(localTime.date).format("YYYY-MM-DD[T]HH:mm:ss");
							const localEndTime = moment(localTime.date).add(2, "hours").format("YYYY-MM-DD[T]HH:mm:ss");

							const selectedDateBlock = moment(state.startDate).format("MM/DD/YYYY");
							const firstAppointment = room.appointments[0]?.startDateTime;
							const firstAvailability = getFirstAvailability(room.availabilities)?.startDateTime;

							const hourDifferenceAppt = moment(firstAppointment).diff(moment(localStartTime), "hours");
							const hourDifferenceBlocks = moment(blockDate).diff(moment(localStartTime), "hours");

							if (isToday === selectedDateBlock) {
								if (room.firstDatesMatches.severalRooms) {
									if (room.firstDatesMatches.matches) {
										if (blockDate > moment(localStartTime).toString()) {
											firstBlockTime = moment(firstAvailability).toString();
										}
									}

									if (!room.firstDatesMatches.matches) {
										if (blockDate > moment(localStartTime).toString()) {
											firstBlockTime = moment(firstAppointment).toString();
										}
									}
								}

								if (!room.firstDatesMatches.severalRooms) {
									if (firstAppointment !== firstAvailability) {
										if (hourDifferenceAppt <= 2 && blockDate > moment(localStartTime).toString()) {
											firstBlockTime = moment(firstAppointment).toString();
										} else {
											if (hourDifferenceBlocks >= 2) {
												firstBlockTime = moment(localEndTime).toString();
											}
										}
									}

									if (firstAppointment === firstAvailability) {
										if (
											blockDate > moment(localStartTime).toString() &&
											blockDate > moment(firstAppointment).toString()
										) {
											firstBlockTime = moment(localStartTime).toString();
										}
									}
								}
							} else {
								firstBlockTime = moment(state.startDate).add("08", "hours").add("30", "minutes").toString();
							}

							room.availabilities.forEach((availabilityBlock) => {
								available =
									available +
									moment(blockDate).isBetween(
										availabilityBlock.startDateTime,
										availabilityBlock.endDateTime,
										undefined,
										"[)"
									) *
										(blockDate > firstBlockTime);
							});

							room.unavailabilities.forEach((unavailabilityBlock) => {
								available =
									available *
									!moment(blockDate).isBetween(
										unavailabilityBlock.StartDateTime,
										unavailabilityBlock.EndDateTime,
										undefined,
										"[)"
									);
							});
							const blockAppointment = room.appointments.find((appointment) =>
								moment(blockDate).isBetween(appointment.startDateTime, appointment.endDateTime, undefined, "[)")
							);

							mutableBlock.appointment = blockAppointment === undefined ? {} : blockAppointment;

							mutableBlock.available = Boolean(available);

							if (blockAppointment === undefined && available) {
								availableBlocks.push(mutableBlock);
							}

							return mutableBlock;
						});

						const returnRoom = {
							staffId: room.staffId,
							staffName: room.staffName,
							unavailabilities: room.unavailabilities,
							availabilities: room.availabilities,
							roomBlocks: roomBlocks,
							availableBlocks: availableBlocks,
						};
						displayableRooms.push(returnRoom);
					});

					const availableBlocksForDisplay = [];
					displayableRooms.forEach((room) => {
						room.availableBlocks.forEach((block) => {
							const foundedBlock = availableBlocksForDisplay.find((availableBlock) => availableBlock.id === block.id);
							if (foundedBlock !== undefined) {
								const mutableBlock = foundedBlock;
								mutableBlock.staffId.push(room.staffId);
								mutableBlock.count++;
							} else {
								const mutableBlock = { ...block };
								mutableBlock.staffId = [room.staffId];
								mutableBlock.count = 1;
								availableBlocksForDisplay.push(mutableBlock);
							}
						});
					});
					const sortedBlocks = availableBlocksForDisplay.sort((a, b) =>
						a.startDateTime > b.startDateTime ? 1 : b.startDateTime > a.startDateTime ? -1 : 0
					);

					setFirstLoad(false);
					setAvailableBlocks(sortedBlocks);

					setState((state) => ({
						...state,
						availabilityRequestStatus: "ready",
					}));
				} else {
					setState((state) => ({
						...state,
						availabilityRequestStatus: "no-data-found",
						message: JSON.stringify(availabilityData),
					}));
				}
			} catch (error) {
				setState((state) => ({
					...state,
					status: "error",
					availabilityRequestStatus: "error",
					message: "Onload page Error: " + JSON.stringify(error.message),
				}));
			}
		};
		if (clientState.sessionTypeId !== "") getAvailability();
	}, [state.startDate, state.locationId, state.siteId, state.authorization, clientState.sessionTypeId]);

	const previousStep = (currentStep) => {
		switch (currentStep) {
			case "availability":
				setState((state) => ({
					...state,
					step: "registerForm",
					block: {
						id: "",
					},
					appointmentRequestStatus: "IDLE",
				}));
				break;
			case "summary":
				setState((state) => ({
					...state,
					step: "availability",
					block: {
						id: "",
					},
					appointmentRequestStatus: "IDLE",
				}));
				break;
			default:
				break;
		}
	};

	const {
		control,
		watch,
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	useEffect(() => {
		updateDimensions();

		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const updateDimensions = () => {
		const width = window.innerWidth;
		setWindowWidth(width);
	};

	const getBGCombo = (serviceName, servicesArray) => {
		const sessionTypeName = serviceName;
		let purifiedServiceName = "";
		let serviceId = "";
		const regex = /[-.()+\s]/g;

		if (sessionTypeName.toLowerCase().includes("$")) {
			const indexPrice = sessionTypeName.toLowerCase().indexOf("$");
			const remaining = sessionTypeName.toLowerCase().slice(0, indexPrice);
			purifiedServiceName = remaining.replace(regex, "");
		}

		servicesArray.forEach((serviceItem) => {
			if (serviceItem.name.toLowerCase().includes("$")) {
				const indexAddon = serviceItem.name.toLowerCase().indexOf("$");
				const remainingConsulted = serviceItem.name.toLowerCase().slice(0, indexAddon);
				const purifiedConsulted = remainingConsulted.replace(regex, "");
				if (purifiedServiceName === purifiedConsulted) {
					serviceId = serviceItem.sessionTypeId;
				}
			}
		});
		return serviceId;
	};

	const onFormSubmit = async (data) => {
		scrollParenTop();
		let sessionTypeId = data.service.value;
		let sessionTypeName = data.service.label;

		setClientState((clientState) => ({
			...clientState,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone.replace(/[^0-9]/gi, ""),
			weeks: data.weeks.label,
			sessionTypeId: sessionTypeId,
			sessionTypeName: sessionTypeName,
			language: state.language,
		}));

		setState((state) => ({
			...state,
			// step: "addons",
			step: "availability",
		}));

		if (clientState.clientRequestStatus === "loading") {
			return;
		}
		try {
			let clientId = "n/a";
			setClientState((clientState) => ({
				...clientState,
				clientRequestStatus: "loading",
			}));
			const searchClientsRequest = {
				method: "GET",
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					authorization: state.authorization,
					siteid: state.siteId,
				},
			};
			const searchClientsResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/api/clients/clients?searchText=${data.phone.replace(/[^0-9]/gi, "")}`,
				searchClientsRequest
			);
			const searchClientsData = await searchClientsResponse.json();
			if (searchClientsResponse.ok) {
				setSendForm(true);

				if (
					data.firstName + " " + data.lastName === searchClientsData.clients[0].name &&
					searchClientsData.clients[0].email === data.email &&
					searchClientsData.clients[0].phone.replace(/[^0-9]/gi, "") === data.phone.replace(/[^0-9]/gi, "")
				) {
					setClientState((clientState) => ({
						...clientState,
						clientRequestStatus: "CLIENT-FOUND",
						clientObject: searchClientsData.clients[0],
						searchResults: searchClientsData.clients,
					}));
					clientId = searchClientsData.clients[0].clientId;
				} else {
					setClientState((clientState) => ({
						...clientState,
						clientRequestStatus: "CLIENT-FOUND-DIFFERENT",
						clientObject: searchClientsData.clients[0],
						searchResults: searchClientsData.clients,
					}));
					clientId = searchClientsData.clients[0].clientId;
					setLeadState((leadState) => ({
						...leadState,
						clientFound: false,
					}));
				}
			} else {
				setClientState((clientState) => ({
					...clientState,
					clientRequestStatus: "CLIENT-NOT-FOUND",
					searchResults: [],
				}));
				setLeadState((leadState) => ({
					...leadState,
					clientFound: false,
				}));
			}
			const leadPayload = {
				siteId: state.siteId,
				name: data.firstName + " " + data.lastName,
				mobilePhone: data.phone.replace(/[^0-9]/gi, ""),
				email: data.email,
				service: sessionTypeName,
				clientId: clientId === undefined ? "n/a" : clientId,
				dateTime: moment().format("YYYY-MM-DD[T]HH:mm:ss").toString(),
				step: 1,
				language: state.language,
			};
			const leadRequest = {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					authorization: state.authorization,
					siteid: state.siteId,
				},
				body: JSON.stringify(leadPayload),
			};
			const leadResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/book/clients`, leadRequest);
			const leadData = await leadResponse.json();
			if (leadResponse.ok) {
				setLeadState((leadState) => ({
					...leadState,
					clientFound: true,
					leadRegistered: true,
					partititonKey: leadData.partititonKey,
					orderKey: leadData.orderKey,
				}));
			} else {
				setLeadState((leadState) => ({
					...leadState,
					clientFound: true,
					leadRegistered: false,
				}));
				console.log("Error registering lead");
				console.error(leadData);
			}
		} catch (error) {
			setState((state) => ({
				...state,
				status: "error",
				message: "Client request Error: " + JSON.stringify(error.message),
			}));
		}
	};

	const onChangeServices = (service) => {
		setSeletedService(service);
		setAddBabysGrowth(false);
		setAddHeartbeatBuddies(false);
		setAdd8kRealisticView(false);
	};

	const handleAddonsSelected = (e) => {
		const addons = e;
		setSelectedOptionAddons(addons);
		setHoverIndexBabyGrow(false);
		setHoverIndexHearthbeat(false);
		setHoverIndex8kRealisticView(false);
	};

	const handleFixedServices = () => {
		const service = {
			specialPromotion25min: seletedService
				? seletedService?.label
						?.toLowerCase()
						.replace(/[-.()+\s]/g, "")
						.search("specialpromotion25min")
				: "",
			genderdetermination: seletedService
				? seletedService?.label
						?.toLowerCase()
						.replace(/[-.()+\s]/g, "")
						.search("genderdetermination")
				: "",
			earlypregnancy: seletedService
				? seletedService?.label
						?.toLowerCase()
						.replace(/[-.()+\s]/g, "")
						.search("earlypregnancy")
				: "",
			meetyourbaby25: seletedService
				? seletedService?.label
						?.toLowerCase()
						.replace(/[-.()+\s]/g, "")
						.search("meetyourbaby25")
				: "",
			meetyourbaby15: seletedService
				? seletedService?.label
						?.toLowerCase()
						.replace(/[-.()+\s]/g, "")
						.search("meetyourbaby15")
				: "",
		};
		setFixedServices((fixedServices) => ({
			...fixedServices,
			specialPromotion25min: service.specialPromotion25min === 0,
			genderdetermination: service.genderdetermination === 0,
			earlypregnancy: service.earlypregnancy === 0,
			meetyourbaby25: service.meetyourbaby25 === 0,
			meetyourbaby15: service.meetyourbaby15 === 0,
		}));
	};
	useEffect(() => {
		handleFixedServices();
	}, [seletedService, services]);

	useEffect(() => {
		if (selectedOptionAddons) {
			let formattingSelectedOptionAddons;

			if (fixedServices.genderdetermination) {
				formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => {
					return i.value !== "8K Realistic View";
				});
				setSelectedOptionAddons(formattingSelectedOptionAddons);
			} else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {
				formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => {
					return i.value !== "Baby's Growth" && i.value !== "8K Realistic View";
				});
				setSelectedOptionAddons(formattingSelectedOptionAddons);
			} else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {
				setSelectedOptionAddons(selectedOptionAddons);
			} else {
				setSelectedOptionAddons([]);
			}
		}
	}, [seletedService, fixedServices]);

	const addOnsToMeetYourBaby = [
		{
			value: "Heartbeat Buddies",
			label: (
				<div className="d-flex col-12">
					<div className="col-11">
						<span>Heartbeat Buddies</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndexHearthbeat(true)}
						onMouseLeave={() => setHoverIndexHearthbeat(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faInfo}
							onClick={(e) => {
								setModalHearthbeat(true);
							}}
						/>
					</div>
				</div>
			),
		},
		{
			value: "Baby's Growth",
			label: (
				<div className="col-12 d-flex">
					<div className="col-11">
						<span>Baby's Growth</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndexBabyGrow(true)}
						onMouseLeave={() => setHoverIndexBabyGrow(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon icon={faInfo} onClick={(e) => setModalBabyGrow(true)} />
					</div>
				</div>
			),
		},
		{
			value: "8K Realistic View",
			label: (
				<div className="col-12 d-flex">
					<div className="col-11">
						<span>8K Realistic View</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndex8kRealisticView(true)}
						onMouseLeave={() => setHoverIndex8kRealisticView(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon icon={faInfo} onClick={(e) => setModal8kRealisticView(true)} />
					</div>
				</div>
			),
		},
	];
	const addOnsToGenderDetermination = [
		{
			value: "Heartbeat Buddies",
			label: (
				<div className="d-flex col-12">
					<div className="col-11">
						<span>Heartbeat Buddies</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndexHearthbeat(true)}
						onMouseLeave={() => setHoverIndexHearthbeat(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon
							icon={faInfo}
							onClick={(e) => {
								setModalHearthbeat(true);
							}}
						/>
					</div>
				</div>
			),
		},
		{
			value: "Baby's Growth",
			label: (
				<div className="col-12 d-flex">
					<div className="col-11">
						<span>Baby's Growth</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndexBabyGrow(true)}
						onMouseLeave={() => setHoverIndexBabyGrow(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon icon={faInfo} onClick={(e) => setModalBabyGrow(true)} />
					</div>
				</div>
			),
		},
	];
	const addOnsToEarlyPregnancy = [
		{
			value: "Heartbeat Buddies",
			label: (
				<div className="d-flex col-12">
					<div className="col-11">
						<span>Heartbeat Buddies</span>
					</div>
					<div
						className="col-1"
						onMouseOver={() => setHoverIndexHearthbeat(true)}
						onMouseLeave={() => setHoverIndexHearthbeat(false)}
						style={{ cursor: "pointer" }}
					>
						<FontAwesomeIcon icon={faInfo} onClick={(e) => setModalHearthbeat(true)} />
					</div>
				</div>
			),
		},
	];

	useEffect(() => {
		let babyGrow;
		let hearthbeat;
		let realisticView;

		if (selectedOptionAddons) {
			babyGrow = selectedOptionAddons.find((i) => i.value === "Baby's Growth");
			hearthbeat = selectedOptionAddons.find((i) => i.value === "Heartbeat Buddies");
			realisticView = selectedOptionAddons.find((i) => i.value === "8K Realistic View");
		}
		if (fixedServices.genderdetermination) {
			setAddOns(addOnsToGenderDetermination);

			if (realisticView === undefined) setAdd8kRealisticView(false);

			if (hearthbeat === undefined) {
				setAddHeartbeatBuddies(false);
				addOnsToGenderDetermination[0].label = addOnsToGenderDetermination[0].label;
			} else {
				setAddHeartbeatBuddies(true);
				hearthbeat.label = <span>Heartbeat Buddies</span>;
			}
			if (babyGrow === undefined) {
				setAddBabysGrowth(false);
				addOnsToGenderDetermination[1].label = addOnsToGenderDetermination[1].label;
			} else {
				setAddBabysGrowth(true);
				babyGrow.label = <span>Baby's Growth</span>;
			}
		} else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {
			setAddOns(addOnsToMeetYourBaby);

			if (hearthbeat === undefined) {
				setAddHeartbeatBuddies(false);
				addOnsToMeetYourBaby[0].label = addOnsToMeetYourBaby[0].label;
			} else {
				setAddHeartbeatBuddies(true);
				hearthbeat.label = <span>Heartbeat Buddies</span>;
			}
			if (babyGrow === undefined) {
				setAddBabysGrowth(false);
				addOnsToMeetYourBaby[1].label = addOnsToMeetYourBaby[1].label;
			} else {
				setAddBabysGrowth(true);
				babyGrow.label = <span>Baby's Growth</span>;
			}
			if (realisticView === undefined) {
				setAdd8kRealisticView(false);
				addOnsToMeetYourBaby[2].label = addOnsToMeetYourBaby[2].label;
			} else {
				setAdd8kRealisticView(true);
				realisticView.label = <span>8K Realistic View</span>;
			}
		} else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {
			setAddOns(addOnsToEarlyPregnancy);

			if (babyGrow === undefined) setAddBabysGrowth(false);

			if (realisticView === undefined) setAdd8kRealisticView(false);

			if (hearthbeat === undefined) {
				setAddHeartbeatBuddies(false);
				addOnsToEarlyPregnancy[0].label = addOnsToEarlyPregnancy[0].label;
			} else {
				setAddHeartbeatBuddies(true);
				hearthbeat.label = <span>Heartbeat Buddies</span>;
			}
		} else {
			setAddHeartbeatBuddies(false);
			setAdd8kRealisticView(false);
			setAddBabysGrowth(false);
			setAddOns([]);
		}
	}, [seletedService, selectedOptionAddons, fixedServices, ultrasounds]);

	useEffect(() => {
		let newSessionTypeId = clientState.sessionTypeId;
		let newSessionTypeName = clientState.sessionTypeName;
		const costBabysGrowth = 29;

		if (fixedServices.meetyourbaby25 && addBabysGrowth) {
			const costMeetYourbaby25 = seletedService.label.match(/(\d+)/g);
			const costMeetYourbaby25PlusBabysGrowth = parseFloat(costMeetYourbaby25[2]) + costBabysGrowth;

			newSessionTypeId = getBGCombo(
				`Meet Your Baby - 25 Min 5D/HD + Baby's Growth $${costMeetYourbaby25PlusBabysGrowth}`,
				consultedUltrasounds
			);
			newSessionTypeName = `Meet Your Baby - 25 Min 5D/HD + Baby's Growth $${costMeetYourbaby25PlusBabysGrowth}`;
		}

		if (fixedServices.meetyourbaby15 && addBabysGrowth) {
			const costMeetYourbaby15 = seletedService.label.match(/(\d+)/g);
			const costMeetYourbaby15PlusBabysGrowth = parseFloat(costMeetYourbaby15[2]) + costBabysGrowth;

			newSessionTypeId = getBGCombo(
				`Meet Your Baby - 15 Min 5D/HD + Baby's Growth $${costMeetYourbaby15PlusBabysGrowth}`,
				consultedUltrasounds
			);
			newSessionTypeName = `Meet Your Baby - 15 Min 5D/HD + Baby's Growth $${costMeetYourbaby15PlusBabysGrowth}`;
		}

		if (fixedServices.genderdetermination && addBabysGrowth) {
			const costGenderDetermination = seletedService.label.match(/(\d+)/g);
			const costGenderPlusBabysGrowth = parseFloat(costGenderDetermination[0]) + costBabysGrowth;

			newSessionTypeId = getBGCombo(
				`Gender Determination  + Baby's Growth - $${costGenderPlusBabysGrowth}  `,
				consultedUltrasounds
			);
			newSessionTypeName = `Gender Determination  + Baby's Growth - $${costGenderPlusBabysGrowth}  `;
		}

		setClientState((clientState) => ({
			...clientState,
			sessionTypeId: newSessionTypeId,
			sessionTypeName: newSessionTypeName,
		}));
	}, [sendForm, clientState.sessionTypeName, clientState.sessionTypeId, addBabysGrowth, seletedService, fixedServices]);

	useEffect(() => {
		let formattingSelectedOptionAddons;
		if (modalHearthbeat) {
			formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => {
				return i.value !== "Heartbeat Buddies";
			});
			setSelectedOptionAddons(formattingSelectedOptionAddons);
			setAddHeartbeatBuddies(false);
		}
		if (modalBabyGrow) {
			formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => {
				return i.value !== "Baby's Growth";
			});
			setSelectedOptionAddons(formattingSelectedOptionAddons);
			setAddBabysGrowth(false);
		}
		if (modal8kRealisticView) {
			formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => {
				return i.value !== "8K Realistic View";
			});
			setSelectedOptionAddons(formattingSelectedOptionAddons);
			setAdd8kRealisticView(false);
		}
	}, [modalBabyGrow, modalHearthbeat, modal8kRealisticView]);

	useEffect(() => {
		let val = false;
		if (errors.firstName) {
			val = true;
		}
		if (errors.lastName) {
			val = true;
		}
		if (errors.email) {
			val = true;
		}
		if (errors.phone) {
			val = true;
		}
		if (errors.weeks) {
			val = true;
		}
		if (errors.service) {
			val = true;
		}
		if (errors.temsCheckbox) {
			val = true;
		}
		if (clickButtonForm) {
			if (val) {
				setStepOne("invalid");
			} else {
				setStepOne("success");
			}
		}
	}, [
		errors.firstName,
		errors.lastName,
		errors.email,
		errors.phone,
		errors.weeks,
		errors.service,
		errors.temsCheckbox,
		clickButtonForm,
	]);

	return (
		<div className="container">
			<StepProgress stepOne={stepOne} stepTwo={stepTwo} stepThree={stepThree} />

			{state.step === "registerForm" && (
				<RegisterForm
					state={state}
					setState={setState}
					params={params}
					weeks={weeks}
					services={services}
					selectedOptionAddons={selectedOptionAddons}
					control={control}
					register={register}
					handleSubmit={handleSubmit}
					errors={errors}
					Controller={Controller}
					onFormSubmit={onFormSubmit}
					onChangeServices={onChangeServices}
					handleAddonsSelected={handleAddonsSelected}
					width={width}
					addOns={addOns}
					hoverIndexBabyGrow={hoverIndexBabyGrow}
					hoverIndexHearthbeat={hoverIndexHearthbeat}
					hoverIndex8kRealisticView={hoverIndex8kRealisticView}
					modalHearthbeat={modalHearthbeat}
					setModalHearthbeat={setModalHearthbeat}
					modalBabyGrow={modalBabyGrow}
					setModalBabyGrow={setModalBabyGrow}
					modal8kRealisticView={modal8kRealisticView}
					setModal8kRealisticView={setModal8kRealisticView}
					setClickButtonForm={setClickButtonForm}
				/>
			)}

			{state.step === "availability" && (
				<SelectTimeAppointment
					setStepTwo={setStepTwo}
					previousStep={previousStep}
					state={state}
					availableBlocks={availableBlocks}
					setState={setState}
					firstLoad={firstLoad}
					setSelectBlock={setSelectBlock}
					leadState={leadState}
					setLeadState={setLeadState}
					scrollParenTop={scrollParenTop}
					selectedBlock={selectedBlock}
				/>
			)}

			{state.step === "summary" && (
				<BookAppointment
					state={state}
					clientState={clientState}
					addHeartbeatBuddies={addHeartbeatBuddies}
					add8kRealisticView={add8kRealisticView}
					setStepThree={setStepThree}
					googleTrackBooking={googleTrackBooking}
					setState={setState}
					setClientState={setClientState}
					selectedOptionAddons={selectedOptionAddons}
					localTime={localTime}
					leadState={leadState}
					setLeadState={setLeadState}
					previousStep={previousStep}
				/>
			)}
		</div>
	);
}

export default App;
