const Melon = require('./melon');
const Filters = require('./melonFilters');

// Melon.getCurrentChart();
// Melon.getCurrentChart('day');
// Melon.getCurrentChart('week');
Melon.getCurrentChart('month')
.then((res) => {
    console.log(res);
})
.catch((error) => {
    console.log(error);
})
