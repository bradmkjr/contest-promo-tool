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

var accounts = ["LILBTHEBASEDGOD", "djkingassassin", "Warx2TheMovie", "Bottom2thatop", "bynsny", "MonsterFunder", "rowdytukgoon", "jstorres", "GNews_Center", "EarthPixDaiIy", "BenWilliam1989", "DanHogman", "christyanthony", "asmithblog", "GoalsOnTrack", "Moosetheprince", "adi_yeezy", "ZOMBIEWASHOTGUN", "ashleygene89", "TIMENOUT", "JohnFromCranber", "seaweed115B", "stanfossum", "WanderWorx", "mtjsblog", "APBsayin", "ShaneDWalters", "MHawkProduction", "BackThePolice", "SLPierce57", "ChrisRCason", "EdaraBabyG", "DigitalDripped", "LifeExtension", "aallen010", "MonsterFunders", "MichaelVonIrvin", "fastretweet_sa", "AvilaVIP", "Explorevscos", "pianomag", "DrBrianKiczek", "sayingperfact", "Scaler17", "mtcrookshank", "NancyRichmond", "FundingExperts", "Mountsplus", "EdPerezLive", "SurvivalPulse", "yeezy_jordan", "Best_Food_Porn", "itslovefeeling", "W_Angels_Wings", "prfectfeeIings", "ToLearnHistory", "IndustriSurplus", "Ravious101", "SpaceEnquiry", "SimonCocking", "ZondaRealEstate", "audiboyg5", "bestspuppy", "DietShop", "CHAMPl0NSLEAGUE", "MrTerrellHarris", "Mindustry_PR", "PyramidsOnMars_", "HungryTruckerAB", "DennisCardiff", "LauVanni", "Manhattanpeachy", "JOKERS_WILD_JJ", "LeadersBest", "BusuyiGuitar", "TeamTrumpAZ", "AMike4761", "LynnConnor45", "AmyJRomine", "cyberceas", "RoxanneBarbour", "Pat_Lorna", "ImBRightTho", "LimitedCards", "Necole_Monroe", "pmatas", "RoseBartu", "livepositive11", "rapgamejordan", "itsFoodporns", "TravelFor_food", "FreddieSirmans", "ThaRealMikeFeez", "Airohub", "iOgrapher", "luckiegirll", "LaydenRobinson", "MySocialPoint", "WritingSpecial", "ScrollsawArt", "creditcard_ccp", "GallagherAuthor", "SarahJunner", "_google__facts", "R47R", "eric_kavanagh", "beautiesofarts", "LarryOzAuthor", "sjredmond", "foodsfact", "Neilsonagain", "scottsantens", "hiptronicmag", "MarionFiedlerTN", "bdmowell", "HOUSEHOLDSTRESS", "Kaitwrites", "RhondaSasser", "RealMuckmaker", "_LILYOTE", "LavanaYoken", "hiphopoverload1", "VinylFresh", "YourNikt", "EricDavisW", "DinamicoPromo", "PublicistAgent2", "JimmyLevyMusic", "sixsoundmagazin", "JakeHargisBooks", "amazonfashion_", "itzTopShelFF", "thetypicalchick", "footballrs", "JackRatchet", "CupAttic", "puntanious", "itsworldbeauty", "lavishstuff", "shane_bruwer", "jackbgoode1", "6hoursleep", "RadioSucksMag", "baefeeling_", "CollageBabe", "Numerology2016", "Relatablefoods", "philshapiro", "bitxhless", "Itstheclothporn", "lizords", "LowkeyLaw", "StudentRushNYC", "Lov3rzLov3U", "jontsai", "greatman0008", "Funny_n_Serious", "tuneofthedayca", "riteshmm60", "CouponistaQueen", "PrellWHO", "OJoeUSA", "ImraanGill", "TOLuxurySuites", "unique_twets", "muleties", "muckrack", "PeaceZicklin", "ZakiyaLarry", "UCStrategies", "CarsADICTS", "NorthLLC", "Trivelle905", "sunsetcolour", "TomFlowers", "learningquotes_", "AtlBizRetweet", "Sarobi", "shawtyypretty_", "DiffuserFM", "AestheticClips_", "CStoreNews_", "BeerRightNowIND", "C0MEDYVINES", "OfficialOEM", "charlescmarquez", "Har_vey007", "CharlesTersolo", "tweetlrk", "OfficialJrichol", "CoolChange80", "48Laws757", "agreencleveland", "SteveO_Writer", "alonshalevsf", "itsOddFuture", "incomeincubator", "i__Shield", "BucklesandBulls", "YouBrandInc", "MikeCookAuthor", "vgonzalesauthor", "JDRichards0322", "verna_water", "itsw0wfacts", "_friend4ever", "Sunni_Tzu", "pulsedaniel", "thegoagency", "OuvrezLeChien", "rejialex7", "Brar_Parkash", "jvdwl", "skip_conover", "ItsDressing", "AwwOutfit", "TheMysteryLadie", "TheSwanns", "facpronline", "c_vongunten", "ahoychrispineda", "OverseerLewis", "MrNaassir", "MimiMemeMeLOL", "laviecockatoo", "lindeeloo1956", "FanYourFlame", "FrugalBookPromo", "Theflowerworld3", "vikkigotcurls", "KyiranFamous", "badgirl_loony", "LuveLifePost", "PainfulPunz", "2A_MAG", "Paksalah", "OfficialTwoDope", "MarvinStone", "VCRebecca", "absolutelypsych", "DJSAppcenter", "WorldMktng", "FriedrickRyan", "NBAInside_Stuff", "EnchantmentLL", "LennyToSaucy_", "SVNPOFoundation", "GayRepublicSwag", "BrendanWitcher", "FairTaxOfficial", "Chop_Media", "Marty_Aftewicz", "CityCadillac", "FeelingHacks", "TheOnlyLowest", "clarkgotbangers", "FAshionn_0", "YARAHAMEDD", "StarCavalli", "fatmamuhamed62", "rosalieinc", "Alex_Carrick", "navarrofrank11", "FeelingLoneIy", "SatyayInfotech", "TerriLyndie", "twodriftersxo", "SmokHaus6", "SteveMotley", "S__a__212", "5thdimdreamz", "TuuTjea", "PopHaydn", "MichaelKNeeley", "CathyTurneyLafs", "ThriftNFlip", "LesliePivin", "Indo_Art_House", "ERamich411", "MBAbstract", "Emalfarb", "thebethogden", "JosephDjdpj", "ChrisWeissCT", "DavidClinchNews", "powerhoster", "Uniquesxy", "Banglaviews", "CAT1PRO", "IAMYOUNGCHITOWN", "pre_desire", "MySkyroam", "dalegriffen", "Annimallover", "Dysrupted", "m7i45", "MrsAndiLutz", "TVRadioDoc", "Jordan__French", "HeidiHmoretti", "Neckillusions", "G6throughF5", "TheFoodPorning", "hiphopgrindtv", "TheRebelPatient", "ARedPillReport", "fooddealsno1", "SharpestSports", "Temoge", "marketingdoctor", "Omganimaldog", "GoSocialAcademy", "BestDealAirline", "MoneyMarkDiggla", "prepperbooks", "tinieblasswat", "glamourgoal", "BernedSt", "ToddGetts", "lord_thc", "NdegeDun", "StewySongs", "realcomedyyy", "ScarlettScotlan", "NorthVibess", "hiimkylehickey", "kreaturebt", "StrengthStack52", "GordWeisflock", "monkeys_robots", "fastmetrics1", "GloriaDarni", "yaromancebooks", "johnrutledge", "labrador_do", "alizexo_", "itstravelscen", "OrganicHealth10", "kylewalz", "CarleeElia", "Anandks123", "dude_fm", "Tiffany_Norris7", "daSportsCommish", "lovelypet12", "thedopestsounds", "JudyNetworks", "NASCARRacingCo", "fuckumalibu", "KardashTruths", "GTHTonWinfield", "Gina_GoodridgeH", "awlasky", "FastLeaderShow", "seedoflife", "HhgtvFitness", "meomine09", "scifibooks33", "dubvLIVE", "GrassRootRevolt", "Only_advanture", "CathyScott", "IamJoharAbbas", "peanutandjojos", "KidsDealsNo1", "LaceyRamot", "NASCHartInc", "SlideBotIO", "itsamericancat", "Golfman072", "watchnews_nawcc", "JustinaHadnott", "RabbitRayy", "monitoringhub", "BabyAnimalPost_", "Durbin47", "abales", "CeciliaGunadia", "KayleeHauesler", "NathanTarantla", "ricordk", "emariei", "PolicyAdvantage", "relevance", "FashionPRGirl_", "jodijeannine", "themixtapemastr", "ShaynaYasui", "Disciple4Lif", "Worldnews_____", "PetOverloads", "Roarkimagine", "u2biker", "AmyCoupal", "WoWheedaLTD", "MarielaCooperri", "OvrdoseVibes", "adampaulgreen", "GrandVillaofPPK", "MLMBigProfits", "Lavy02", "BlackXpoAmerica", "mypassiontest", "AnchorTrec", "aaaliyanusman", "solikobidafiz", "theskkul", "GrandVillaLargo", "DRoseAuthor", "Set_entertainme", "CecilyKorth", "WILLIAMSRETWEET", "kkruse", "ShaeDerringer", "OTheMind", "JamieLetournea", "kourtnxyKardash", "all_freeapps", "horrorbooks33", "WritingCoachSWS", "flipgazemedia", "RCNconnects", "EnriqueFiallo", "SportsLineHotel", "ScottRickhoff", "MusicSuccessADG", "StashStickPen", "BoneDragonComic", "GlizzyGangg_", "fabbaloo", "SusanHerdian", "GrandVillaASP", "KingTurboRicky", "itspaintmyfeea", "Time_Lord2017", "Silverimagelimo", "GrandVillaOB", "literarybooks33", "30SecondSpanlsh", "a1_s25m", "bstowapp", "purplecreamband", "richardwelsh", "GrandVillaofM", "Huntmcm", "getsteward", "NewAppleAwards", "Banatmasr2016", "CoopsCoaching", "bealpat", "CharityStars", "InsuranceLendin", "starhymerdotsXe", "Crossbearer1956", "BAPERosewood", "KareyMeraza", "AoxoA_Creative", "winstonmeiii", "_SweetLovers", "JcliffyHuff", "lovemsgHQ", "4aPeoplesParty", "Dodo_Tribe", "AmberlySilverio", "TerminalAngler", "Revelation1217", "shark_in_ocean", "GrandVillaSTP", "pinki943", "JasSynergy", "Thejadelord", "ItsScaryNature", "AnneJanzer", "ReadCaseyCarter", "VlogsVoyage", "zwriter", "banntty", "RasimSafe6", "MartinAnstee", "careytha1", "AndyAUCD", "jbuchana", "Parkashji1", "ChuckDeVore", "Cam_Who", "AuthorDaco", "Libertyworld", "diamondrcreate", "DylanCornelius", "MINEBITCOIN_", "ChelleMartin47", "NormanTurrell", "YDthebeatmaker1", "mikeberrien", "davidabaileyjr", "StaubLeadership", "MediBasket", "crowdfundingpr_", "LifeFlipMedia", "ChadJRogers"];

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

const limit = 500;

const pause = 60000;

postUser();

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
					postUser();
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
				postUser();
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
