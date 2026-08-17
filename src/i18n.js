// Central i18n module for the booking widget MAIN FLOW (es/en).
//
// Dictionary keys are the EXACT English strings shown in the UI. Components wrap
// visible text with `translate(englishText, state.language)` (pattern: trans[text] || text).
// Only the `es` dictionary needs entries — English falls back to the source text,
// so any missing key renders the original English string.
//
// `state.language` is the source of truth and holds "English" | "Spanish"
// (set from the ?lang query param and, in resume mode, from the lead).

// Normalize a language value ("Spanish" | "es" | "ES" | ...) to "es"; anything else -> "en".
export function toLang(v) {
  const s = String(v || "").toLowerCase();
  return s === "spanish" || s === "es" ? "es" : "en";
}

export const translations = {
  es: {
    // ---- stepProgress ----
    "Information": "Información",
    "Schedule": "Agenda",
    "Summary": "Resumen",

    // ---- registerForm ----
    "Please enter your information": "Por favor ingresa tu información",
    "In order to book an appointment please provide the following information":
      "Para agendar tu cita, por favor completa la siguiente información",
    "First name": "Nombre",
    "Last Name": "Apellido",
    "Email": "Correo electrónico",
    "Phone number": "Número de teléfono",
    "Select Pregnancy Weeks": "Selecciona las semanas de embarazo",
    "Select a service": "Selecciona un servicio",
    "No services available for this week": "No hay servicios disponibles para esta semana",
    "Loading services": "Cargando servicios",
    "Checkout out our amazing addons": "Descubre nuestros increíbles complementos",
    "Select a week and service first": "Selecciona primero una semana y un servicio",
    "Loading addons": "Cargando complementos",
    "You have to agree to": "Debes aceptar los",
    "Agree to": "Acepto los",
    "terms and conditions": "términos y condiciones",
    "Check availabilities": "Ver disponibilidad",

    // ---- selectTimeAppointment-v2 (schedule) ----
    "BACK": "ATRÁS",
    "Select time for you appointment:": "Selecciona la hora para tu cita:",
    "NEXT": "SIGUIENTE",
    "Sorry, there are no available appointments for this date":
      "Lo sentimos, no hay citas disponibles para esta fecha",
    "Please select another day on the calendar or call us to help you book at":
      "Por favor selecciona otro día en el calendario o llámanos para ayudarte a agendar al",
    "Loading": "Cargando",
    "There was an error, please call us to help you book at":
      "Hubo un error, por favor llámanos para ayudarte a agendar al",

    // ---- boookAppointment (summary / confirmation) ----
    "Your booking information": "Información de tu reserva",
    "Book appointment": "Agendar cita",
    "Booking": "Agendando",
    "There has been an error booking your appointment, please try again, if the error persist please call this number:":
      "Hubo un error al agendar tu cita, por favor inténtalo de nuevo. Si el error persiste, por favor llama a este número:",
    "and we will get you sorted out": "y te ayudaremos a resolverlo",
    "Full Name:": "Nombre completo:",
    "Service:": "Servicio:",
    "Addons:": "Complementos:",
    "Date:": "Fecha:",
    "Time:": "Hora:",
    "Location Address:": "Dirección:",
    "How to Arrive :": "Cómo llegar:",
    "Location Phone:": "Teléfono:",
    "discount applied": "descuento aplicado",
    "Your": "Tu",
    "off is noted on this appointment.": "de descuento quedó registrado en esta cita.",
  },
};

// Return the localized string, falling back to the English source text when the
// key is missing (or the language is English).
export function translate(text, lang) {
  return translations[toLang(lang)]?.[text] ?? text;
}
