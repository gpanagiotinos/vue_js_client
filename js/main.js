new Vue({

	el: '#root',

	data:{
		items:[],
		text: 'Available Jobs',
		
	},

	created: function(){
			this.getJson();},

	methods:{
		getJson(){
			axios.post('http://localhost/vue_js/web/api/apivone/getjobs')
			.then(function (response) {
				this.items = response.data;
				console.log(items);
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	}


})