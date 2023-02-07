import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";
import "./styles/info.css";
import StepProgress from "../src/components/stepProgress"
import RegisterForm from "../src/components/registerForm"
import SelectTimeAppointment from "../src/components/selectTimeAppointment"
import BookAppointment from "../src/components/boookAppointment"
import { blocks, removeTags } from "../src/config/constans.js"
import { useForm } from "react-hook-form";

function App() {
  const params = new URLSearchParams(window.location.search);
  const languageList = { en: "English", es: "Spanish" };
  const [firstLoad, setFirstLoad] = useState(true);
  const [localTime, setLocalTime] = useState({ date: new Date });
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

  const [leadState, setLeadState] = useState({
    clientFound: false,
    leadRegistered: false,
    leadDeleted: false,
    leadUpdate: false,
    partititonKey: "",
    orderKey: "",
  });

  const parent_origin = 'https://test.littlebelliesspa.com'
  // const parent_origin = "https://www.littlebelliesspa.com";
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
    }
  }, [sitesInfo, localTime.date])

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

  // Loads the dropdown values and set the states for that display on first load
  useEffect(() => {
    async function getServices() {
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
      let minDate; if (a && b) a.startDateTime < b.startDateTime ? minDate = a : minDate = b;
      return minDate;
    }, {});
  }

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
                    if (blockDate > moment(localStartTime).toString() && blockDate > moment(firstAppointment).toString()) {
                      firstBlockTime = moment(localStartTime).toString();
                    }
                  }
                }
              } else {
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


  return (
    <div className="container">

      <StepProgress
        stepOne={stepOne}
        stepTwo={stepTwo}
        stepThree={stepThree}
      />

      {state.step === "registerForm" && (
        <RegisterForm
          scrollParenTop={scrollParenTop}
          setClientState={setClientState}
          state={state}
          setState={setState}
          clientState={clientState} 
          setLeadState={setLeadState}
          params={params}
          weeks={weeks}
          services={services}
          selectedOptionAddons={selectedOptionAddons}
          setStepOne={setStepOne}
          control={control}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          setSelectedOptionAddons={setSelectedOptionAddons}
          ultrasounds={ultrasounds}
          setAddHeartbeatBuddies={setAddHeartbeatBuddies}
          setAdd8kRealisticView={setAdd8kRealisticView}
          consultedUltrasounds={consultedUltrasounds}
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
          removeTags={removeTags}
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
