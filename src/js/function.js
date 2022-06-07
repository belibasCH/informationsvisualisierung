$(document).ready(function () {
    $('#fullpage').fullpage({
        sectionsColor: ['#FFFFFF', '#EEEEEE', '#e2e2e2', '#FFFFFF', '#f8dc00',],
        easingcss3: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        navigation: true,
        navigationTooltips: ['Home', 'Map', 'Distances', 'Taxes', 'Welcome!',],

        afterLoad: function (origin, destination, direction) {
            if (destination.index == 1) {

                changeDistance(30);

            }
            if (destination.index == 2) {
                displaygraph();

            }
        },
        onLeave: function (origin, destination, direction) {
            if (origin.index == 2) {
                cleanGraph();
            }
        },
    });
});