import VueRouter from 'vue-router';

let routes = [
{
	path: "/sendemail",
	component: require('./home.html')
},

];

export default new VueRouter({
	routes
});