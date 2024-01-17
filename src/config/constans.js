export const blocks = [
	{
		id: 0,
		segment: "08:00 AM",
		endSegment: "08:30 AM",
		appointment: {},
	},
	{
		id: 1,
		segment: "08:30 AM",
		endSegment: "09:00 AM",
		appointment: {},
	},
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

export const removeTags = (str) => {
	if (str === null || str === "") return false;
	else str = str.toString();

	// Regular expression to identify HTML tags in
	// the input string. Replacing the identified
	// HTML tag with a null string.
	return str.replace(/(<([^>]+)>)/gi, "");
};
