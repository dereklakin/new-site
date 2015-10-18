var rootURL = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') {
	rootURL = 'http://<your-site>';
}

module.exports = {
	'rootURL': rootURL
};