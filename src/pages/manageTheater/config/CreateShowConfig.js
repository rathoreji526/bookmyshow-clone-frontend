export const createShow = {
  "formTitle": "Create Show Configuration",
  "fields": [
    {
      "name": "startTime",
      "label": "Start Time",
      "type": "datetime-local",
      "required": true
    },
    {
      "name": "endTime",
      "label": "End Time",
      "type": "datetime-local",
      "required": true
    },
    {
      "name": "language",
      "label": "Language",
      "type": "dropdown",
      "required": true,
      "options": [
        "ENGLISH",
        "HINDI",
        "DUTCH",
        "JAPANESE",
        "KANNADA",
        "TELUGU"
      ]
    },
    {
      "name": "format",
      "label": "Format",
      "type": "dropdown",
      "required": true,
      "options": [
        "FORMAT_3D",
        "FORMAT_2D",
        "FORMAT_1D",
        "FORMAT_IMAX"
      ]
    },
    {
      "name": "price_silver",
      "label": "Silver Price",
      "type": "number",
      "step": "0.01",
      "required": true,
      "placeholder": "Enter Silver seat price"
    },
    {
      "name": "price_gold",
      "label": "Gold Price",
      "type": "number",
      "step": "0.01",
      "required": true,
      "placeholder": "Enter Gold seat price"
    },
    {
      "name": "price_premium",
      "label": "Premium Price",
      "type": "number",
      "step": "0.01",
      "required": true,
      "placeholder": "Enter Premium seat price"
    }
  ]
}