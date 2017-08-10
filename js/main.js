window.Event = new Vue()


//component for dropdown menu with jobs_id
const dropdown = Vue.component('dropdown',{
	template:`
		<div class="dropdown">
		<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Select Job
		<span class="caret"></span></button>
			<ul class="dropdown-menu">
				<li v-for = "item in items" >
					<a href="#" @click="selectJob(item.job_id)">{{item.job_title}}</a>
				</li>
			</ul>
		</div>
	`,
	data(){
		return{items:{}}
	},

	mounted(){
		axios.post('http://localhost/vue_server/web/api/apivone/getjobs').then(response => this.items = response.data.success.data );
	},
	methods:{
		selectJob(job_id){
			Event.$emit('find_freelancers', job_id);
		}

	},
	computed:{
	}
});

//component with the personal cards of each freelancer
const freelancer = Vue.component('freelancer',{
	template:`
	<div class="container" style="padding:60px">
	<h1>{{lancers.message}}</h1>
		<div class="custom_media media col-md-5" v-for = "lancer in sorted(lancers.data)">
			<div class="media-left">
				<img :src="lancer.avatar_img" class="d-flex mr-3 img-circle" style="width:60px">
			</div>
			<div class="media-body row">
				<h4 class="media_text media-heading col-md-10">{{lancer.first_name + ' ' + lancer.last_name}}</h4>
				<h5 class="media_text col-md-9">{{lancer.job_title}}</h5>
				<router-link :to="{ name: 'sendemail', params: { id: lancer.id }}"><button :disabled="lancer.available == 0" class="btn btn-success col-md-3">HIRE ME</button></router-link>
				<h6 class="media_text col-md-9">{{availability(lancer.available)}}</h6>
			</div>
		</div>
	</div>
	`,
	//fetch success response to lancers
	data(){
		return { lancers:{} }
	},
	//Mounted method to json post request
	mounted(){
		axios.post('http://localhost/vue_server/web/api/apivone/getallfreelancers').then(response => this.lancers = response.data.success);
	},
			
	//axios.post(url).then(response => this.lancers = response.data.success.data );

	methods:{
		findByjobId: function(job_id){
			
				var url = 'http://localhost/vue_server/web/api/apivone/getfreelancers?id=' + job_id;
				axios.post(url).then(response=>this.lancers= response.data.success.data);

		},
		availability(available){
			 var attr = available == 1 ?  'Available' : 'Unavailable';
			 return attr; 

		},

		sorted(lancers_data){
			console.log('here');
			if (typeof lancers_data !== 'undefined'){
				lancers_data = lancers_data.sort(this.predicateBy("last_name", "available"));
			}
			return lancers_data;
		},
		predicateBy(prop1, prop2){


			/*sort by 2 props*/
			return function(a,b){
			if( a[prop2] < b[prop2]){
			  return 1;
			}else if( a[prop2] > b[prop2] ){
			  return -1;
			}else if(a[prop2] = b[prop2] ){
				if( a[prop1] > b[prop1]){
				  return 1;
				}else if( a[prop1] < b[prop1] ){
				  return -1;
				}
			}
			}
		},

	},


	created(){
		Event.$on('find_freelancers', (job_id)=>{this.findByjobId(job_id);});
	},


});

//component for the email form
const sendemail = Vue.component('sendemail',{
	template:`
		<form>
		<div class="form-group">
    		<label for="firstname">Firstname</label>
    		<input type="text" class="form-control" id="firstname" v-model="email_form.firstname" placeholder="Firstname" pattern="^.{1,55}$" required>
  		</div>
  		<div class="form-group">
    		<label for="lastname">Lastname</label>
    		<input type="text" class="form-control" id="lastname" placeholder="Lastname" v-model="email_form.lastname" pattern="^.{1,55}$" required>
  		</div>
		<div class="form-group">
			<label for="recepient">Recepient</label>
			<input type="email" class="form-control" id="recepient" aria-describedby="emailHelp" placeholder="Enter email" v-model="email_form.recepient" required>
			<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
		</div>
		<div class="form-group">
			<label for="subject">Subject</label>
    		<input type="text" class="form-control" id="subject" v-model="email_form.subject" placeholder="Subject" pattern="^.{1,128}$" required>
		</div>
		<div class="form-group">
			<label for="message">Message</label>
			<textarea class="form-control" id="message" v-model="email_form.message" rows="3" placeholder="Write some words is free"></textarea pattern="^.{1,1024}$" required>
			<small id="messageCount" class="form-text text-muted">{{email_form.message}}</small>
		</div>
		<h1>{{$route.params.id}}</h1>
		<button type="submit" @click="submit_email" class="btn btn-success">Submit</button>
	</form>
	`,

	data(){
		return {email_form:{}}
	},
	methods:{
		submit_email(){
			//console.log(this.$route.params.id);
			//alert(submit_email);
			this.email_form.freelancer_id = this.$route.params.id;
			//console.log(this.email_form);
	
			
			axios({
				method:'post',
				url:'http://localhost/vue_server/web/api/apivone/sendemail', 
				data: $.param(this.email_form),
				headers: {
					'Content-type': 'application/x-www-form-urlencoded'
				}
			})
			.then(function(response){
				console.log(response.data)
			})
			.catch(function(error){
				alert(error.message)
			});
	
		}
	},
	watch:{
		'email_form.message':{
			handler(val, oldval){
				 console.log(val)
			},
			deep: true
		}
	},
});



const routes = [
{
	path: '/sendemail/:id',
	name: 'sendemail',
	sendemail,
},
]

const router = new VueRouter({
	routes,
})


new Vue({

	el: '#root',
	router,
})