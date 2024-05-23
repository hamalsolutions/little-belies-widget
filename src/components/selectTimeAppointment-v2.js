import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import DatePicker from "react-horizontal-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

function formatDate(dateString) {
	const date = new Date(dateString);
	const options = { hour: '2-digit', minute: '2-digit', hour12: true };
	return date.toLocaleTimeString(undefined, options);
}

const mockResponse = {
	bookeableSchedule: [
		{
			staffId: 9,
			startDateTime: "2024-05-24T10:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T10:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T11:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T11:15:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T11:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T11:45:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T12:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T12:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T14:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T14:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T15:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T15:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T16:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T16:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T17:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T17:30:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T18:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T19:00:00",
		},
		{
			staffId: 9,
			startDateTime: "2024-05-24T19:30:00",
		},
	],
};

const getAvailability = async ({ accesssToken, siteId, locationId, startDate, sessionTypeId }) => {
	const url = `${process.env.REACT_APP_API_URL}/api/sites/${siteId}/locations/${locationId}/bookeableSchedule?startDate=${startDate}&sessionTypeId=${sessionTypeId}`;
	const request = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			authorization: accesssToken,
		},
	};
	try {
		const response = await fetch(url, request);

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}
		const data = await response.json();
		return data.bookeableSchedule;
	} catch (error) {
		console.error("Error fetching availability:", error);
		throw error;
	}
};

function SelectTimeAppointmentV2({ setStepTwo, previousStep, state, setState, setSelectBlock, leadState, setLeadState, scrollParenTop, selectedBlock, sessionTypeId }) {
	const [bookable, setBookable] = useState(null);
	const [selected, setSelected] = useState(null);
	const [firstLoad, setFirstLoad] = useState(true);


	useEffect(() => {

		const showLoading = () => {
			setState((state) => ({
				...state,
				availabilityRequestStatus: "loading",
			}));
		};
		const showReady = () => {
			setState((state) => ({
				...state,
				availabilityRequestStatus: "ready",
			}));
		};
		const fetchAvailability = async () => {
			try {
				const resp = await getAvailability({
					accesssToken: state.authorization,
					siteId: state.siteId,
					locationId: state.locationId,
					startDate: state.startDate,
					sessionTypeId: sessionTypeId,
				});

				setBookable(resp);
				setFirstLoad(false);
				showReady();
			} catch (error) {
				console.error("Error fetching bookable schedule:", error);
				showReady();
			}
		};
		showLoading();
		fetchAvailability();

	}, [state.startDate, sessionTypeId, state.locationId, state.authorization, state.siteId, setState]);

	const handleAvailabilityBlockSelect = async (block) => {
		setState((state) => ({
			...state,
			block: block,
		}));

		setSelectBlock(block.startDateTime);

		try {
			if (leadState.leadRegistered) {
				const leadPayload = {
					partitionKey: leadState.partititonKey,
					orderKey: leadState.orderKey,
					dateTimeSeleted: block.startDateTime,
					step: 2,
				};
				const leadRequest = {
					method: "PUT",
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
						leadUpdate: true,
					}));
				} else {
					setLeadState((leadState) => ({
						...leadState,
						leadUpdate: true,
					}));
					console.error(leadData);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const onSelectedDay = (val) => {
		setStepTwo("default");
		if (moment(val).format("MM/DD/YYYY").toString() === moment(state.startDate).format("MM/DD/YYYY").toString()) {
			return;
		}
		setState((state) => ({
			...state,
			startDate: moment(val).format("MM/DD/YYYY").toString(),
		}));
	};

	useEffect(() => {

		const nextDay = moment(state.startDate).add(1, "days").format("MM/DD/YYYY").toString();
		if (bookable && bookable?.length === 0 && firstLoad) {
			setTimeout(() => {
				onSelectedDay(nextDay);
			}, 500);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookable, firstLoad, state.startDate]);

	const blockSelected = async () => {
		scrollParenTop();

		setStepTwo("success");

		setState((state) => ({
			...state,
			step: "summary",
		}));

		try {
			if (leadState.leadRegistered) {
				const leadPayload = {
					partitionKey: leadState.partititonKey,
					orderKey: leadState.orderKey,
					dateTimeSeleted: selectedBlock,
					step: 3,
				};
				const leadRequest = {
					method: "PUT",
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
						leadUpdate: true,
					}));
				} else {
					setLeadState((leadState) => ({
						...leadState,
						leadUpdate: true,
					}));
					console.error(leadData);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};


	const handleSelected = (block) => {
		if (block === selected) {
			setSelected(null);
		} else {
			setSelected(block);
		}
	};

	return (
		<div className="row ">
			<div className="col">
				<div className="row my-3">
					<div className="col d-block d-md-flex justify-content-between">
						<h1 className="h1"> </h1>
						<button
							className="btn btn-cta rounded-pill btn-sm px-3 m-2"
							onClick={() => {
								setStepTwo("default");
								previousStep("availability");
							}}
						>
							BACK
						</button>
					</div>
				</div>
				<div className="row my-3">
					<div id="datePicker" className="col">
						<DatePicker labelFormat={"MMMM"} selectDate={new Date(state.startDate)} getSelectedDay={onSelectedDay} color="#AE678C" endDate={100} />
					</div>
				</div>

				{state.availabilityRequestStatus === "ready" && bookable && bookable.length > 0 && (
					<>
						<h1 className="h4">Select time for you appointment:</h1>
						<div className="row my-4 gx-0 mx-auto justify-content-center justify-content-lg-start">
							{bookable.map((block, index) => {
								return (
									<div className="col-auto mx-0 d-flex d-sm-block" key={index}>
										<button
											className={
												block === selected
													? " flex-fill btn btn-selected-block btn-sm rounded-pill px-3 m-2"
													: " flex-fill btn btn-outline-secondary rounded-pill btn-sm px-3 m-2"
											}
											key={index}
											onClick={() => handleSelected(block)}
										>
											{formatDate(block.startDateTime)}
										</button>
									</div>
								);
							})}
						</div>
						<div className="row my-4">
							<div className="col text-center">
								<button className="btn btn-cta rounded-pill px-3 m-2" disabled={state.block.id === ""} onClick={blockSelected}>
									NEXT
								</button>
							</div>
						</div>
					</>
				)}
				{state.availabilityRequestStatus === "ready" && bookable && bookable.length < 1 && (
					<div className="row">
						<div className="col text-center">
							<h1 className="h1 mb-3">Sorry, there are no available spaces today</h1>
							<h1 className="h3 mb-3">Please select another day on the calendar</h1>
						</div>
					</div>
				)}
				{(state.availabilityRequestStatus === "loading" || state.availabilityRequestStatus === "BOOK-APPOINTMENT-OK") && (
					<div className="row">
						<div className="col text-center">
							<h1 className="h1 m-auto">
								<FontAwesomeIcon spin icon={faSpinner} /> Loading
							</h1>
						</div>
					</div>
				)}
				{(state.availabilityRequestStatus === "error" || state.availabilityRequestStatus === "no-data-found") && <h1 className="h1">Error: {state.message}</h1>}
			</div>
		</div>
	);
}

SelectTimeAppointmentV2.propTypes = {
	setStepTwo: PropTypes.func.isRequired,
	previousStep: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired,
	setState: PropTypes.func.isRequired,
	setSelectBlock: PropTypes.func.isRequired,
	leadState: PropTypes.object.isRequired,
	setLeadState: PropTypes.func.isRequired,
	scrollParenTop: PropTypes.func.isRequired,
	selectedBlock: PropTypes.string,
};

export default SelectTimeAppointmentV2;
