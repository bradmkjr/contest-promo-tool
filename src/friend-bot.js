const Twit = require('twit');

const T = new Twit( {
  consumer_key: process.env.twitter_consumer_key,
  consumer_secret: process.env.twitter_consumer_secret,
  access_token: process.env.twitter_access_token,
  access_token_secret: process.env.twitter_access_token_secret
} );

// default age for active cache entries
const cacheLifetime = '128 hours';

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

client.connect(function(err, res){ });

var accounts = ["6BillionPeople", "colortheory", "MurrayNewlands", "alispagnola", "hootsuite", "JETAR9", "LollyDaskal", "toddcarey", "kenradio", "nine_oh", "yokoono", "machavelli7", "Radioblogger", "DigitalTrends", "CynthiaLIVE", "NOH8Campaign", "LeadToday", "TayeDiggs", "tbhdaphne", "threadless", "BarackObama", "FreddyAmazin", "MLMGods", "2morrowknight", "joelcomm", "BeatingHerUnder", "RareCat", "JohnCMaxwell", "DaveVescio", "trinityadam", "BeefEnt", "CrimeConspiracy", "KushNMusicss", "soledadobrien", "jilevin", "ChopDawgStudios", "iamrobertdobbs", "britneyspears", "amhaunted", "WarrenWhitlock", "RTtheBEST", "JamesKyson", "Lov3rzCommunity", "EntreprePro", "SkipPrichard", "etnow", "tedcoine", "MarcGuberti", "DressingCute", "TheMindyProject", "KavalonThatsMe", "igornaming", "raehanbobby", "CurableSmoothie", "kylejnorton", "MrLeonardKim", "jakecbaum", "JugglinJosh", "jdbloodstone", "JackPhan", "AndreaFeczko", "thejimjams", "nonprofitorgs", "ItsDLS", "50Plushealths", "THEMMEXCHANGE", "ArtistsandMusic", "XboxSupport", "KingDivine315", "Variety", "TheGoToSite", "WordStream", "eviejohnson88", "Its360Hoe", "musicclout", "BODIESOFLIGHT", "Akira_Steven", "JuliaGrantham2", "KingDavidF", "charitywater", "johntylertweets", "Parentng", "ItsGuyThing", "ZieOKC", "MarioPalush", "ryanfoland", "laraprincesss", "socialstartnow", "YourFavPosts", "GorgeousDiior", "AccessJui", "FlT_MOTIVATION", "LuvKittensDaily", "Scaramucci", "ThomRainer", "TheQuotesBird", "LeahWestMusic", "nmd_sneakers", "itsrealsword", "USAMilitaryUSA", "Interscope", "kimgarst", "ObiWanKevobi", "ChaelMontgomery", "BruceVH", "itsTravelLust", "lovemsgs512", "eBooksHabit", "MyFeelingsTexts", "SunGroupWP", "gym_powers", "BallinCribs", "newyorkgrimaldi", "DIYFoodRecipes", "books2delight", "Korn", "imusicbuzz", "funnytvveet", "idoser", "Natureissoscary", "MAJIX", "THCVibes420", "MARTYPOPSTAR", "OfficialSMR", "WhittyWhitesell", "StartupGrind", "terrywhalin", "mariashriver", "freakytheorys", "FresH_BoY_Will", "ltsChuckBass", "AronoffOFFICIAL", "sneakerbost", "ltvargus", "ToddAdkins", "TOPBRASSVODKA", "MrNegroMilitant", "MakeupOutlets", "StartupReport", "blogboy2", "F1abraham", "TheBookTweeters", "varepall", "rwhitmmx", "MikeSchiemer", "dopehighness", "Elizagraceflip", "ThingslnLife", "MelissaJoanHart", "TeenyTruth", "Bob_Mayer", "noveliciouss", "RWSalt", "wtimage", "IslandRecords", "VERSACEFLIP", "femaIe", "Politics_PR", "prfectsfeeling", "SweetAngel_33", "13isGodsend", "MusicLinkUp", "Music_FM", "SneaksOnFiree", "AmericanCancer", "Marketaire", "DefJamRecords", "AnnTran_", "girlfriendloved", "CHALLENGERmvsic", "KeckMedUSC", "itsohsotay", "ADevotedYogi", "beautylish", "DaniNierenberg", "AdigunLaw", "Lennar", "animalcottage", "TrevCampbell", "pugplanets", "snkrsrich", "DJMikeDiesel", "GoodMenProject", "rodtalks", "JeanetteJoy", "ItsTasteLuxury", "PeakT", "yoteens", "NashFargo", "supreme_yeezy", "igzrap", "DailyLoud", "TheTravelvid", "DJNARESH", "MichaelENichols", "Obi_Obadike", "BoKnowsMarkting", "SpeakingFemaIe", "TourPic", "HRC", "StacyeBranche", "wsredneck", "NicoleBarnwelI", "sundancefest", "TheRealLMaree", "insanebeatzzz", "esfand", "boi1dacom", "HappyLionTweets", "ProducerArtist_", "pandoramusic", "Vinethropy", "darrynzewalk", "iamspectacular", "keatonxxgrant", "KingBach", "HairForHacks", "Alchetron", "LuxuryCIub", "ExclusiveGems", "iIovepets", "MiamiHEAT", "unIimlted", "felingposter", "Earthlmages", "outfitwomen", "BoostYourBooks", "WorldShakifans", "DamienPrinceJr", "AestheticsFeeIs", "MLMDistributors", "_JimGentile", "thepressfarm", "CuteJungle", "hughballou", "Marc_Perrone", "IndieKings", "andrewchristian", "shawanalexia", "GaryLoper", "OceanTraveIs", "JennaWolfe", "Interior", "JerryDanielsen", "1churchboybeatz", "Bestloveporn", "BeingAuthor", "RockChristopher", "Luxuryxpo", "KarlRove", "MyBlackMatters", "SusanCosmos", "blicqer", "itstextures", "goodsolitaire", "johnhall", "IAN_AuthorPromo", "educationalpoem", "HelenSneakers", "KingBoeChrist", "SoDamnTrue", "bfraser747", "LoriMoreno", "sevenwordstorie", "ProDigestive_A4", "dvogel7921", "SandyTweetAngel", "dawnchats", "tbhmclovin", "SocialInChicago", "due", "TheSpaceLights", "itstravelvines", "RKWDC", "SlackHQ", "RealBenBailey", "BookSizzle", "Car01am", "DirtyFootbaIIer", "muz4now", "DarrionMarz", "PardueSuzanne", "HistoryInimagex", "Animalpst", "RTNBA", "trentpart", "MindsConsol", "evankirstel", "Tammysdragonfly", "BobG231", "TweetLikesAGirI", "thesimpleparent", "RichardAngwin", "BabyAnimaIPicss", "MarketingProfs", "ChukMorka", "BreadBoi", "rbstill2", "KayCeeStroh", "CuteBarks", "bape_nmd", "FeeIingsWords", "BookTweepz", "AbjuredHope", "RealerBen", "Clearlease", "ExposedVocals", "capsize", "Ryanintheus", "enews", "MB__Montgomery", "tyler_casper", "ComicBookTalks", "johnelincoln", "Itsfoodstuff", "ZskyYyY", "angleoutfit", "goods_health", "Rankingsio", "TamaraJanelle", "PsyPost", "MSFT_Business", "Postliketumblr", "GloryBoySODMG", "danhardymma", "JBSource", "OneModernCouple", "QueerStoriesQDM", "EricTTung", "TheIotWarehouse", "TheDailyEdge", "FootbaIITwats", "GayWeHo", "mikeallen", "jaycbee", "APoemNotes", "DrRodRohrich", "ConnectCatholic", "venturists", "madisonpettis", "codieprevost", "Gabriel_Blondet", "alternatrend", "funnyrealfact", "BookChat_", "Barbecue_text", "Glrlcrazy", "FFloatables", "kentkristensen1", "M_K_Reynolds", "EDMNews__", "Van_Moody", "itsgirlfelling", "SocialPowerOne1", "amyklobuchar", "cam_s_bennett", "SpacenLights", "NoahFairbanks", "LaughNYC", "Quinnqueens", "zimbabwekid", "xavierkatana", "ItsFreeAtLast", "IamDavidGuitard", "ACountryWord", "christinenolfi", "AvidReadersCafe", "puggboi", "FFDP", "DesignArtistic", "itsgirlstruggle", "Luxepaths", "somedayilllearn", "TrendsStyle_", "nprpolitics", "DrHubaEvaluator", "lyricsuppIy", "MusicIndustryU", "kimcormack", "Adrianamonade", "DogofCourage", "llovespace", "Cinema_Quote", "dailypotatonews", "margaretcho", "BiancaLovely", "Inspire_Us", "Ross_Quintana", "TheRealCSTAX", "BlackCoconutOil", "BernSnow", "stojkovic_alex", "JaywanInc1", "nbakerauthor", "lady20456", "JeaneMooreBooks", "breaking411", "deangloster", "WhoGoofy", "enploder", "AmpOnTheTrack", "AMAZINYNATURE", "Girlposses", "lonelilife", "GbrilliantQ", "LitDabs", "Lostwordd", "Stonewall_77", "Iighted", "rcooley123", "neilpatel", "nokidhungry", "DrDLifestyle", "HoldMyBluntt", "Dressingideas", "pizzahut", "rumblespur", "thehumanxp", "FindMyHost", "Flirtybooklets", "SiySportsNews", "ItsTravelFun", "DerekCressman", "spacenstar", "OutfitsOutfit", "DonnaChaffins", "irritatedwoman", "TheShoeBibles", "ReginaPucket", "Reach1SocMedia", "QuatationBook", "michaeljohns", "PrestonSteve933", "RickKing16", "SneakerBotsNews", "AlitzahStinson", "PsychicHealerC", "StonerGIass", "KushtopherDodd", "YoungPlatinum", "ItstraveIvines", "dej_rosegoId", "BabySavers", "lajollamom", "stockbella", "tweetweednews", "GirlPostNote", "pastelsfeel", "JacquesLoveall", "HeinzMarketing", "Bchplce", "BillyCoxLive", "Ionershawtyy", "music2meditate", "UnkScreenwriter", "jboitnott", "DerekAudette", "its_for_sale", "musicnetworkz", "matthewtoffolo", "Naturalspacess", "LifeWithWeeed", "IJM", "SocialSavvyGeek", "FootyFooIigans", "FIowersFeeIs", "STACKMedia", "prosteampunk", "worldpixstorise", "DreGambiino", "InTheWordsOf_", "AmberEyesMusic", "fodaddict", "mattmarohl", "DahgMahn", "ClarkCountyNV", "cravemyfeeling", "JasNuss", "Steven_Jacques1", "FemiLagosBoy", "MyDaughtersArmy", "gIowlife", "handypixel_com", "kellystilwell", "aheartforgod", "XXL_DMV", "JoeyWhiteComedy", "vrnasty_", "draweasyQ", "janiezgarcia", "SonomaChristian", "POWERATL", "amnichols", "THETOPICisCOOL", "imjamescharles", "EdwardAPrice", "RzkToni", "2venturists", "PBS", "ZaibatsuNews"];

/*
const options = { name: 'Contest-Winners', description: 'Friendship is the true prize'  };

//
//  Creates a new list for the authenticated user. Note that you can create up to 1000 lists per account.
//
T.post('lists/create', options, function(error, data, response) {
  // console.log(data);
  // console.log(data.statuses.length);
  // console.log(response);

  if( data != undefined && !error && response.statusCode == 200 ){
  	 	
	  console.log(data);
	  
  	
  } // end if
  else if( error )
  {
	console.log(error);	
	console.log(data);
	console.log(response.statusCode);
  }
  

}); // end lists/create

*/

/*


{ id: 933448458400178200,
  id_str: '933448458400178176',
  name: 'Contest-Winners',
  uri: '/vannscontests/lists/contest-winners',
  subscriber_count: 0,
  member_count: 0,
  mode: 'public',
  description: 'Friendship is the true prize',
  slug: 'contest-winners',
  full_name: '@vannscontests/contest-winners',
  created_at: 'Wed Nov 22 21:33:49 +0000 2017',
  following: false,
  user: 
   { id: 15188191,
     id_str: '15188191',
     name: 'Contests, Jackpots & more',
     screen_name: 'vannscontests',
*/

const list_id = '933448458400178176';

var a = 0;

const limit = 100;

const pause = 60000;

// postUser();

getFriends();

function postUser(){
	
	console.log(accounts[a]);
	
	var method  = 'post';
	var command = 'friendships/create';
	var options = { screen_name: accounts[a] };
	
	getCache( command, options, function(err, res){		
		if( res == undefined ){
			// Cache Miss!!
			console.log('Cache MISS: postUser');
			twitterApi(method, command, options, function(data){				
				postList();
			});		
		}else{
			// Cache HIT
			console.log('Cache HIT: postUser');
			postList();
		}		
	});

}

function postList(){

	var method  = 'post';
	var command = 'lists/members/create';
	var options = { list_id: list_id, screen_name: accounts[a] };
	

	getCache( command, options, function(err, res){		
		if( res == undefined ){
			// Cache Miss!!
			console.log('Cache MISS: postList');
			twitterApi(method, command, options, function(data){
				getFriends();
			});			
		}else{
			// Cache HIT
			console.log('Cache HIT: postList');
			getFriends();
		}		
	});	
}

function getFriends(){		
	method = 'get';	
	command = 'friends/list';
	options = { "screen_name": accounts[a], "include_entities": false, "count": 200  };	
	
	getCache( command, options, function( err, data ){
		if( data == undefined ){	
			console.log('Cache MISS: getFriends');
			twitterApi( method, command, options, function(data){
				for( i = 0; i < data.users.length; i++){
				    	recordAccount(data.users[i], i, function(error, results, data){
				    		console.log('Recorded friend: '+ data.screen_name );
				    		// console.log(data);
						});
					}
				getFollowers();	
			});
		}else{	
			console.log('Cache MISS: getFriends');
			// cache hit		
			for( i = 0; i < data.users.length; i++){
			    	recordAccount(data.users[i], i, function(error, results, data){
			    		console.log('Recorded friend: '+ data.screen_name );
					});
				}				
			getFollowers();				
		}
	});
	
	}
	
function getFollowers(){

	method = 'get';		
	command = 'followers/list';
	options = { "screen_name": accounts[a], "include_entities": false, "count": 200  };	
	
	getCache( command, options, function( err, data ){	
		if( data == undefined ){	
			console.log('Cache MISS: getFollowers');
			twitterApi( method, command, options, function(data){
				var followers = data.users.length -1;
				for( i = 0; i < data.users.length; i++){
				    	recordAccount(data.users[i], i, function(error, results, data, index){
				    		console.log('Recorded follower: '+ data.screen_name );			    							    	
						});
					}
				a++;
				console.log('Index: '+a);	
				if( a < limit && a < accounts.length ){
					wait(pause);
					getFriends();
				}else{
					console.log('Done!!');
					process.exit();		
				}						
			});	
		}else{	
			// cache hit
			console.log('Cache HIT: getFollowers');	
			var followers = data.users.length -1;	
			for( i = 0; i < data.users.length; i++){
			    	recordAccount(data.users[i], i, function(error, results, data, index){
			    		console.log('Recorded follower: '+ data.screen_name );			    		
					});
				}
			a++;
			console.log(a);	
			if( a < limit && a < accounts.length ){
				getFriends();
			}else{
				console.log('Done!!');
				process.exit();		
			}
			
		}
	
	});	
	
	}

function twitterApi(method, command, options, callback){

	if( 'post' == method ){
		T.post(command, options,  function (error, data, response) {
						      					            
		    if(error != undefined || response.statusCode != 200 ){
				console.log("Something went wrong!");
				console.log(error);
				console.log(response.statusCode);			
		   
		    }else{
				writeCache(command, options, data, callback);
			}
			
		}); // end users/show
	}else{
		T.get(command, options,  function (error, data, response) {
						      					            
		    if(error != undefined || response.statusCode != 200 ){
				console.log("Something went wrong!");
				console.log(error);
				console.log(response.statusCode);			
		   
		    }else{
				writeCache(command, options, data, callback);
			}
			
		}); // end users/show
	}	
}

function getCache( command, options, callback){
	
	// query database for data based on key with date within lifetime
	const text = "SELECT command, options, data FROM twitapicache WHERE command = $1 AND options = $2 AND date_updated > now() - interval '"+cacheLifetime+"' ;";
	const values = [command, options];
	
	// callback
	client.query(text, values, (err, res) => {
	  if (err) {
	    callback(err, undefined );  
	  } else if( res.rows == undefined || res.rows.length == 0 ){
		callback(err, undefined );  
	  } else {
	  	callback(err, res.rows[0].data);
	  }
	});
	
}



function writeCache( command, options, data, callback ){
	
	const text = "WITH upsert AS (UPDATE twitapicache SET data = $3, date_updated = now() WHERE command = $1 AND options = $2 RETURNING *) INSERT INTO twitapicache ( command, options, data, date_created, date_updated ) SELECT $1, $2, $3, now(), now() WHERE NOT EXISTS (SELECT * FROM upsert);";
	const values = [ command, options, data ];
				
	// callback
	client.query(text, values, (err, res) => {
	  if (err) {
	    console.log(err.stack)
	  } else {
	  	// console.log(values);	    
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
	   	 console.log('Waiting: '+ ( --seconds )+' seconds');
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
