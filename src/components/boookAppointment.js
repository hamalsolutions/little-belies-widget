import React, { useEffect } from "react";
import moment from "moment";
import { PropTypes } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { removeTags } from "../config/constans";
import { getIp } from "../services/external";

function BookAppointment({
	state,
	clientState,
	addHeartbeatBuddies,
	add8kRealisticView,
	setStepThree,
	googleTrackBooking,
	setState,
	setClientState,
	selectedOptionAddons,
	localTime,
	leadState,
	setLeadState,
	previousStep,
}) {
	const bypass = false;

	useEffect(async () => {
		const ip = await getIp();
		setClientState((clientState) => ({
			...clientState,
			ipAddress: ip,
		}));
	}, [clientState.ipAddress]);

	const bookAppointment = async () => {
		setStepThree("success");

		if (state.appointmentRequestStatus === "loading") {
			return;
		}
		try {
			if (bypass) {
				googleTrackBooking({ name: "name", service: "service", date: "date", time: "time" });
				setState((state) => ({
					...state,
					appointmentRequestStatus: "BOOK-APPOINTMENT-OK",
				}));
				return;
			}
			setState((state) => ({
				...state,
				appointmentRequestStatus: "loading",
			}));

			let createAppointment = false;
			let clientObject = { ...clientState.clientObject };

			if (clientState.clientRequestStatus === "CLIENT-NOT-FOUND") {
				try {
					const payload = {
						firstName: clientState.firstName,
						lastName: clientState.lastName,
						mobilePhone: clientState.phone.replace(/[^0-9]/gi, ""),
						email: clientState.email,
					};
					const createClientRequest = {
						method: "POST",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
							authorization: state.authorization,
							siteid: state.siteId,
						},
						body: JSON.stringify(payload),
					};
					const createClientResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, createClientRequest);
					const createClientData = await createClientResponse.json();
					if (createClientResponse.ok) {
						const createdClient = {
							clientId: createClientData.clientId,
							name: createClientData.name,
							phone: createClientData.phone.replace(/[^0-9]/gi, ""),
							email: createClientData.email,
						};
						setClientState((clientState) => ({
							...clientState,
							createClientRequestStatus: "CREATED",
							clientObject: createdClient,
						}));
						createAppointment = true;
						clientObject = { ...createdClient };
					} else {
						setClientState((clientState) => ({
							...clientState,
							createClientRequestStatus: "ERROR",
							appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
							message: "Create request Error: " + JSON.stringify(createClientData),
						}));
						setState((state) => ({
							...state,
							appointmentRequestStatus: "IDLE",
						}));
						createAppointment = false;
					}
				} catch (e) {
					setClientState((clientState) => ({
						...clientState,
						createClientRequestStatus: "ERROR",
						appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
						message: "Create request Error: " + JSON.stringify(e),
					}));
					setState((state) => ({
						...state,
						appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
						status: "BOOK-APPOINTMENT-FAIL",
						message: "Client request Error: " + JSON.stringify(e.message),
					}));
					createAppointment = false;
				}
			}

			if (clientState.clientRequestStatus === "CLIENT-FOUND-DIFFERENT" || clientState.clientRequestStatus === "CLIENT-FOUND") {
				createAppointment = true;
			}

			if (createAppointment) {
				const payload = {
					sessionTypeId: "" + clientState.sessionTypeId,
					locationId: parseInt(state.locationId),
					staffId: state.block.staffId[0],
					clientId: clientObject.clientId,
					clientData: { clientName: `${clientState.firstName}  ${clientState.lastName}`, email: clientState.email, mobilePhone: clientState.phone.replace(/[^0-9]/gi, "") },
					notes:
						"Weeks: " +
						clientState.weeks +
						"\n" +
						"Language: " +
						state.language +
						"\n" +
						(addHeartbeatBuddies ? "Add Heartbeat Buddies" : "") +
						(addHeartbeatBuddies ? "\n" : "") +
						(add8kRealisticView ? "Add 8k Realistic View" : ""),
					startDateTime: moment(state.block.blockDate).format("YYYY-MM-DD[T]HH:mm:ss").toString(),
					ipAddress: clientState.ipAddress,
				};
				console.log(clientState.ipAddress);

				const bookAppointmentRequest = {
					method: "POST",
					headers: {
						"Content-type": "application/json; charset=UTF-8",
						authorization: state.authorization,
						siteid: state.siteId,
					},
					body: JSON.stringify(payload),
				};
				const bookAppointmentResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments`, bookAppointmentRequest);
				const bookAppointmentData = await bookAppointmentResponse.json();
				if (bookAppointmentResponse.ok) {
					const mailBody = {
						locationName: `Little Bellies Pregnancy Spa - ${state.city}`,
						web: "www.littlebelliesspa.com/en/home/",
						locationPhone: state.phone,
						locationAddress: removeTags(state.address),
						howArrive: removeTags(state.howtoarrive),
						appointmentId: bookAppointmentData.Appointment.Id,
						clientName: clientState.firstName + " " + clientState.lastName,
						clientEmail: clientState.email,
						serviceName: clientState.sessionTypeName,
						startDateTime: moment(state.block.blockDate).format("YYYY-MM-DD[T]HH:mm:ss").toString(),
					};
					const postMail = {
						method: "POST",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
						},
						body: JSON.stringify(mailBody),
					};
					const mailResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/book/sendMail`, postMail);

					if (!mailResponse.ok) {
						console.error(mailResponse);
					}

					let nameListAddons = [];
					if (selectedOptionAddons) {
						nameListAddons = selectedOptionAddons.map((i) => {
							return i.value;
						});
					}

					const dynamoPayload = {
						id: "" + bookAppointmentData.Appointment.Id,
						sessionTypeId: "" + bookAppointmentData.Appointment.SessionTypeId,
						sessionTypeName: clientState.sessionTypeName,
						serviceName: clientState.sessionTypeName,
						locationId: "" + bookAppointmentData.Appointment.LocationId,
						staffId: "" + bookAppointmentData.Appointment.StaffId,
						clientId: "" + bookAppointmentData.Appointment.ClientId,
						notes: bookAppointmentData.Appointment.Notes,
						startDateTime: bookAppointmentData.Appointment.StartDateTime,
						status: bookAppointmentData.Appointment.Status,
						firstAppointment: bookAppointmentData.Appointment.FirstAppointment,
						programId: bookAppointmentData.Appointment.ProgramId,
						addOns: nameListAddons,
						bookDate: moment(localTime.date).format("MM/DD/YYYY"),
						account: true,
						bookDateTime: moment(localTime.date).format("MM/DD/YYYY HH:mm:ss"),
						bookTimeUTC: moment.utc(localTime.date).toISOString().split("T")[1],
						servicePrice: clientState.sessionTypeName.includes("$") ? parseInt(clientState.sessionTypeName.split("$")[1]) : 0,
						siteId: state.siteId,
						source: "online",
						cbff: false,
						clientName: `${clientState.firstName}  ${clientState.lastName}`,
						email: clientState.email,
						mobilePhone: clientState.phone.replace(/[^0-9]/gi, ""),
						ipAddress: clientState.ipAddress,
						bookTime: moment(localTime.date).format("HH:mm"),
					};
					const putDynamo = {
						method: "PUT",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
						},
						body: JSON.stringify(dynamoPayload),
					};
					const dynamoResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/dynamoDB/appointments`, putDynamo);
					const dynamoData = await dynamoResponse.json();
					if (dynamoResponse.ok) {
						if (leadState.leadRegistered) {
							const leadPayload = {
								partititonKey: leadState.partititonKey,
								orderKey: leadState.orderKey,
							};
							const leadRequest = {
								method: "DELETE",
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
									leadDeleted: true,
								}));
								setState((state) => ({
									...state,
									appointmentRequestStatus: "BOOK-APPOINTMENT-OK",
								}));
							} else {
								setState((state) => ({
									...state,
									appointmentRequestStatus: "BOOK-APPOINTMENT-OK",
								}));
								setLeadState((leadState) => ({
									...leadState,
									leadDeleted: false,
								}));
								console.log("Error deleting lead");
								console.error(leadData);
							}
						}
						googleTrackBooking({
							name: clientState.firstName + " " + clientState.lastName,
							service: clientState.sessionTypeName,
							date: moment(state.block.blockDate).format("MM-DD-YYYY").toString(),
							time: moment(state.block.blockDate).format("hh:mm A").toString(),
						});
					} else {
						setState((state) => ({
							...state,
							appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
							message: JSON.stringify(dynamoData),
						}));
					}
				} else {
					setState((state) => ({
						...state,
						appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
						message: JSON.stringify(bookAppointmentData),
					}));
				}
			}
		} catch (error) {
			setState((state) => ({
				...state,
				status: "BOOK-APPOINTMENT-FAIL",
				message: "Client request Error: " + JSON.stringify(error.message),
			}));
		}
	};

	return (
		<div className="">
			<div className="row mt-4 gx-5">
				{state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
					<div className="col d-flex justify-content-between">
						<h1 className="h3 text-uppercase text-center">Your booking information</h1>
						<button className="btn btn-cta rounded-pill btn-sm px-3 m-2" onClick={() => previousStep("summary")}>
							BACK
						</button>
					</div>
				)}

				{state.appointmentRequestStatus !== "IDLE" && (
					<div className="row mt-4 mb-2">
						<div className="col text-center">
							{state.appointmentRequestStatus === "BOOK-APPOINTMENT-FAIL" && (
								<div className="d-block alert alert-danger text-center">
									<span>
										{" "}
										There has been an error booking your appointment, please try again, if the error persist please call this number:{" "}
										<a href={`tel:${state.phone}`}>{state.phone}</a> and we will get you sorted out{" "}
									</span>
								</div>
							)}
							{state.textMessageStatus === "TEXT-FAIL" && (
								<div className="d-block alert alert-warning">
									<span> {state.textMessage} </span>
								</div>
							)}
							{state.appointmentRequestStatus === "CLIENT-ERROR" && (
								<div className="d-block alert alert-danger">
									<span> {state.message} </span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="row w-50 mb-3 bg-light-container mx-auto p-2 justify-content-center">
				<div>
					{
						<>
							<div className="row my-3">
								<div className="col">
									<div>
										<b>Full Name:</b> {clientState.firstName + " " + clientState.lastName}
									</div>
								</div>
							</div>
							<div className="row mb-3">
								<div className="col">
									<div>
										<b>Service: </b>
										{clientState.sessionTypeName}
									</div>
								</div>
							</div>

							{addHeartbeatBuddies || add8kRealisticView ? (
								<div className="row mb-3">
									<div className="col">
										<div>
											<b>Addons: </b>
											{addHeartbeatBuddies && "Add Heartbeat Buddies "}
											{addHeartbeatBuddies && add8kRealisticView && "-"}
											{add8kRealisticView && " Add 8k Realistic View"}
										</div>
									</div>
								</div>
							) : (
								""
							)}

							<div className="row mb-3">
								<div className="col-auto">
									<div>
										<b>Date: </b>
										{moment(state.block.blockDate).format("MM-DD-YYYY").toString()}
									</div>
								</div>
								<div className="col-auto">
									<div>
										<b>Time: </b>
										{moment(state.block.blockDate).format("hh:mm A").toString()}
									</div>
								</div>
							</div>
							<div className="row mb-3">
								<div className="col">
									<div className="col">
										<b>Location Address: </b>
										{removeTags(state.address)}
									</div>
								</div>
							</div>
							<div className="row mb-3">
								<div className="col">
									<div>
										<b>How to Arrive: </b>
										{removeTags(state.howtoarrive)}
									</div>
								</div>
							</div>
							<div className="row mb-3">
								<div className="col">
									<div>
										<b>Location Phone: </b>
										<a href={`tel:${state.phone}`}>{state.phone}</a>
									</div>
								</div>
							</div>
						</>
					}

					{state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
						<>
							<div className="row my-2">
								<div className="col text-center">
									<div className="row mt-3">
										<div className="col text-center">
											<button type="button" disabled={!state.captchaReady} className="btn btn-cta-active rounded-pill px-3 mx-auto" onClick={bookAppointment}>
												{state.appointmentRequestStatus === "loading" && (
													<>
														<FontAwesomeIcon spin icon={faSpinner} /> Booking
													</>
												)}
												{state.appointmentRequestStatus !== "loading" && <>Book appointment</>}
											</button>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

BookAppointment.propTypes = {
	state: PropTypes.object.isRequired,
	clientState: PropTypes.object.isRequired,
	addHeartbeatBuddies: PropTypes.bool.isRequired,
	add8kRealisticView: PropTypes.bool.isRequired,
	setStepThree: PropTypes.func.isRequired,
	googleTrackBooking: PropTypes.func.isRequired,
	setState: PropTypes.func.isRequired,
	setClientState: PropTypes.func.isRequired,
	selectedOptionAddons: PropTypes.array,
	localTime: PropTypes.object.isRequired,
	leadState: PropTypes.object.isRequired,
	setLeadState: PropTypes.func.isRequired,
	previousStep: PropTypes.func.isRequired,
};

export default BookAppointment;
