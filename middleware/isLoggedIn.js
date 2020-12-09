//all middleware takes req res next
module.exports = function(req, res, next) {
	//if there isn't a user glued on to request object then 
	//it'll flash an error and redirect to login page
	if (!req.user) {
		req.flash('error', 'You must be logged in to access that page.');
		res.send('nobody is logged in');
	} else {
		next();
	}
}