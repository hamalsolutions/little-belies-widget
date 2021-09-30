import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-horizontal-datepicker";
import moment from "moment";
import Select from "react-select";
import { useForm, Controller, useFormState } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faBaby, faHeartbeat, faCartPlus, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

const blocks = [
  {
    id: 2,
    segment: "09:00 AM",
    endSegment: "09:30 AM",
    appointment: {},
  },
  {
    id: 3,
    segment: "09:30 AM",
    endSegment: "10:00 AM",
    appointment: {},
  },
  {
    id: 4,
    segment: "10:00 AM",
    endSegment: "10:30 AM",
    appointment: {},
  },
  {
    id: 5,
    segment: "10:30 AM",
    endSegment: "11:00 AM",
    appointment: {},
  },
  {
    id: 6,
    segment: "11:00 AM",
    endSegment: "11:30 AM",
    appointment: {},
  },
  {
    id: 7,
    segment: "11:30 AM",
    endSegment: "12:00 PM",
    appointment: {},
  },
  {
    id: 8,
    segment: "12:00 PM",
    endSegment: "12:30 PM",
    appointment: {},
  },
  {
    id: 9,
    segment: "12:30 PM",
    endSegment: "01:00 PM",
    appointment: {},
  },
  {
    id: 10,
    segment: "01:00 PM",
    endSegment: "01:30 PM",
    appointment: {},
  },
  {
    id: 11,
    segment: "01:30 PM",
    endSegment: "02:00 PM",
    appointment: {},
  },
  {
    id: 12,
    segment: "02:00 PM",
    endSegment: "02:30 PM",
    appointment: {},
  },
  {
    id: 13,
    segment: "02:30 PM",
    endSegment: "03:00 PM",
    appointment: {},
  },
  {
    id: 14,
    segment: "03:00 PM",
    endSegment: "03:30 PM",
    appointment: {},
  },
  {
    id: 15,
    segment: "03:30 PM",
    endSegment: "04:00 PM",
    appointment: {},
  },
  {
    id: 16,
    segment: "04:00 PM",
    endSegment: "04:30 PM",
    appointment: {},
  },
  {
    id: 17,
    segment: "04:30 PM",
    endSegment: "05:00 PM",
    appointment: {},
  },
  {
    id: 18,
    segment: "05:00 PM",
    endSegment: "05:30 PM",
    appointment: {},
  },
  {
    id: 19,
    segment: "05:30 PM",
    endSegment: "06:00 PM",
    appointment: {},
  },
  {
    id: 20,
    segment: "06:00 PM",
    endSegment: "06:30 PM",
    appointment: {},
  },
  {
    id: 21,
    segment: "06:30 PM",
    endSegment: "07:00 PM",
    appointment: {},
  },
  {
    id: 22,
    segment: "07:00 PM",
    endSegment: "07:30 PM",
    appointment: {},
  },
  {
    id: 23,
    segment: "07:30 PM",
    endSegment: "08:00 PM",
    appointment: {},
  },
];

const translations = {
  en: {
    "Please enter your information": "Please enter your information",
  },
  es: {
    //'Please enter your information':'Por Favor indroduzca la siguiente informacion',
    "Please enter your information": "Please enter your information",
  },
};

function App() {
  const params = new URLSearchParams(window.location.search);
  const languageList = { en: "English", es: "Spanish" };
  const bypass = false;
  const [firstLoad, setFirstLoad] = useState(true);
  const translate = (text) => {
    const trans = translations[params.get("lang") || "en"];
    return trans[text] || text;
  };
  const [showBG, setShowBG] = useState(false);
  const [showHB, setShowHB] = useState(false);
  const [addHeartbeatBuddies, setAddHeartbeatBuddies] = useState(false);
  const [addBabysGrowth, setAddBabysGrowth] = useState(false);
  const [state, setState] = useState({
    step: "registerForm",
    status: "IDLE",
    availabilityRequestStatus: "IDLE",
    appointmentRequestStatus: "IDLE",
    city: params.get("city"),
    message: "",
    siteId: params.get("id") || "549974",
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
    captchaReady: bypass,
    showAddons: false,
    textMessageStatus: "IDLE",
    textMessage: "",
    //showbabyGrowth: false,
    //addBabysGrowth: false,
    //addHeartbeatBuddies: false,
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
  });
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [services, setServices] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const {
    control,
    watch,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const watchFields = watch(["service"]); // you can also target specific fields by their names
  //const watchFields = [undefined]
  const formUrl = `https://dashboard.panzitas.net/appointments/${params.get(
    "id"
  )}`;
  const [width, setWindowWidth] = useState(0);

  const onChangeServices = (service) => {
    // console.log({service});
    // setState({
    //   ...state,
    //   showbabyGrowth: false,
    //   addBabysGrowth: false,
    // })
    setAddBabysGrowth(false);
    setAddHeartbeatBuddies(false);
    if (service !== undefined) {
      setShowHB(true);
    } else {
      setShowHB(false);
    }
    if (
      service &&
      (service.value === 6 || service.value === 7 || service.value === 25)
    ) {
      setShowBG(true);
    } else {
      setShowBG(false);
    }
  };

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  // Loads the dropdown values and set the states for that display on first load
  useEffect(() => {
    const ultrasoundServices = {
      services: [
        { sessionTypeId: 5, name: "Early Pregnancy - $59", price: 59 },
        { sessionTypeId: 25, name: "Gender Determination - $79", price: 79 },
        {
          sessionTypeId: 6,
          name: "Meet Your Baby - 15 Min 5D/HD - $99",
          price: 99,
        },
        {
          sessionTypeId: 7,
          name: "Meet Your Baby - 25 min 5D/HD - $139",
          price: 139,
        },
        {
          sessionTypeId: 8,
          name: "Special Promotion 25 min 5D/HD Ultrasound - $219",
          price: 219,
        },
        // {sessionTypeId: 18,name: "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $168",price: 168,},
        // {sessionTypeId: 19,name: "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $128",price: 128,},
        // { sessionTypeId: 20, name: "Come back for free", price: 0 },
        // { sessionTypeId: 24, name: "Special Promo Ultrasound (G)", price: 0 }, // no va

        // { sessionTypeId: 32, name: "Membership + Visit  - $198", price: 198 },
        // { sessionTypeId: 33, name: "Membership Ultrasound -$30", price: 30 },
        // {sessionTypeId: 34,name: "Gender Determination  + Baby's Growth - $108  ",price: 108,},
        // { sessionTypeId: 37, name: "CBFF + Baby's Growth", price: 29 },
      ],
    };
    const massageServices = {
      services: [
        {
          sessionTypeId: 13,
          name: "30 Minute Prenatal Massage - $49",
          price: 49,
        },
        {
          sessionTypeId: 9,
          name: "50 Minute Prenatal Massage - $79",
          price: 79,
        },
        {
          sessionTypeId: 10,
          name: "80 Minute Prenatal Massage - $109",
          price: 109,
        },

        // { sessionTypeId: 21, name: "Special Promo 50 min (G)", price: 0 }, //no va
        {
          sessionTypeId: 23,
          name: "Special Promotion 50 min Massage - $219",
          price: 219,
        },
      ],
    };
    const ultrasounds = [];
    const massages = [];
    ultrasoundServices.services.forEach((item) => {
      const mutableItem = {
        value: item.sessionTypeId,
        label: item.name,
      };
      ultrasounds.push(mutableItem);
    });
    massageServices.services.forEach((item) => {
      const mutableItem = {
        value: item.sessionTypeId,
        label: item.name,
      };
      massages.push(mutableItem);
    });
    const displayableServices = [
      {
        label: "Ultrasounds",
        options: ultrasounds,
      },
      {
        label: "Massages",
        options: massages,
      },
    ];

    setServices(displayableServices);
    const arrayOfWeeks = [];
    arrayOfWeeks.push({
      value: "I don't know",
      label: "I don't know",
    });
    for (let index = 4; index < 34; index++) {
      const element = {
        value: "" + index,
        label: "" + index,
      };
      arrayOfWeeks.push(element);
    }
    setWeeks(arrayOfWeeks);
  }, []);
  // Gets the availability when the date changes
  useEffect(() => {
    const getAvailability = async () => {
      setState((state) => ({
        ...state,
        availabilityRequestStatus: "loading",
      }));

      try {
        const authPayload = {
          Username: `${process.env.REACT_APP_USER_NAME}`,
          Password: `${process.env.REACT_APP_PASSWORD}`,
        };
        const authRequest = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            siteid: state.siteId,
          },
          body: JSON.stringify(authPayload),
        };
        const authResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/userToken/`,
          authRequest
        );
        const authData = await authResponse.json();
        if (authResponse.ok) {
          setState((state) => ({
            ...state,
            authorization: authData.accesssToken,
          }));
          const queryStartDate = moment(state.startDate)
            .format("MM/DD/YYYY")
            .toString();

          const availabilityRequest = {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              siteid: state.siteId,
              authorization: authData.accesssToken,
              locationid: state.locationId,
            },
          };
          const availabilityResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/book/sites/${state.siteId}/locations/${state.locationId}/schedule?startDate=${queryStartDate}&endDate=${queryStartDate}`,
            availabilityRequest
          );

          const availabilityData = await availabilityResponse.json();
          if (availabilityResponse.ok) {
            const rooms = availabilityData.schedule.map((room) => {
              const appointments = [];
              room.appointments.forEach((appointment) => {
                const mutableAppointment = appointment;
                const segment = new Date(
                  mutableAppointment.StartDateTime
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                mutableAppointment.segment = segment;
                appointments.push(mutableAppointment);
              });

              const roomReturn = {
                staffId: room.id,
                staffName: room.name,
                unavailabilities: room.unavailabilities,
                availabilities: room.availabilities,
                roomBlocks: [],
                appointments: appointments,
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
                const rawHours = parseInt(
                  mutableBlock.segment.split(" ")[0].split(":")[0]
                );
                const hours =
                  addTwelve && rawHours !== 12 ? rawHours + 12 : rawHours;
                const minutes = parseInt(
                  mutableBlock.segment.split(" ")[0].split(":")[1]
                );
                const stringDate = moment(state.startDate)
                  .format("MM/DD/YYYY")
                  .toString();
                const startDateTime = moment(stringDate)
                  .add(hours, "hours")
                  .add(minutes, "minutes")
                  .format("YYYY-MM-DD[T]HH:mm:ss");
                const endDateTime = moment(startDateTime)
                  .add(30, "minutes")
                  .format("YYYY-MM-DD[T]HH:mm:ss");
                mutableBlock.startDateTime = startDateTime;
                mutableBlock.endDateTime = endDateTime;
                const blockDate = moment(stringDate)
                  .add(hours, "hours")
                  .add(minutes, "minutes")
                  .toString();
                mutableBlock.blockDate = blockDate;
                mutableBlock.selected = false;
                let available = false;
                room.availabilities.forEach((availabilityBlock) => {
                  available =
                    available +
                    moment(blockDate).isBetween(
                      availabilityBlock.startDateTime,
                      availabilityBlock.endDateTime,
                      undefined,
                      "[)"
                    );
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
                  moment(blockDate).isBetween(
                    appointment.startDateTime,
                    appointment.endDateTime,
                    undefined,
                    "[)"
                  )
                );

                mutableBlock.appointment =
                  blockAppointment === undefined ? {} : blockAppointment;
                mutableBlock.available = Boolean(available);
                // add time to date
                var startMomentWithNowTime = moment(state.startDate);
                var now = moment().format("MM/DD/YYYY");
                if (now === startMomentWithNowTime.format("MM/DD/YYYY")) {
                  // console.log("IS TODAY")
                  var nowWithTime = moment();
                  startMomentWithNowTime = startMomentWithNowTime.set({
                    hour: nowWithTime.hour(),
                    minute: nowWithTime.minute(),
                    second: nowWithTime.second(),
                  });
                }
                if (
                  blockAppointment === undefined &&
                  available &&
                  moment(blockDate).isAfter(
                    startMomentWithNowTime.add(2, "hours")
                  )
                ) {
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
                const foundedBlock = availableBlocksForDisplay.find(
                  (availableBlock) => availableBlock.id === block.id
                );
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
              a.startDateTime > b.startDateTime
                ? 1
                : b.startDateTime > a.startDateTime
                ? -1
                : 0
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
        } else {
          setState((state) => ({
            ...state,
            availabilityRequestStatus: "no-data-found",
            message: JSON.stringify(authData),
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

    getAvailability();
  }, [state.startDate, state.locationId, state.siteId]);
  // Handles the date change
  const onSelectedDay = (val) => {
    if (
      moment(val).format("MM/DD/YYYY").toString() ===
        moment(state.startDate).format("MM/DD/YYYY").toString()
    ) {
      return;
    }
    setState((state) => ({
      ...state,
      startDate: moment(val).format("MM/DD/YYYY").toString(),
    }));
  };
  // Search availabilities until found available space
  useEffect(() => {
    
    const nextDay = moment(state.startDate)
      .add(1, "days")
      .format("MM/DD/YYYY")
      .toString();
    if (availableBlocks.length === 0 && !firstLoad) {
      setTimeout(() => {
        onSelectedDay(nextDay);
      }, 500);
    }
  }, [availableBlocks]);
  // Saves the selected available block into a state
  const handleAvailabilityBlockSelect = (block) => {
    setState((state) => ({
      ...state,
      block: block,
    }));
  };
  // Handle the booking of the appointment and creation of the client if necesary
  const bookAppointment = async () => {
    if (state.appointmentRequestStatus === "loading") {
      return;
    }
    try {
      /// BYPASS BOOKING
      if (bypass) {
        setState((state) => ({
          ...state,
          appointmentRequestStatus: "BOOK-APPOINTMENT-OK",
        }));
        return;
      }
      /// END BYPASS

      setState((state) => ({
        ...state,
        appointmentRequestStatus: "loading",
      }));

      let createAppointment = false;
      let clientObject = { ...clientState.clientObject };

      if (clientState.clientRequestStatus === "CLIENT-NOT-FOUND") {
        const payload = {
          firstName: clientState.firstName,
          lastName: clientState.lastName,
          mobilePhone: clientState.phone,
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
        const createClientResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/clients`,
          createClientRequest
        );
        const createClientData = await createClientResponse.json();
        if (createClientResponse.ok) {
          const createdClient = {
            clientId: createClientData.clientId,
            name: createClientData.name,
            phone: createClientData.phone,
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
            message:
              "Create request Error: " + JSON.stringify(createClientData),
          }));
          createAppointment = false;
        }
      }

      if (
        clientState.clientRequestStatus === "CLIENT-FOUND-DIFFERENT" ||
        clientState.clientRequestStatus === "CLIENT-FOUND"
      ) {
        createAppointment = true;
      }

      if (createAppointment) {
        const payload = {
          sessionTypeId: "" + clientState.sessionTypeId,
          locationId: parseInt(state.locationId),
          staffId: state.block.staffId[0],
          clientId: clientObject.clientId,
          notes:
            "Weeks: " +
            clientState.weeks +
            "\n Language: " +
            state.language +
            "\n" +
            (addHeartbeatBuddies ? "Add HeartBeat Buddies" : ""),
          startDateTime: moment(state.block.blockDate)
            .format("YYYY-MM-DD[T]HH:mm:ss")
            .toString(),
        };

        const bookAppointmentRequest = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: state.authorization,
            siteid: state.siteId,
          },
          body: JSON.stringify(payload),
        };
        const bookAppointmentResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointments`,
          bookAppointmentRequest
        );
        const bookAppointmentData = await bookAppointmentResponse.json();
        if (bookAppointmentResponse.ok) {
          const smsPayload = {
            clientName: clientState.firstName + " " + clientState.lastName,
            service: clientState.sessionTypeName,
            date: moment(state.block.blockDate).format("MM-DD-YYYY").toString(),
            time: moment(state.block.blockDate).format("hh:mm A").toString(),
            address: state.address,
            arrive: state.howtoarrive,
            locationPhone: state.phone,
            clientMobilePhone: clientState.phone,
            locationName: "Little Bellies - " + state.city 
          }
          const textMessageRequest = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              siteid: state.siteId,
              locationid: state.locationId,
            },
            body: JSON.stringify(smsPayload),
          };

          const textMessageResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/services/sendSms/booking`,
            textMessageRequest
          );
          
          const textMessageData = await textMessageResponse.json();
          if(textMessageResponse.ok){
            console.log(textMessageData);
            setState((state) => ({
              ...state,
              appointmentRequestStatus: "BOOK-APPOINTMENT-OK",
            }));
          }
          else{
            setState((state) => ({
              ...state,
              textMessageStatus: "TEXT-FAIL",
              textMessage: JSON.stringify(textMessageData),
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
  // Search the client to see if it exist in MindBody
  const onFormSubmit = async (data) => {
    console.log({ data });
    let sessionTypeId = data.service.value;
    let sessionTypeName = data.service.label;

    // Changes the service in case of adding Babys Growth
    if (data.service.value === 6 && addBabysGrowth) {
      sessionTypeId = 18;
      sessionTypeName = "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $168";
    }
    if (data.service.value === 7 && addBabysGrowth) {
      sessionTypeId = 19;
      sessionTypeName = "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $128";
    }
    if (data.service.value === 25 && addBabysGrowth) {
      sessionTypeId = 34;
      sessionTypeName = "Gender Determination  + Baby's Growth - $108";
    }

    setClientState((clientState) => ({
      ...clientState,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      weeks: data.weeks.label,
      sessionTypeId: sessionTypeId,
      sessionTypeName: sessionTypeName,
      language: state.language,
    }));
    setState((state) => ({
      ...state,
      step: "availability",
    }));

    if (clientState.clientRequestStatus === "loading") {
      return;
    }
    try {
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
        `${process.env.REACT_APP_API_URL}/api/clients/clients?searchText=${data.email}`,
        searchClientsRequest
      );
      const searchClientsData = await searchClientsResponse.json();
      if (searchClientsResponse.ok) {
        if (
          data.firstName + " " + data.lastName ===
            searchClientsData.clients[0].name &&
          searchClientsData.clients[0].email === data.email &&
          searchClientsData.clients[0].phone === data.phone
        ) {
          setClientState((clientState) => ({
            ...clientState,
            clientRequestStatus: "CLIENT-FOUND",
            clientObject: searchClientsData.clients[0],
            searchResults: searchClientsData.clients,
          }));
        } else {
          setClientState((clientState) => ({
            ...clientState,
            clientRequestStatus: "CLIENT-FOUND-DIFFERENT",
            clientObject: searchClientsData.clients[0],
            searchResults: searchClientsData.clients,
          }));
        }
      } else {
        setClientState((clientState) => ({
          ...clientState,
          clientRequestStatus: "CLIENT-NOT-FOUND",
          searchResults: [],
        }));
      }
    } catch (error) {
      setState((state) => ({
        ...state,
        status: "error",
        message: "Client request Error: " + JSON.stringify(error.message),
      }));
    }
  };
  // Takes the app to the previous step of booking
  const previousStep = (currentStep) => {
    switch (currentStep) {
      case "availability":
        setState((state) => ({
          ...state,
          step: "registerForm",
          // startDate: moment(new Date()).toString(), // <--- added this for reset day
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
          // startDate: moment(new Date()).toString(), // <--- added this for reset day
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
  // Activates the book button by setting the reCaptcha validation
  function onChange(value) {
    setState((state) => ({
      ...state,
      captchaReady: true,
    }));
  }
  // Stores the selection of babys growth into a state
  const handleAddBabysGrowth = () => {
    setAddBabysGrowth(!addBabysGrowth);
  };
  // Stores the selection of heartbeat buddies into a state
  const handleAddHeartbeatBuddies = () => {
    setAddHeartbeatBuddies(!addHeartbeatBuddies);
  };
  // Takes the app to the summary step of booking
  const blockSelected = () => {
    setState((state) => ({
      ...state,
      step: "summary",
    }));
  };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const selectStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: width > 1023 ? 16 : 14,
      };
    },
  };
  const groupTextStyles = {
    color: "#AE678C",
    fontSize: width > 1023 ? 18 : 16,
    textTransform: "capitalize",
  };
  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span style={groupTextStyles}>{data.label}</span>
    </div>
  );

  // console.log("availableBlocks");
  // console.log(availableBlocks);
  // console.log(state.locationId);
  return (
    <div className="container">
      {state.step === "registerForm" && (
        <>
          <form
            className="row my-3 bg-light-container mx-auto p-md-4 box-shadow justify-content-center"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="row mb-3">
              <div className="col">
                <h1 className="h4 mt-2 mb-3 ">
                  {translate("Please enter your information", state.language)}
                </h1>
                <h3 className="h6 fw-normal">
                  {" "}
                  In order to book an appointment please provide the following
                  information
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  placeholder="First name"
                  className={
                    "form-control bg-light-input mb-3" +
                    (errors.firstName ? " border-1 is-invalid" : " border-0")
                  }
                  {...register("firstName", {
                    required: true,
                    pattern: /^([^0-9]*)$/i,
                  })}
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  placeholder="Last Name"
                  className={
                    "form-control bg-light-input mb-3" +
                    (errors.lastName ? " border-1 is-invalid" : " border-0")
                  }
                  {...register("lastName", {
                    required: true,
                    pattern: /^([^0-9]*)$/i,
                  })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  placeholder="Email"
                  className={
                    "form-control bg-light-input mb-3" +
                    (errors.email ? " border-1 is-invalid" : " border-0")
                  }
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+\.\S+$/i,
                  })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input
                  type="tel"
                  placeholder="Phone number"
                  className={
                    "form-control bg-light-input mb-3" +
                    (errors.phone ? " border-1 is-invalid" : " border-0")
                  }
                  {...register("phone", {
                    required: true,
                    pattern:
                      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i,
                  })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Controller
                  name="weeks"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={weeks}
                      placeholder="Select Pregnancy Weeks"
                      className={
                        "dropdown w-100 mb-3" +
                        (errors.weeks ? " is-select-invalid" : "")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Controller
                  name="service"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={services}
                      placeholder="Select a service"
                      className={
                        "dropdown w-100 mb-3" +
                        (errors.service ? " is-select-invalid" : "")
                      }
                      formatGroupLabel={formatGroupLabel}
                      styles={selectStyles}
                      onChange={(service) => {
                        //console.log({service})
                        onChangeServices(service);
                        field.onChange(service);
                      }}
                    />
                  )}
                />
              </div>
            </div>
            {showHB && (
              <div className="row gx-1 gx-md-2 my-3 justify-content-center">
                {showBG && (
                  <div className="col-12 col-sm-6 px-5 px-sm-2 text-center ">
                    <div
                      className={
                        "btn-addOn rounded-3 px-3 mx-auto smaller-text w-100 h-100 " +
                        (addBabysGrowth
                          ? "btn-outline-addOn"
                          : "btn-outline-secondary-addOn")
                      }
                      onClick={handleAddBabysGrowth}
                    >
                      <div className="row">
                        <div className="col addOnIcon">
                          <FontAwesomeIcon icon={faBaby} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col text-center">
                          <h3
                            className="h5"
                            style={{
                              fontSize: width > 1023 ? 16 : 14,
                              marginLeft: 5,
                              marginRight: 5,
                            }}
                          >
                            Baby's Growth
                          </h3>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col text-start addonText">
                          <ul className="fa-ul mt-2 mb-1">
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Baby's measurements </li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Baby's position in uterus</li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Baby's weight</li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Baby's heart activity</li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Weeks of Pregnancy</li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Estimated due date</li>
                            <li className=" lh-md"><span className="fa-li" ><FontAwesomeIcon icon={faCheck} /></span>Amniotic fluid</li>
                          </ul>
                        </div>
                      </div>
                      <div className="row justify-content-center mt-1 mb-2">
                        <div
                          className="col-auto fw-bold"
                          style={{ fontSize: width > 1023 ? 16 : 14 }}
                        >
                          <span className="">$29</span>
                        </div>
                        <div
                          className="col-auto fw-bold"
                          style={{ fontSize: width > 1023 ? 16 : 14 }}
                        >
                          {addBabysGrowth && (
                            <>
                              <FontAwesomeIcon icon={faTrash} />
                              <span> Remove</span>
                            </>
                          )}
                          {!addBabysGrowth && (
                            <>
                              <FontAwesomeIcon icon={faCartPlus} />
                              <span> Add</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-12 col-sm-6 px-5 px-sm-2 my-3 my-md-0 text-center">
                  <div
                    className={
                      "btn-addOn rounded-3 px-3 mx-auto smaller-text w-100 h-100 " +
                      (addHeartbeatBuddies
                        ? "btn-outline-addOn"
                        : "btn-outline-secondary-addOn")
                    }
                    onClick={handleAddHeartbeatBuddies}
                  >
                    <div className="row">
                      <div className="col addOnIcon">
                        <FontAwesomeIcon icon={faHeartbeat} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col text-center">
                        <h3
                          className="h5"
                          style={{ fontSize: width > 1023 ? 16 : 14 }}
                        >
                          Heartbeat Buddies
                        </h3>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col text-start addonText">
                        <ul className="fa-ul mt-2 mb-1 lh-md">
                          <li className="ul-lh"><span className="fa-li"><FontAwesomeIcon icon={faCheck} /></span>Beautiful high-quality stuffed animal</li>
                          <li className="ul-lh"><span className="fa-li"><FontAwesomeIcon icon={faCheck} /></span>2-second recording of bady's heartbeat</li>
                          <li className="ul-lh"><span className="fa-li"><FontAwesomeIcon icon={faCheck} /></span>Cherished forever</li>
                          <li className="ul-lh"><span className="fa-li"><FontAwesomeIcon icon={faCheck} /></span>Build connection an strenghtens bond with bady</li>
                        </ul>
                      </div>
                    </div>
                    <div className="row justify-content-center mt-1 mb-2">
                      <div
                        className="col-auto fw-bold"
                        style={{ fontSize: width > 1023 ? 16 : 14 }}
                      >
                        <span className="">$35</span>
                      </div>
                      <div className="col-auto fw-bold"
                        style={{ fontSize: width > 1023 ? 16 : 14 }}>
                        {addHeartbeatBuddies && (
                          <>
                            <FontAwesomeIcon icon={faTrash} />
                            <span> Remove</span>
                          </>
                        )}
                        {!addHeartbeatBuddies && (
                          <>
                            <FontAwesomeIcon icon={faCartPlus} />
                            <span> Add</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="row my-3">
              <div className="col text-center">
                <button
                  type="submit"
                  className="btn btn-cta-active rounded-pill px-3 mx-auto"
                >
                  Check availabilities
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {state.step === "availability" && (
        <div className="row ">
          <div className="col">
            <div className="row my-3">
              <div className="col d-block d-md-flex justify-content-between">
                <h1 className="h1"> </h1>
                <button
                  className="btn btn-cta rounded-pill btn-sm px-3 m-2"
                  onClick={() => previousStep("availability")}
                >
                  BACK
                </button>
              </div>
            </div>
            <div className="row my-3">
              <div id="datePicker" className="col">
                <DatePicker
                  labelFormat={"MMMM"}
                  selectDate={new Date(state.startDate)}
                  getSelectedDay={onSelectedDay}
                  color="#AE678C"
                  endDate={50}
                />
              </div>
            </div>

            {state.availabilityRequestStatus === "ready" &&
              availableBlocks.length >= 1 && (
                <>
                  <h1 className="h4">Select time for you appointment:</h1>
                  <div className="row my-4 gx-0 mx-auto justify-content-center justify-content-lg-start">
                    {availableBlocks.map((block, index) => {
                      return (
                        <div className="col-auto mx-0 d-flex d-sm-block">
                          <button
                            className={
                              block.id === state.block.id
                                ? " flex-fill btn btn-selected-block btn-sm rounded-pill px-3 m-2"
                                : " flex-fill btn btn-outline-secondary rounded-pill btn-sm px-3 m-2"
                            }
                            key={block.id}
                            onClick={() => handleAvailabilityBlockSelect(block)}
                          >
                            {block.segment}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="row my-4">
                    <div className="col text-center">
                      <button
                        className="btn btn-cta rounded-pill px-3 m-2"
                        disabled={state.block.id === ""}
                        onClick={blockSelected}
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                </>
              )}
            {state.availabilityRequestStatus === "ready" &&
              availableBlocks.length === 0 && (
                <div className="row">
                  <div className="col text-center">
                    <h1 className="h1 mb-3">
                      Sorry, there are no available spaces today
                    </h1>
                    <h1 className="h3 mb-3">
                      Please select another day on the calendar
                    </h1>
                  </div>
                </div>
              )}
            {state.availabilityRequestStatus === "loading" && (
              <div className="row">
                <div className="col text-center">
                  <h1 className="h1 m-auto">
                    <FontAwesomeIcon spin icon={faSpinner} /> Loading
                  </h1>
                </div>
              </div>
            )}
            {(state.availabilityRequestStatus === "error" ||
              state.availabilityRequestStatus === "no-data-found") && (
              <h1 className="h1">Error: {state.message}</h1>
            )}
          </div>
        </div>
      )}

      {state.step === "summary" && (
        <div className="">
          <div className="row gx-5">
            {state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
              <div className="col d-flex justify-content-between">
                <h1 className="h3 ">Your booking information</h1>
                <button
                  className="btn btn-cta rounded-pill btn-sm px-3 m-2"
                  onClick={() => previousStep("summary")}
                >
                  BACK
                </button>
              </div>
            )}

            {state.appointmentRequestStatus !== "IDLE" && (
              <div className="row mt-4 mb-2">
                <div className="col text-center">
                  {state.appointmentRequestStatus ===
                    "BOOK-APPOINTMENT-FAIL" && (
                    <div className="d-block alert alert-danger">
                      <span> {state.message} </span>
                    </div>
                  )}
                  {state.textMessageStatus ===
                    "TEXT-FAIL" && (
                    <div className="d-block alert alert-warning">
                      <span> {state.textMessage} </span>
                    </div>
                  )}
                  {state.appointmentRequestStatus === "BOOK-APPOINTMENT-OK" && (
                    <div className="d-block alert alert-success">
                      <span>
                        {" "}
                        Your appointment has been successfuly booked{" "}
                      </span>
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
          <div className="row w-50 mb-3 bg-light-container mx-auto p-4 box-shadow justify-content-center">
            <div>
              <div className="row my-3">
                <div className="col">
                  <div>
                    <b>Full Name:</b>{" "}
                    {clientState.firstName + " " + clientState.lastName}
                  </div>
                </div>
              </div>
              {/* <div className="row mb-2">
              <div className="col">
                <div>Email: <b>{clientState.email}</b></div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <div>Phone: <b>{clientState.phone}</b></div>
              </div>
            </div> */}
              <div className="row mb-3">
                <div className="col">
                  <div>
                    <b>Service: </b>
                    {clientState.sessionTypeName}
                  </div>
                </div>
              </div>
              {/* 
            <div className="row mb-2">
              <div className="col">
                <div>Weeks: <b>{clientState.weeks}</b></div>
              </div>
            </div>
            */}
              <div className="row mb-3">
                <div className="col-auto">
                  <div>
                    <b>Date: </b>
                    {moment(state.block.blockDate)
                      .format("MM-DD-YYYY")
                      .toString()}
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
                  <div>
                    <b>Location Address: </b>
                    {state.address}
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <div>
                    <b>How to Arrive: </b>
                    {state.howtoarrive}
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <div>
                    <b>Location Phone: </b>
                    {state.phone}
                  </div>
                </div>
              </div>
              {/* { state.language !== 'English' && (
              <div className="row mb-2">
                <div className="col">
                  <div>Language: <b>{state.language}</b></div>
                </div>
              </div>
            )} */}
              {state.appointmentRequestStatus === "BOOK-APPOINTMENT-OK" && (
                <div className="row mb-2">
                  <div className="col">
                    <div>
                    <a target="_blank" href={formUrl}>
                      Please, remember to fill out the form before your
                      appointment{" "} HERE
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
                <>
                <div className="row no-gutters">
                  <div className="col captcha-container px-0 d-flex">
                    <ReCAPTCHA
                      sitekey="6LdsCnAcAAAAAHG8I-ADbn4GG6ztVOzEO0C93Yuh"
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col text-center">
                    <div className="row mt-3">
                      <div className="col text-center">
                        <button
                          type="button"
                          disabled={!state.captchaReady}
                          className="btn btn-cta-active rounded-pill px-3 mx-auto"
                          onClick={bookAppointment}
                        >
                          {state.appointmentRequestStatus === "loading" && (
                            <>
                              <FontAwesomeIcon spin icon={faSpinner} /> Booking
                            </>
                          )}
                          {state.appointmentRequestStatus !== "loading" && (
                            <>Book appointment</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
            {state.appointmentRequestStatus === "BOOK-APPOINTMENT-OK" && (
              <div className="video-responsive">
                <iframe

                  src={"https://www.youtube.com/embed/uspIXX4uU9c"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
