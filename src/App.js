import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-horizontal-datepicker";
import moment from "moment";
import Select from "react-select";
import { useForm, Controller, useFormState } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faBaby,
  faHeartbeat,
  faCartPlus,
  faTrash,
  faCheck,
  faChevronUp,
  faChevronDown,
  faTimesCircle,
  faInfo,
  faClosedCaptioning,
  faXRay
} from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";
import "./styles/info.css";
import * as crypto from 'crypto-js';


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
// TODO: Complete all text and translate.
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
  const [localTime, setLocalTime] = useState({ date: new Date });

  const [selectedBlock, setSelectBlock] = useState(null);
  const [showBG, setShowBG] = useState(false);
  const [showHB, setShowHB] = useState(false);
  const [showDetailsBG, setShowDetailsBG] = useState(false);
  const [showDetailsHB, setShowDetailsHB] = useState(false);
  const [addHeartbeatBuddies, setAddHeartbeatBuddies] = useState(false);
  const [add8kRealisticView, setAdd8kRealisticView] = useState(false);
  const [addBabysGrowth, setAddBabysGrowth] = useState(false);
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
    captchaReady: true, /// DISABLE CAPTCHA
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
  });
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [services, setServices] = useState([]);
  const addOnsToMeetYourBaby = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => { setModalHearthbeat(true) }}
            />
          </div>
        </div>
      )
    },
    {
      value: "Baby's Growth",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>Baby's Growth</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexBabyGrow(true)}
            onMouseLeave={() => setHoverIndexBabyGrow(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalBabyGrow(true)}
            />
          </div>
        </div>
      )
    },
    {
      value: "8K Realistic View",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>8K Realistic View</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndex8kRealisticView(true)}
            onMouseLeave={() => setHoverIndex8kRealisticView(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModal8kRealisticView(true)}
            />
          </div>
        </div>
      )
    }
  ];
  const addOnsToGenderDetermination = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => { setModalHearthbeat(true) }}
            />
          </div>
        </div>
      )
    },
    {
      value: "Baby's Growth",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>Baby's Growth</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexBabyGrow(true)}
            onMouseLeave={() => setHoverIndexBabyGrow(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalBabyGrow(true)}
            />
          </div>
        </div>
      )
    }
  ];
  const addOnsToEarlyPregnancy = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalHearthbeat(true)}
            />
          </div>
        </div>
      )
    }];
  const [selectedOptionAddons, setSelectedOptionAddons] = useState(null);
  const [hoverIndex8kRealisticView, setHoverIndex8kRealisticView] = useState(false);
  const [hoverIndexBabyGrow, setHoverIndexBabyGrow] = useState(false);
  const [hoverIndexHearthbeat, setHoverIndexHearthbeat] = useState(false);
  const [stepOne, setStepOne] = useState("default");
  const [stepTwo, setStepTwo] = useState("default");
  const [stepThree, setStepThree] = useState("default");
  const [clickButtonForm, setClickButtonForm] = useState(false);
  const [modalBabyGrow, setModalBabyGrow] = useState(false);
  const [modalHearthbeat, setModalHearthbeat] = useState(false);
  const [modal8kRealisticView, setModal8kRealisticView] = useState(false);
  const [seletedService, setSeletedService] = useState(null)
  const [fixedServices, setFixedServices] = useState({
    specialPromotion25min: "",
    genderdetermination: "",
    earlypregnancy: "",
    meetyourbaby25: "",
    meetyourbaby15: "",
  });
  const [sendForm, setSendForm] = useState(false)
  const [addOns, setAddOns] = useState();
  const [ultrasounds, setUltrasounds] = useState([]);
  const [consultedUltrasounds, setConsultedUltrasounds] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [sitesInfo, setSitesInfo] = useState([]);

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
  const [leadState, setLeadState] = useState({
    clientFound: false,
    leadRegistered: false,
    leadDeleted: false,
    leadUpdate: false,
    partititonKey: "",
    orderKey: "",
  });

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  const servicesToRemoveitem = [
    "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $168",
    "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $128",
    "Come back for free",
    "Special Promo Ultrasound (G)",
    "Membership + Visit  - $198",
    "Membership Ultrasound -$30",
    "Gender Determination  + Baby's Growth - $108  ",
    "Gender Determination  + Baby's Growth - $108",
    "CBFF + Baby's Growth",
    "Special Promo 50 min (G)",
    "Membership - $169",
    "Early Pregnancy + Baby's Growth",
  ];
  const filterServices = (services) => {
    return services.filter((item) => {
      return !servicesToRemoveitem.includes(item.label);
    });
  };

  const removePrice = (service) => {
    return service.substring(0, service.lastIndexOf("-")).trim();
  };
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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/config/sites`,
        getSitesData
      );
      const data = await response.json();
      if (response.ok) {
        const allSitesItem = data.sites.find(site => site.site === "0-0");
        let sitesArray = []
        if (allSitesItem !== undefined) {
          sitesArray = data.sites.filter(site => site.site !== "0-0");
        }
        else {
          sitesArray = data.sites;
        }
        setSitesInfo(sitesArray)
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  useEffect(() => {

    const filterSite = sitesInfo.find((i) => i.site === `${state.siteId}-${state.locationId}`);
    if (filterSite !== undefined) {
      const date = new Date();
      const timeZone = date.toLocaleString('en-US', { timeZone: filterSite?.timeZone });
      setLocalTime((localTime) => ({
        ...localTime,
        date: timeZone
      }));
      console.log('localTime:', timeZone)
    }
  }, [sitesInfo, localTime.date])

  const hasBabyGrowth = (service, services) => {
    return services.find((item) => {
      return (
        item.name.indexOf(removePrice(service)) >= 0 &&
        item.name.indexOf("Baby's Growth") >= 0
      );
    });
  };

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

  const getBGCombo = (serviceName, servicesArray) => {
    const sessionTypeName = serviceName;
    let purifiedServiceName = "";
    let serviceId = "";
    const regex = /[-.()+\s]/g;

    if (sessionTypeName.toLowerCase().includes("$")) {
      const indexPrice = sessionTypeName.toLowerCase().indexOf("$");
      const remaining = sessionTypeName.toLowerCase().slice(0, indexPrice);
      purifiedServiceName = remaining.replace(regex, "");
      // console.log("Service: "+purifiedServiceName);
    }

    servicesArray.forEach((serviceItem) => {
      if (serviceItem.name.toLowerCase().includes("$")) {
        const indexAddon = serviceItem.name.toLowerCase().indexOf("$");
        const remainingConsulted = serviceItem.name
          .toLowerCase()
          .slice(0, indexAddon);
        const purifiedConsulted = remainingConsulted.replace(regex, "");
        // console.log("ServiceConsulted: "+purifiedConsulted);
        if (purifiedServiceName === purifiedConsulted) {
          serviceId = serviceItem.sessionTypeId;
        }
      }
    });
    // console.log("ServiceId: " + serviceId);
    return serviceId;
  };
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
        const body = {data: encrypted}
        const authRequest = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            siteid: state.siteId,
          },
          body: JSON.stringify(body),
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

            const filterServicesBySeeOnline = servicesUltrasounds.filter((i) => {
              if (state.siteId === "557418" && state.locationId === "2") {

                let specialpromotion25min = i.name.toLowerCase().replace(/[-.()+\s]/g, "").search("specialpromotion25min");
                if (specialpromotion25min !== 0) return i.seeOnLine === true

              } else {
                return i.seeOnLine === true
              }

            }).map((i) => {
              return i.name
            }).sort((a, b) => {
              if (a > b) return 1
              if (a < b) return -1
              return 0;
            });

            if (state.siteId === "557418" || state.siteId === "902886" || state.siteId === "5721382") {
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
              filterMassageData = massageData.services.filter((i) => { return i.seeOnLine === true });
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
                }
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

            if (state.siteId === "557418" || state.siteId === "902886" || state.siteId === "5721382") {
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
                options: orderServices(filterServices(massages)),
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
      let minDate; if (a && b) a.startDateTime < b.startDateTime ? minDate = a : minDate = b;
      return minDate;
    }, {});
  }

  // Gets the availability when the date changes
  useEffect(() => {
    if (state.authorization === "") {
      return;
    }
    // console.log("Started working") ;
    const getAvailability = async () => {
      setState((state) => ({
        ...state,
        availabilityRequestStatus: "loading",
      }));

      try {
        const sessionTypeId = "" + clientState.sessionTypeId;
        const queryStartDate = moment(state.startDate)
          .format("MM/DD/YYYY")
          .toString();

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
              const segment = new Date(
                mutableAppointment.startDateTime
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
              mutableAppointment.segment = segment;
              appointments.push(mutableAppointment);
            });

            const listApointments = [];
            availabilityData.schedule.forEach((i) => {
              listApointments.push(i.appointments[0])
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
              severalRooms: listApointments.length > 1
            };
            
            const roomReturn = {
              staffId: room.id,
              staffName: room.name,
              unavailabilities: room.unavailabilities,
              availabilities: room.availabilities,
              roomBlocks: [],
              appointments: appointments,
              firstDatesMatches: firstDates
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
              let firstBlockTime;
              const isToday = moment().format("MM/DD/YYYY"); 
              const localStartTime = moment(localTime.date).format("YYYY-MM-DD[T]HH:mm:ss");
              const localEndTime = moment(localTime.date).add(2, 'hours').format("YYYY-MM-DD[T]HH:mm:ss"); 

              const selectedDateBlock = moment(state.startDate).format("MM/DD/YYYY"); 
              const firstAppointment = room.appointments[0]?.startDateTime; 
              const firstAvailability = getFirstAvailability(room.availabilities)?.startDateTime; 

              const hourDifferenceAppt = moment(firstAppointment).diff(moment(localStartTime), 'hours');
              const hourDifferenceBlocks = moment(blockDate).diff(moment(localStartTime), 'hours');

              if (isToday === selectedDateBlock) { 
                  
                if (room.firstDatesMatches.severalRooms) {

                  if (room.firstDatesMatches.matches) {
                    if (blockDate > moment(localStartTime).toString()) {
                      firstBlockTime = moment(firstAvailability).toString();
                    }
                  } 

                  if (!room.firstDatesMatches.matches){
                    if (blockDate > moment(localStartTime).toString()) {
                        firstBlockTime = moment(firstAppointment).toString();
                    }
                  }
                }

                if (!room.firstDatesMatches.severalRooms) {

                  if (firstAppointment !== firstAvailability) {
                    if(hourDifferenceAppt <= 2 && blockDate > moment(localStartTime).toString()){
                      firstBlockTime = moment(firstAppointment).toString();
                    }else{ 
                      if(hourDifferenceBlocks >= 2){
                        firstBlockTime = moment(localEndTime).toString();
                      }
                    }
                  }

                  if (firstAppointment === firstAvailability) {
                    if (blockDate > moment(localStartTime).toString() && blockDate > moment(firstAppointment).toString()) {
                      firstBlockTime = moment(localStartTime).toString();
                    }
                  }
                }
              } 

              if(isToday !== selectedDateBlock){
                firstBlockTime = moment(state.startDate).add("08", "hours").add("30", "minutes").toString();
              }

              room.availabilities.forEach((availabilityBlock) => {
                available =
                  available + (
                    moment(blockDate).isBetween(
                      availabilityBlock.startDateTime,
                      availabilityBlock.endDateTime,
                      undefined,
                      "[)"
                    ) * (blockDate > firstBlockTime)); 
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
  }, [
    state.startDate,
    state.locationId,
    state.siteId,
    state.authorization,
    clientState.sessionTypeId,
  ]);
  const removeTags = (str) => {
    if (str === null || str === "") return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, "");
  };
  // Handles the date change
  const onSelectedDay = (val) => {
    setStepTwo("default")
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
        const leadResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/book/clients`,
          leadRequest
        );
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
      };

    } catch (error) {
      console.error(error);
    }

  };

  // Handle the booking of the appointment and creation of the client if necesary 
  const bookAppointment = async () => {
    setStepThree("success");

    if (state.appointmentRequestStatus === "loading") {
      return;
    }
    try {
      /// BYPASS BOOKING
      if (bypass) {
        googleTrackBooking({ name: "name", service: "service", date: "date", time: "time" });
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
        try {
          const payload = {
            firstName: clientState.firstName,
            lastName: clientState.lastName,
            mobilePhone: clientState.phone.replace(/[^0-9]/gi, ''),
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
              phone: createClientData.phone.replace(/[^0-9]/gi, ''),
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
              message:
                "Create request Error: " + JSON.stringify(createClientData),
            }));
            setState((state) => ({
              ...state,
              appointmentRequestStatus: "IDLE",
            }));
            createAppointment = false;
          }
        }
        catch (e) {
          setClientState((clientState) => ({
            ...clientState,
            createClientRequestStatus: "ERROR",
            appointmentRequestStatus: "BOOK-APPOINTMENT-FAIL",
            message:
              "Create request Error: " + JSON.stringify(e),
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
            "\n" +
            "Language: " +
            state.language +
            "\n" +
            (addHeartbeatBuddies ? "Add Heartbeat Buddies" : "") +
            (addHeartbeatBuddies ? "\n" : "") +
            (add8kRealisticView ? "Add 8k Realistic View" : ""),
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
            startDateTime: moment(state.block.blockDate)
              .format("YYYY-MM-DD[T]HH:mm:ss")
              .toString(),
          }
          const postMail = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(mailBody),
          };
          const mailResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/book/sendMail`,
            postMail
          );

          if (!mailResponse.ok) {
            console.error(mailResponse)
          }

          let nameListAddons = [];
          if (selectedOptionAddons) {
            nameListAddons = selectedOptionAddons.map((i) => { return i.value });
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
            bookTimeUTC:  moment.utc(localTime.date).toISOString().split("T")[1], 
            servicePrice: clientState.sessionTypeName.includes("$") ? parseInt(clientState.sessionTypeName.split("$")[1]) : 0,
            siteId: state.siteId,
            source: "online",
            cbff: false,
            bookTime: moment(localTime.date).format("HH:mm")
          };
          const putDynamo = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(dynamoPayload),
          };
          const dynamoResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/dynamoDB/appointments`,
            putDynamo
          );
          const dynamoData = await dynamoResponse.json();
          if (dynamoResponse.ok) {
            // console.log(textMessageData);
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
              const leadResponse = await fetch(
                `${process.env.REACT_APP_API_URL}/api/book/clients`,
                leadRequest
              );
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
              date: moment(state.block.blockDate)
                .format("MM-DD-YYYY")
                .toString(),
              time: moment(state.block.blockDate).format("hh:mm A").toString()
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
  // Search the client to see if it exist in MindBody
  const onFormSubmit = async (data) => {
    scrollParenTop();
    let sessionTypeId = data.service.value;
    let sessionTypeName = data.service.label;

    setClientState((clientState) => ({
      ...clientState,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone.replace(/[^0-9]/gi, ''),
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
        `${process.env.REACT_APP_API_URL}/api/clients/clients?searchText=${data.phone.replace(/[^0-9]/gi, '')}`,
        searchClientsRequest
      );
      const searchClientsData = await searchClientsResponse.json();
      if (searchClientsResponse.ok) {

        setSendForm(true)

        if (
          data.firstName + " " + data.lastName ===
          searchClientsData.clients[0].name &&
          searchClientsData.clients[0].email === data.email &&
          searchClientsData.clients[0].phone.replace(/[^0-9]/gi, '') === data.phone.replace(/[^0-9]/gi, '')
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
        mobilePhone: data.phone.replace(/[^0-9]/gi, ''),
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
      const leadResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/book/clients`,
        leadRequest
      );
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
  const blockSelected = async () => {
    scrollParenTop();

    setStepTwo("success")

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

        const leadResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/book/clients`,
          leadRequest
        );

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

      };

    } catch (error) {
      console.error(error);
    }

  };
  // Takes the app to the availability step of booking
  const stepToAvailability = () => {
    scrollParenTop();
    let newSessionTypeId = clientState.sessionTypeId;
    let newSessionTypeName = clientState.sessionTypeName;

    // Changes the service in case of adding Babys Growth
    if (clientState.sessionTypeId === ultrasounds[3].value && addBabysGrowth) {
      newSessionTypeId = getBGCombo(
        "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $178",
        consultedUltrasounds
      );
      newSessionTypeName = "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $178";
    }
    if (clientState.sessionTypeId === ultrasounds[2].value && addBabysGrowth) {
      newSessionTypeId = getBGCombo(
        "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $138",
        consultedUltrasounds
      );
      newSessionTypeName = "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $138";
    }
    if (clientState.sessionTypeId === ultrasounds[1].value && addBabysGrowth) {
      newSessionTypeId = getBGCombo(
        "Gender Determination  + Baby's Growth - $118",
        consultedUltrasounds
      );
      newSessionTypeName = "Gender Determination  + Baby's Growth - $118";
    }
    setClientState((clientState) => ({
      ...clientState,
      sessionTypeId: newSessionTypeId,
      sessionTypeName: newSessionTypeName,
    }));
    setState((state) => ({
      ...state,
      step: "availability",
    }));
  };

  const stepProgressStyles = {
    default: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #a9a9a9"
    },
    error: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #dc3545"
    },
    success: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #AE678C ",
    },
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

  const showInMapClicked = () => {
    window.open(
      "https://maps.google.com?q=" + state.latitude + "," + state.longitude
    );
  };
  const showTerms = () => {
    setState((state) => ({
      ...state,
      displayTerms: true,
    }));
  };

  const hideTerms = () => {
    setState((state) => ({
      ...state,
      displayTerms: false,
    }));
  };

  const onChangeServices = (service) => {
    setSeletedService(service)
    setAddBabysGrowth(false);
    setAddHeartbeatBuddies(false);
    setAdd8kRealisticView(false)
  };

  const handleAddonsSelected = (e) => {
    const addons = e;
    setSelectedOptionAddons(addons);
    setHoverIndexBabyGrow(false)
    setHoverIndexHearthbeat(false)
    setHoverIndex8kRealisticView(false)
  }

  const handleFixedServices = () => {
    const service = {
      specialPromotion25min: seletedService ? seletedService.label.toLowerCase().replace(/[-.()+\s]/g, "").search("specialpromotion25min") : "",
      genderdetermination: seletedService ? seletedService.label.toLowerCase().replace(/[-.()+\s]/g, "").search("genderdetermination") : "",
      earlypregnancy: seletedService ? seletedService.label.toLowerCase().replace(/[-.()+\s]/g, "").search("earlypregnancy") : "",
      meetyourbaby25: seletedService ? seletedService.label.toLowerCase().replace(/[-.()+\s]/g, "").search("meetyourbaby25") : "",
      meetyourbaby15: seletedService ? seletedService.label.toLowerCase().replace(/[-.()+\s]/g, "").search("meetyourbaby15") : "",
    }
    setFixedServices((fixedServices) => ({
      ...fixedServices,
      specialPromotion25min: service.specialPromotion25min === 0,
      genderdetermination: service.genderdetermination === 0,
      earlypregnancy: service.earlypregnancy === 0,
      meetyourbaby25: service.meetyourbaby25 === 0,
      meetyourbaby15: service.meetyourbaby15 === 0,
    }));
  }
  useEffect(() => {
    handleFixedServices();
  }, [seletedService]);

  useEffect(() => {
    if (selectedOptionAddons) {

      let formattingSelectedOptionAddons;

      if (fixedServices.genderdetermination) {

        formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "8K Realistic View" })
        setSelectedOptionAddons(formattingSelectedOptionAddons)

      } else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {

        formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Baby's Growth" && i.value !== "8K Realistic View" })
        setSelectedOptionAddons(formattingSelectedOptionAddons)

      } else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {

        setSelectedOptionAddons(selectedOptionAddons)

      } else {
        setSelectedOptionAddons([])
      }
    }
  }, [seletedService, fixedServices])


  useEffect(() => {

    let babyGrow;
    let hearthbeat;
    let realisticView;

    if (selectedOptionAddons) {
      babyGrow = selectedOptionAddons.find(i => i.value === "Baby's Growth");
      hearthbeat = selectedOptionAddons.find(i => i.value === "Heartbeat Buddies");
      realisticView = selectedOptionAddons.find(i => i.value === "8K Realistic View");
    }

    if (fixedServices.genderdetermination) {

      setAddOns(addOnsToGenderDetermination)

      if (realisticView === undefined) setAdd8kRealisticView(false);

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToGenderDetermination[0].label = addOnsToGenderDetermination[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }
      if (babyGrow === undefined) {
        setAddBabysGrowth(false)
        addOnsToGenderDetermination[1].label = addOnsToGenderDetermination[1].label;
      } else {
        setAddBabysGrowth(true)
        babyGrow.label = <span>Baby's Growth</span>;
      }

    } else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {

      setAddOns(addOnsToMeetYourBaby)

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToMeetYourBaby[0].label = addOnsToMeetYourBaby[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }
      if (babyGrow === undefined) {
        setAddBabysGrowth(false)
        addOnsToMeetYourBaby[1].label = addOnsToMeetYourBaby[1].label;
      } else {
        setAddBabysGrowth(true)
        babyGrow.label = <span>Baby's Growth</span>;
      }
      if (realisticView === undefined) {
        setAdd8kRealisticView(false)
        addOnsToMeetYourBaby[2].label = addOnsToMeetYourBaby[2].label;
      } else {
        setAdd8kRealisticView(true)
        realisticView.label = <span>8K Realistic View</span>;
      }

    }
    else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {

      setAddOns(addOnsToEarlyPregnancy)

      if (babyGrow === undefined) setAddBabysGrowth(false);

      if (realisticView === undefined) setAdd8kRealisticView(false);

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToEarlyPregnancy[0].label = addOnsToEarlyPregnancy[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }

    } else {
      setAddHeartbeatBuddies(false)
      setAdd8kRealisticView(false)
      setAddBabysGrowth(false)
      setAddOns([])
    }

  }, [
    seletedService,
    selectedOptionAddons,
    fixedServices,
    ultrasounds
  ])

  useEffect(() => {
    let newSessionTypeId = clientState.sessionTypeId;
    let newSessionTypeName = clientState.sessionTypeName;

    if (fixedServices.meetyourbaby25 && addBabysGrowth) {
      newSessionTypeId = getBGCombo(
        "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $178",
        consultedUltrasounds
      );
      newSessionTypeName = "Meet Your Baby - 25 Min 5D/HD + Baby's Growth $178";
    }
    if (fixedServices.meetyourbaby15 && addBabysGrowth) {
      newSessionTypeId = getBGCombo(
        "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $138",
        consultedUltrasounds
      );
      newSessionTypeName = "Meet Your Baby - 15 Min 5D/HD + Baby's Growth $138";
    }
    if (fixedServices.genderdetermination && addBabysGrowth) {

      const costBabysGrowth = 29
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
  }, [
    sendForm,
    clientState.sessionTypeName,
    clientState.sessionTypeId,
    addBabysGrowth,
    seletedService,
    fixedServices
  ]);

  useEffect(() => {
    let formattingSelectedOptionAddons;
    if (modalHearthbeat) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Heartbeat Buddies" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAddHeartbeatBuddies(false)
    }
    if (modalBabyGrow) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Baby's Growth" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAddBabysGrowth(false)
    }
    if (modal8kRealisticView) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "8K Realistic View" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAdd8kRealisticView(false)
    }
  }, [modalBabyGrow, modalHearthbeat, modal8kRealisticView])


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
        setStepOne("invalid")
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
    clickButtonForm
  ])

  return (
    <div className="container">

      <div className="row mt-5 mx-auto align-items-center justify-content-center">

        <div className="col-md-12 d-flex">

          <div className={
            stepOne === "success" ? "btn btn-cta-active rounded-circle" :
              stepOne === "invalid" ? "btn rounded-circle btn-cta-invalid" :
                "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepOne === "success" ? "✓" :
              stepOne === "invalid" ? "X" : "1"}
          </div>

          <div className="col mt-3" style={
            stepOne === "success" ? stepProgressStyles.success :
              stepOne === "invalid" ? stepProgressStyles.error : stepProgressStyles.default} />

          <div className={
            stepTwo === "success" ? "btn btn-cta-active rounded-circle" :
              "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepTwo === "success" ? "✓" : "2"}
          </div>

          <div className="col mt-3" style={stepTwo === "success" ? stepProgressStyles.success : stepProgressStyles.default} />

          <div className={
            stepThree === "success" ? "btn btn-cta-active rounded-circle" :
              "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepThree === "success" ? "✓" : "3"}
          </div>

        </div>

      </div>
      <div className="row mx-auto align-items-center justify-content-center">
        <div className="col-12 d-flex">

          <span className="col col-md-3 col-lg-4 col-xl-4">Information</span>
          <div className="col" />
          <span className="col col-md-5 col-lg-4 col-xl-4 text-center">Schedule</span>
          <div className="col" />
          <span className="col col-md-3 col-lg-4 col-xl-4 text-end">Summary</span>

        </div>
      </div>

      {state.step === "registerForm" && (
        <>
          <form
            className="row my-3 registerForm mx-auto p-md-4 justify-content-center"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="row mb-3">
              <div className="col">
                <h1 className="h4 mt-2 mb-3 text-uppercase text-center">
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
                      isSearchable={false}
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
                      placeholder={
                        services.length > 0
                          ? "Select a service"
                          : "Loading services"
                      }
                      isDisabled={!services.length > 0}
                      className={
                        "dropdown w-100 mb-3" +
                        (errors.service ? " is-select-invalid" : "")
                      }
                      formatGroupLabel={formatGroupLabel}
                      styles={selectStyles}
                      isSearchable={false}
                      onChange={(service) => {
                        onChangeServices(service);
                        field.onChange(service);
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <Controller
                  name="addons"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isDisabled={!services.length > 0}
                      value={selectedOptionAddons}
                      isSearchable={false}
                      options={addOns}
                      placeholder={
                        services.length > 0
                          ? "Checkout out our amazing addons"
                          : "Loading addons"
                      }
                      className="dropdown w-100 mb-3"
                      isMulti
                      onChange={(e) => { handleAddonsSelected(e); field.onChange(e) }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col text-left">
                <Controller
                  name="temsCheckbox"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="form-check">
                      <input
                        className={
                          "form-check-input" +
                          (errors.temsCheckbox ? " is-select-invalid" : "")
                        }
                        {...field}
                        type="checkbox"
                      />
                      <label
                        className={
                          "form-check-label mx-2 " +
                          (errors.temsCheckbox ? " text-danger" : "")
                        }
                      >
                        {errors.temsCheckbox && (
                          <>
                            You have to agree to{" "}
                            <button
                              type="button"
                              className="btn btn-link pt-0 px-0 mx-0 mt-0"
                              onClick={showTerms}
                            >
                              {" "}
                              terms and conditions
                            </button>
                          </>
                        )}
                        {!errors.temsCheckbox && (
                          <>
                            Agree to{" "}
                            <button
                              type="button"
                              className="btn btn-link pt-0 px-0 mx-0 mt-0"
                              onClick={showTerms}
                            >
                              {" "}
                              terms and conditions
                            </button>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>

            {hoverIndexBabyGrow && (
              <div
                className={
                  hoverIndexBabyGrow
                    ? "lb-preview-info-card-visible-baby-grow col-3"
                    : "lb-preview-card"
                }
                style={{ fontSize: 13 }}
              >
                <div className="row mt-2">
                  <div className="col-12">
                    <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                      By adding this feature, you'll discover: baby's position in the uterus,
                      weeks of pregnancy and estimated due date, baby's measurements and baby hearts activity.
                      This add-on doesn't replace a medical study performed by your specialist</p>
                  </div>
                </div>
              </div>
            )}

            {hoverIndexHearthbeat && (
              <div
                className={
                  hoverIndexHearthbeat
                    ? "lb-preview-info-card-visible-hearthbeat col-3"
                    : "lb-preview-card"
                }
                style={{ fontSize: 13 }}
              >
                <div className="row mt-2">
                  <div className="col-12">
                    <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                      Some moments come once in a lifetime, and they should never be forgotten.
                      Recording the baby's heartbeat builds connection and strengthens the bond with baby.
                      Our beautiful, high-quality stuffed animals come with a 20-second recording of the baby's heartbeat that can be cherished forever.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hoverIndex8kRealisticView && (
              <div
                className={
                  hoverIndex8kRealisticView
                    ? "lb-preview-info-card-visible-8k-realistic-view col-3"
                    : "lb-preview-card"
                }
                style={{ fontSize: 13 }}
              >
                <div className="row mt-2">
                  <div className="col-12">
                    <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                      Will show our Mommies and Fathers a hyper-realistic image of what their babies will look like once they are born. We work with the ultrasound images from the session,
                      process them and send them to our clients within 7 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {state.displayTerms && (
              <div className="lb-modal-overlay" onClick={hideTerms}>
                <div className="lb-modal rounded">
                  <button
                    className="closeTermsButton btn btn-link m-0 p-0"
                    onClick={hideTerms}
                  >
                    <FontAwesomeIcon
                      className="white-icon"
                      size="lg"
                      icon={faTimesCircle}
                    />
                  </button>
                  <div className="lb-modal-body py-3 px-4 text-justify ">
                    <div className="row px-2 pb-2">
                      <div className="col ">
                        <h3>Little Bellies Terms of services.</h3>
                      </div>
                    </div>
                    <>
                      <p className="px-3 pt-3">
                        I am receiving ongoing prenatal care. <br />
                        <br />
                        I have undergone a medical diagnostic ultrasound
                        prescribed by my OB provider in regard to this
                        pregnancy. <br />
                        <br />I understand that my OB provider ultimately will
                        confirm my due date, screen for fetal abnormalities
                        and/or any issues/concerns related to my pregnancy.{" "}
                        <br />
                        <br /> Little Bellies is not a medical provider and will
                        not do any of the foregoing. <br />
                        <br />I understand that this ultrasound may not last
                        more than 25 minutes and will focus on my pelvic area.{" "}
                        <br />
                        <br />
                        I understand that this is a limited non-medical
                        ultrasound and does not replace any diagnostic
                        ultrasound ordered by my OB provider. <br />
                        <br />
                        I understand that there is a possibility that the wrong
                        gender may be assigned to my baby. <br />
                      </p>
                      <p className="px-3 pt-3">
                        Little Bellies is not a health care provider. Little
                        Bellies understands the importance of proper prenatal
                        medical care for both the expectant mother and the
                        fetus. Therefore, in order to provide our clients with a
                        meaningful “keepsake” ultrasound image, Little Bellies
                        requires that I: (i) truthfully certify that I am under
                        the care of a physician or other health care provider
                        for my pregnancy and that I am not obtaining this
                        ultrasound as a replacement for, or in lieu of, standard
                        prenatal medical care, and (ii) notify my current
                        physician or health care provider regarding the keepsake
                        ultrasound I receive from Little Bellies.
                        <br />
                        <br />
                        Little Bellies requests that I present to Little Bellies
                        an acknowledgement of receipt of this notice, signed by
                        my physician or health provider, prior to Little
                        Bellies’ performance of the keepsake ultrasound. In the
                        event I am unable to notify my physician or health
                        provider prior to performance of the keepsake
                        ultrasound, I assume sole responsibility for notifying
                        him or her as soon as practical following performance of
                        the keepsake ultrasound.
                        <br />
                        <br />
                        As further condition to my receiving ultrasound services
                        from Little Bellies, I hereby acknowledge, understand
                        and agree to the following statements.
                        <br />
                        <br />
                        <ul>
                          <li>
                            This ultrasound: (i) is an elective non-medical
                            procedure that I have voluntarily requested and (ii)
                            is not intended to take the place of a diagnostic
                            ultrasound or any other test or treatment that has
                            been or may be recommended by my physician or
                            healthcare provider.
                          </li>
                          <li>
                            Because of its elective, non-medical nature, this
                            ultrasound is generally not covered by insurance.
                            Therefore, advance payment is required.
                          </li>
                          <li>
                            The technician who performs the ultrasound, while
                            qualified to provide such ultrasound services, is
                            not a doctor, nurse, or healthcare provider and
                            cannot interpret, diagnose medical conditions from,
                            or otherwise offer medical advice regarding the
                            images produced.
                            <b>
                              {" "}
                              This ultrasound will not be read or interpreted by
                              any physician, nurse or other healthcare provider
                              at any time.
                            </b>
                          </li>
                          <li>
                            This keepsake ultrasound is intended to provide
                            enhanced images for the purpose of my viewing fetal
                            movement in utero. The technician will make no
                            attempt to guarantee a medically inclusive
                            ultrasound or fetal well being.
                          </li>
                          <li>
                            I understand that I am responsible for contacting my
                            own healthcare provider if I have any questions
                            concerning this keepsake ultrasound or any other
                            aspect of my pregnancy.
                          </li>
                          <li>
                            {" "}
                            I understand that the quality of the keepsake
                            ultrasound and the DVD, or other audio visual media,
                            depends upon many factors including: body tissue
                            content, developmental stage and fetal position.
                          </li>
                          <li>
                            I understand that Little Bellies does not guarantee
                            the quality of the DVD, or other audio visual media,
                            or the ability to visualize any characteristics of
                            the fetus.
                          </li>
                          <li>
                            I understand that publication, presentation or
                            distribution of any video taken during the
                            ultrasound session, not provided by Little Bellies,{" "}
                            <b> is strictly prohibited. </b>
                          </li>
                          <li>
                            I understand that all the images and video clips
                            taken during my session can be used for promotional
                            purposes by Little Bellies.
                          </li>
                          <li>
                            I agree to receive E-mail and SMS from Little
                            Bellies, as well as surveys, promotional offers and
                            marketing.
                          </li>
                          <li>
                            I accept to receive the images and videos of my
                            session in my E-mail and Smartphone.
                          </li>
                          <li>As evidenced by my signature below,</li>
                        </ul>
                        I understand that factors beyond Little Bellies’ control
                        may also affect the ability to accurately determine the
                        gender of the fetus, and that Little Bellies can provide
                        no warranty or guaranty as to the accuracy of any such
                        determination. <br />
                        <br />
                        I further understand and accept the risk that, while
                        ultrasound is believed to have no harmful effect on the
                        mother or the fetus, future research or other
                        information may disclose harmful or adverse effects that
                        are presently unknown. <br />
                        <br />
                        IN CONSIDERATION OF THE SERVICES RENDERED, I AGREE TO
                        RELEASE LITTLE BELLIES, ITS AGENTS, AFFILIATES, MEMBERS,
                        MANAGERS AND EMPLOYEES FROM ANY AND ALL CLAIMS OR CAUSES
                        OF ACTIONS FOR INJURY, HARM, DAMAGE, OR OTHER LIABILITY
                        WHICH RESULTS FROM, OR ARE ALLEGED TO HAVE RESULTED
                        FROM, THIS KEEPSAKE ULTRASOUND, INCLUDING BUT NOT
                        LIMITED TO, THE FAILURE OF A LITTLE BELLIES ULTRASOUND
                        TO ACCURATELY DETERMINE FETAL GENDER OR OTHER
                        CHARACTERISTICS OR ANOMOLIES AND ANY DAMAGES OR INJURIES
                        RESULTING FROM ULTRASOUND WHICH ARE NOT NOW KNOWN TO
                        OCCUR. <br />
                        <br />
                        “I have carefully read this document and by signing at
                        the bottom, acknowledge that I fully understand and
                        agree to its contents.”
                      </p>
                      <p className="px-3 pt-3">
                        I understand that all the images and video clips taken
                        during my session can be used for promotional purposes
                        by Little Bellies.
                        <br />
                        <br />
                        I agree to receive E-mail and SMS from Little Bellies,
                        as well as surveys, promotional offers and marketing.
                        <br />
                        <br />
                        I accept to receive the images and videos of my session
                        in my E-mail and Smartphone.
                        <br />
                        <br />
                        As evidenced by my signature below, I understand that
                        factors beyond Little Bellies control may also affect
                        the ability to accurately determine the gender of the
                        fetus, and that Little Bellies can provide no warranty
                        or guaranty as to the accuracy of any such
                        determination.
                        <br />
                        <br />
                        I further understand and accept the risk that, while
                        ultrasound is believed to have no harmful effect on the
                        mother or the fetus, future research or other
                        information may disclose harmful or adverse effects that
                        are presently unknown.
                        <br />
                        <br />
                      </p>
                    </>
                  </div>
                  <div className="lb-modal-footer lb-text-center ">
                    <button className="btn btn-cta-active rounded-pill px-3 mx-auto">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modalHearthbeat && (
              <div className="lb-modal-overlay-addons" >
                <div className="lb-modal-addons rounded-3">
                  <button
                    className="closeTermsButton btn btn-link m-0 p-0"
                    onClick={(e) => setModalHearthbeat(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      className="white-icon"
                      size="lg"
                      icon={faTimesCircle}
                    />
                  </button>
                  <div className="lb-modal-body-addons py-2 px-4 text-justify">
                    <>
                      <div className="row mt-2">
                        <div className="col-12 m-1 mt-3 py-3 text-center">
                          <p style={{ textAlign: 'justify' }}>
                            Some moments come once in a lifetime, and they should never be forgotten.
                            Recording the baby's heartbeat builds connection and strengthens the bond with baby.
                            Our beautiful, high-quality stuffed animals come with a 20-second recording of the baby's heartbeat that can be cherished forever.
                          </p>
                        </div>
                      </div>
                    </>
                  </div>
                  <div className="lb-modal-footer-addons lb-text-center ">
                    <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
                      onClick={(e) => setModalHearthbeat(false)}
                      style={{ cursor: "pointer" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            {modalBabyGrow && (
              <div className="lb-modal-overlay-addons" >
                <div className="lb-modal-addons rounded-3">
                  <button
                    className="closeTermsButton btn btn-link m-0 p-0"
                    onClick={(e) => setModalBabyGrow(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      className="white-icon"
                      size="lg"
                      icon={faTimesCircle}
                    />
                  </button>
                  <div className="lb-modal-body-addons py-2 px-4 text-justify">
                    <>
                      <div className="row mt-2">
                        <div className="col-12 m-1 mt-3 py-3 text-center">
                          <p style={{ textAlign: 'justify' }}>
                            By adding this feature, you'll discover: baby's position in the uterus,
                            weeks of pregnancy and estimated due date, baby's measurements and baby hearts activity.
                            This add-on doesn't replace a medical study performed by your specialist</p>
                        </div>
                      </div>
                    </>
                  </div>
                  <div className="lb-modal-footer-addons lb-text-center ">
                    <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
                      onClick={(e) => setModalBabyGrow(false)}
                      style={{ cursor: "pointer" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            {modal8kRealisticView && (
              <div className="lb-modal-overlay-addons" >
                <div className="lb-modal-addons rounded-3">
                  <button
                    className="closeTermsButton btn btn-link m-0 p-0"
                    onClick={(e) => setModal8kRealisticView(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      className="white-icon"
                      size="lg"
                      icon={faTimesCircle}
                    />
                  </button>
                  <div className="lb-modal-body-addons py-2 px-4 text-justify">
                    <>
                      <div className="row mt-2">
                        <div className="col-12 m-1 mt-3 py-3 text-center">
                          <p style={{ textAlign: 'justify' }}>
                            Will show our Mommies and Fathers a hyper-realistic image of what their babies will
                            look like once they are born. We work with the ultrasound images from the session,
                            process them and send them to our clients within 7 business days.</p>
                        </div>
                      </div>
                    </>
                  </div>
                  <div className="lb-modal-footer-addons lb-text-center ">
                    <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
                      onClick={(e) => setModal8kRealisticView(false)}
                      style={{ cursor: "pointer" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="row my-3">
              <div className="col text-center">
                <button
                  type="submit"
                  className="btn btn-cta-active rounded-pill px-3 mx-auto"
                  onClick={() => setClickButtonForm(true)}
                >
                  Check availabilities
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {state.step === "addons" && (
        <>
          <div className="row my-3 bg-light-container mx-auto p-md-4 justify-content-center">
            <div className="row mt-3 justify-content-center">
              <div className="col">
                <h3 className="h2">Check out our amazing add ons</h3>
              </div>
            </div>

            {showHB && (
              <div className="row gx-1 gx-md-2 mt-1 mt-md-3 mb-3 justify-content-center">
                <button
                  className="closeAddonsButton btn btn-link m-0 p-0"
                  onClick={stepToAvailability}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>

                {showBG && (
                  <div className="col-12 col-sm-6 px-4 px-sm-2 my-3 my-md-0 text-center ">
                    <div
                      className={
                        "btn-addOn rounded-3 px-3 mx-auto smaller-text w-100 h-100 " +
                        (addBabysGrowth
                          ? "btn-outline-addOn"
                          : "btn-outline-secondary-addOn")
                      }
                    >
                      <div className="row">
                        <div className="col addOnIcon">
                          <FontAwesomeIcon icon={faBaby} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col text-center">
                          <h3 className="h4">
                            Baby's <br className="d-none d-lg-block" /> Growth
                          </h3>
                        </div>
                      </div>
                      {showDetailsBG && (
                        <div className="row gx-3 mt-2">
                          <div className="col-12 padding-x-25 m-0 text-start">
                            <ul className="fa-ul mb-1 mb-md-3">
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Baby's measurements{" "}
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Baby's position in uterus
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Baby's weight
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Baby's heart activity
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Weeks of Pregnancy
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Estimated due date
                              </li>
                              <li className=" lh-md">
                                <span className="fa-li">
                                  <FontAwesomeIcon icon={faCheck} />
                                </span>
                                Amniotic fluid
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      <div className="row gx-3 mt-2">
                        <div className="col-6 px-1 m-0">
                          <button
                            type="submit"
                            className="btn btn-cta-active smaller-text rounded-pill py-1 px-3 mx-auto w-100"
                            onClick={() => {
                              setShowDetailsBG(!showDetailsBG);
                            }}
                          >
                            {showDetailsBG && (
                              <FontAwesomeIcon icon={faChevronUp} />
                            )}
                            {!showDetailsBG && (
                              <FontAwesomeIcon icon={faChevronDown} />
                            )}
                            &nbsp;Details
                          </button>
                        </div>
                        <div className="col-6 px-1 m-0">
                          <button
                            className="btn btn-cta-active rounded-pill py-1 smaller-text px-3 mx-auto w-100"
                            onClick={handleAddBabysGrowth}
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
                          </button>
                        </div>
                      </div>
                      <div className="row justify-content-center my-2">
                        <div className="col-auto fw-bold display-6">
                          <span className="">$29</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12 col-sm-6 px-4 px-sm-2 my-3 my-md-0 text-center ">
                  <div
                    className={
                      "btn-addOn rounded-3 px-3 mx-auto smaller-text w-100 h-100 " +
                      (addHeartbeatBuddies
                        ? "btn-outline-addOn"
                        : "btn-outline-secondary-addOn")
                    }
                  >
                    <div className="row">
                      <div className="col addOnIcon">
                        <FontAwesomeIcon icon={faHeartbeat} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col text-center">
                        <h3 className="h4">Heartbeat Buddies</h3>
                      </div>
                    </div>
                    {showDetailsHB && (
                      <div className="row gx-3 mt-2">
                        <div className="col-12 padding-x-25 m-0 text-start">
                          <ul className="fa-ul mb-1 mb-md-3">
                            <li className=" lh-md">
                              <span className="fa-li">
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              Beautiful high-quality stuffed animal{" "}
                            </li>
                            <li className=" lh-md">
                              <span className="fa-li">
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              Recording of baby's heartbeat{" "}
                            </li>
                            <li className=" lh-md">
                              <span className="fa-li">
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              Cherished forever{" "}
                            </li>
                            <li className=" lh-md">
                              <span className="fa-li">
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              Build connection an strenghtens bond with baby
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    <div className="row algo gx-3 mt-2">
                      <div className="col-6 px-1 m-0">
                        <button
                          type="submit"
                          className="btn btn-cta-active smaller-text rounded-pill py-1 px-3 mx-auto w-100"
                          onClick={() => {
                            setShowDetailsHB(!showDetailsHB);
                          }}
                        >
                          {showDetailsHB && (
                            <FontAwesomeIcon icon={faChevronUp} />
                          )}
                          {!showDetailsHB && (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                          &nbsp;Details
                        </button>
                      </div>
                      <div className="col-6 px-1 m-0">
                        <button
                          className="btn btn-cta-active rounded-pill py-1 smaller-text px-3 mx-auto w-100"
                          onClick={handleAddHeartbeatBuddies}
                        >
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
                        </button>
                      </div>
                    </div>
                    <div className="row justify-content-center my-2">
                      <div className="col-auto fw-bold display-6">
                        <span className="">$35</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col text-center">
                {(addHeartbeatBuddies || addBabysGrowth) && (
                  <button
                    type="button"
                    className="btn btn-selected-block btn-sm rounded-pill px-3 m-2"
                    onClick={stepToAvailability}
                  >
                    Check availability
                  </button>
                )}
                {!addHeartbeatBuddies && !addBabysGrowth && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill btn-sm px-3 m-2"
                    onClick={stepToAvailability}
                  >
                    No thanks, maybe later
                  </button>
                )}
              </div>
            </div>
          </div>
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
                  onClick={() => { setStepTwo("default"); previousStep("availability"); }}
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
                  endDate={100}
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
                        <div
                          className="col-auto mx-0 d-flex d-sm-block"
                          key={index}
                        >
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
            {(state.availabilityRequestStatus === "loading" || state.availabilityRequestStatus === "BOOK-APPOINTMENT-OK") && (
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
          <div className="row mt-4 gx-5">
            {state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
              <div className="col d-flex justify-content-between">
                <h1 className="h3 text-uppercase text-center">
                  Your booking information
                </h1>
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
                      <div className="d-block alert alert-danger text-center">
                        <span>
                          {" "}
                          There has been an error booking your appointment, please
                          try again, if the error persist please call this number:{" "}
                          <a href={`tel:${state.phone}`}>{state.phone}</a> and we
                          will get you sorted out{" "}
                        </span>
                      </div>
                    )}
                  {state.textMessageStatus === "TEXT-FAIL" && (
                    <div className="d-block alert alert-warning">
                      <span> {state.textMessage} </span>
                    </div>
                  )}
                  {/* {state.appointmentRequestStatus === "BOOK-APPOINTMENT-OK" && (
                    <div className="d-block alert alert-success text-uppercase text-center fw-bold">
                      <span>
                        {" "}
                        Hooray! Your appointment has been successfuly booked!{" "}
                      </span>
                    </div>
                  )} */}
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
              {(
                <>
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

                  {addHeartbeatBuddies || add8kRealisticView ?
                    <div className="row mb-3">
                      <div className="col">
                        <div>
                          <b>Addons: </b>
                          {addHeartbeatBuddies && ("Add Heartbeat Buddies ")}
                          {addHeartbeatBuddies && add8kRealisticView && ("-")}
                          {add8kRealisticView && (" Add 8k Realistic View")}
                        </div>
                      </div>
                    </div>
                    : ""}

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
                      <div className="col">
                        <b>Location Address: </b>
                        {removeTags(state.address)}
                        {/* <span className="link-primary" style={{cursor: "pointer"}}  onClick={showInMapClicked}>
                    {removeTags(state.address)}
                    </span> */}
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
                  {/* { state.language !== 'English' && (
              <div className="row mb-2">
                <div className="col">
                  <div>Language: <b>{state.language}</b></div>
                </div>
              </div>
            )} */}
                  {/* {state.appointmentRequestStatus === "BOOK-APPOINTMENT-OK" && (
                <div className="row mb-2">
                  <div className="col">
                    <div>
                      <a target="_blank" href={formUrl}>
                        Please, remember to fill out the form before your
                        appointment HERE
                      </a>
                    </div>
                  </div>
                </div>
              )} */}
                </>
              )}

              {state.appointmentRequestStatus !== "BOOK-APPOINTMENT-OK" && (
                <>
                  {/* 
                  <div className="row no-gutters">
                    <div className="col captcha-container px-0 d-flex">
                      <ReCAPTCHA
                        sitekey="6LdsCnAcAAAAAHG8I-ADbn4GG6ztVOzEO0C93Yuh"
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  */}
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
                                <FontAwesomeIcon spin icon={faSpinner} />{" "}
                                Booking
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
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
