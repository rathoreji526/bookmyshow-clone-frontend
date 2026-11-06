export const addMovieProperties = [
    { name: 'name', label: 'Movie Name', type: 'text', placeholder: 'Enter movie name', required: true },
    { name: 'duration', label: 'Duration (mins)', type: 'number',min:0, placeholder: 'Enter duration in minutes', required: true },
    { name: 'language', label: 'Language', type: 'text', placeholder: 'Enter language', required: true },
    { name: 'releaseDate', label: 'Release Date', type: 'datetime-local', placeholder: '', required: true },
    { name: 'posterUrl', label: 'Poster URL', type: 'text', placeholder: 'Paste poster URL here', required: true },
    { name: 'rating', label: 'Rating', type: 'number', step: 'any',min:0,max:10, placeholder: 'Enter rating (e.g. 4.5)', required: true }
];