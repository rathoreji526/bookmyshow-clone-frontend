export const addScreen = {
  title: "Add New Screen",
  fields: [
    {
      name: "screenName",
      label: "Screen Name",
      type: "text",
      placeholder: "Enter screen name",
      required: true,
    },
    {
      name: "totalRows",
      label: "Total Rows",
      type: "number",
      placeholder: "Enter total rows",
      required: true,
    },
    {
      name: "seatsPerRow",
      label: "Seats Per Row",
      type: "number",
      placeholder: "Enter seats per row",
      required: true,
    },
  ],
};