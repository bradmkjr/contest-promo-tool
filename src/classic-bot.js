const Twit = require('twit');

const T = new Twit( {
  consumer_key: process.env.twitter_consumer_key,
  consumer_secret: process.env.twitter_consumer_secret,
  access_token: process.env.twitter_access_token,
  access_token_secret: process.env.twitter_access_token_secret
} );

// default age for active cache entries
const cacheLifetime = '168 hour';

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

client.connect(function(err, res){ });

var a = 88;

const limit = '1000';

const pause = 60000;

var cursor = -1;

getUser();

function getUser(){
	var method = 'get';	
	var command = 'users/show';
	var options = { "user_id": a, "include_entities": false  };	
	
	getCache( command, options, function(err, data){		
		if( data == undefined ){ // Cache Miss!!
			console.log('Cache Miss: getUser');				
			twitterApi(method, command, options, function(data){
				console.log(data.screen_name);
				cursor = -1;
				getFriends();
			});				
		}else if( data.code == 404 || data.code == 401 || data.code == 403 ){ // Cache HIT
			console.log('Cache Hit: getUser Status: '+data.code);			
			reset();	
		}else{ // Cache HIT
			console.log('Cache Hit: getUser Status: '+data.code + ' Screen name:' + data.screen_name);
			cursor = -1;
			getFriends();
		}		
	});	
}

function getFriends(){
	method = 'get';	
	command = 'friends/list';
	options = { "user_id": a, "include_entities": false, "count": 200, "cursor": cursor  };	
	
	getCache( command, options, function( err, data ){
		if( data == undefined ){ // Cache Miss!!
			console.log('Cache MISS: getFriends Index: '+a );
			twitterApi( method, command, options, function(data){
				for( i = 0; i < data.users.length; i++){
				    	recordAccount(data.users[i], i, function(error, results, data){ });
					}
				wait(pause);
				if( data.next_cursor_str != 0 ){
					cursor = data.next_cursor_str;
					// console.log(cursor);
					getFriends();
				}else{
					cursor = -1;
					getFollowers();		
				}				
			});
		}else if( data.code == 404 || data.code == 401 || data.code == 403 ){ // Cache HIT for invalid response	
			reset()	
		}else{ // Cache HIT
			console.log('Cache HIT: getFriends Index: '+a );
			for( i = 0; i < data.users.length; i++){
			    	recordAccount(data.users[i], i, function(error, results, data){ });
				}
			if( data.next_cursor_str != undefined && data.next_cursor_str != 0 ){
				cursor = data.next_cursor_str;
				// console.log(cursor);
				getFriends();
			}else{
				cursor = -1;
				getFollowers();		
			}				
		}
	});
}
	
function getFollowers(){

	method = 'get';		
	command = 'followers/list';
	options = { "user_id": a, "include_entities": false, "count": 200, "cursor": cursor };	
	
	getCache( command, options, function( err, data ){	
		if( data == undefined ){	
			console.log('Cache MISS: getFollowers Index: '+a );
			twitterApi( method, command, options, function(data){
				for( i = 0; i < data.users.length; i++){
				    	recordAccount(data.users[i], i, function(error, results, data, index){ });
					}
				wait(pause);
				if( data.next_cursor_str != 0 ){
					cursor = data.next_cursor_str;
					// console.log(cursor);
					getFollowers();
				}else{
					cursor = -1;
					reset();		
				}						
			});	
		}else if( data.code == 404 || data.code == 401 || data.code == 403 ){ // Cache HIT						
			reset();	
		}else{ // cache hit
			console.log('Cache HIT: getFollowers Index: '+a );	
			if(data.code == 200){
				for( i = 0; i < data.users.length; i++){
				    	recordAccount(data.users[i], i, function(error, results, data, index){ });
					}
			}
			if( data.next_cursor_str != 0 ){
				cursor = data.next_cursor_str;
				// console.log(cursor);
				getFollowers();
			}else{
				cursor = -1;
				reset();		
			}
		}
	});	
}

function reset(){
	a++;
	console.log('Index: '+a);	
	if( a < limit ){
		getUser();
	}else{
		console.log('Done!!');
		process.exit();		
	}
}

function twitterApi(method, command, options, callback){

	if( 'post' == method ){
		T.post(command, options,  twitterCallback); // end users/show
	}else{
		T.get(command, options, twitterCallback); // end users/show
	}	

function twitterCallback(error, data, response) {
						      					            
		    if( response.statusCode == 404 || response.statusCode == 401  || response.statusCode == 403 ){
		    	writeCache(command, options, response.statusCode, '{}', function(){
			    	console.log("Writing Cache: Error "+response.statusCode);
					a++;
					console.log(a);	
					if( a < limit ){
						wait(pause);
						getUser();
					}else{
						console.log('Done!!');
						process.exit();		
					}				    	
		    	});
								
		    }else if(error != undefined || response.statusCode != 200 ){
				console.log("Something went wrong!");
				console.log(error);
				console.log(response.statusCode);			
		   
		    }else{
				writeCache(command, options, response.statusCode, data, callback);
			}
	}

}

function getCache( command, options, callback){
	
	// query database for data based on key with date within lifetime
	const text = "SELECT command, options, code, data FROM twitapicache WHERE command = $1 AND options = $2 AND date_updated > now() - interval '"+cacheLifetime+"' ;";
	const values = [command, options];
	
	// callback
	client.query(text, values, (err, res) => {
	  if (err) {
	    callback(err, undefined );  
	  } else if( res.rows == undefined || res.rows.length == 0 ){
		callback(err, undefined );  
	  } else {
	  	data = res.rows[0].data;
	  	data.code = res.rows[0].code;
	  	callback(err, data);
	  }
	});
	
}



function writeCache( command, options, code, data, callback ){
	
	const text = "WITH upsert AS (UPDATE twitapicache SET data = $3, date_updated = now(), code = $4 WHERE command = $1 AND options = $2 RETURNING *) INSERT INTO twitapicache ( command, options, data, date_created, date_updated, code ) SELECT $1, $2, $3, now(), now(), $4 WHERE NOT EXISTS (SELECT * FROM upsert);";
	const values = [ command, options, data, code ];
				
	// callback
	client.query(text, values, (err, res) => {
	  if (err) {
	    console.log(err.stack)
	  } else {
	  	// console.log(values);	   
	  	data.code = code; 
	  	callback(data);
	  }
	}); // end client.query			
	
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   var seconds = ( ms / 1000 );
   var last = end;
   while(end < start + ms) {
   	 if( 0 == ( end % 1000 ) && last != end ){
	  // 	 console.log('Waiting: '+ ( --seconds )+' seconds');
   	 }
   	 last = end;
     end = new Date().getTime();
  }
}

function recordAccount(data, index, callback){
	
	const text = "WITH upsert AS (UPDATE account SET data = $3, date_updated = now() WHERE user_id = $1 RETURNING *) INSERT INTO account ( user_id, user_name, data, date_created, followers_count, friends_count, statuses_count, created_at, status_created_at ) SELECT $1, $2, $3, now(), $4, $5, $6, $7, $8 WHERE NOT EXISTS (SELECT * FROM upsert);";
	const values = [ data.id_str, data.screen_name, data, data.followers_count, data.friends_count, data.statuses_count, data.created_at, (data.status != undefined && data.status.created_at != undefined)?data.status.created_at:null ];
	
	// callback
	client.query(text, values, (error, results) => {	
	  if (error) {
	    console.log(error);
	    console.log(error.stack);
	    callback(error, results);
	  } else {
	  	callback(error, results, data, index);
	  }
	}); // end client.query
	
}
