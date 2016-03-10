/**
 * GET /dashboard
 * Dashboard
 */

exports.getDashboard = function(req, res) {
    res.render('dashboard', {
        title: 'Dashboard'
    });
};