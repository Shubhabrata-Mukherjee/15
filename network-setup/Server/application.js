//requires fabric-client module for interacting with peers and ordering service node
var Client = require('fabric-client');

//requires tor read file such as channel.tx for signing
var fs = require('fs');
var path = require('path');
//var hfc = require('../../..');
var util = require('util');


var log4js = require('log4js');

var logger = log4js.getLogger('SampleWebApp');

var express = require('express');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var http = require('http');
var async = require('async');


var app = express();

var expressJWT = require('express-jwt');

var jwt = require('jsonwebtoken');

var bearerToken = require('express-bearer-token');

var cors = require('cors');

var curl = require('curlrequest')

var mongoose = require('mongoose');
var multer = require('multer');

var storage = multer.diskStorage({

	destination: function(req, file, callback) {
  
	  callback(null, './tempFolder')
	},
  
	filename: function(req, file, callback) {
	  console.log("File details,",file)
	  callback(null,file.originalname)
	}
  
  });
  
  var upload = multer({storage: storage})
var apps = require('./app.js')


//globally define channelid and MSP id of each org
var org1mspid = "Org1MSP";
var org2mspid = "Org2MSP";
var org3mspid = "OrdererOrgMSP";
var genesis_block = null;
var config = null;
var signatures = [];
var chaincode_name = "os168";
//peers endpoints of org1 and org2
//event url is used for registering for events on the peer, 
//during the committing phase peer will generate an event informing whether the transaction successfully passed the endorsement policy or not


/*
../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID chan
docker rm -f $(docker ps -aq)
docker network prune
docker-compose -f docker-compose-e2e-template.yaml up -d
*/
//Mongodb Schemas and Models
var userSchema = mongoose.Schema({
	userName: String,
	password: String
});
var userModel = mongoose.model('User', userSchema);


var docSchema = mongoose.Schema({
	pan_number: String,
	path: String,
	hash: String
});

var docModel = mongoose.model('PanDoc', docSchema);

var panSchema = mongoose.Schema({
	pan_number: {
        type:String,
        required: true,
        unique: true
    },
	name: String,
	gender: {
        type:String,
        required: true,
    },
	dob: {
        type:String,
        required: true,
    }
});
var panModel = mongoose.model('Pan', panSchema);

//User creations
var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:' + store_path);

var org1peersurl = [{ url: "grpc://192.168.99.100:7051", eventurl: "grpc://192.168.99.100:7053" }, { url: "grpc://192.168.99.100:8051", eventurl: "grpc://192.168.99.100:8053" }];
var org2peersurl = [{ url: "grpc://192.168.99.100:9051", eventurl: "grpc://192.168.99.100:9053" }, { url: "grpc://192.168.99.100:10051", eventurl: "grpc://192.168.99.100:10053" }];
var org3peersurl = [{ url: "grpc://192.168.99.100:11051", eventurl: "grpc://192.168.99.100:11053" }, { url: "grpc://192.168.99.100:12051", eventurl: "grpc://192.168.99.100:12053" }];


//creates the client object 
var client = new Client();

//get the tls certificate of the orderer organization for tls communication
var caRootsPath = "../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
let data = fs.readFileSync(caRootsPath);
let caroots = Buffer.from(data).toString();

//creates the orderer object and initialize it with the endpoint and the tls certificate of ordering service node
var orderer = client.newOrderer(
	"grpc://192.168.99.100:7050",
	{
		'pem': caroots,
		'ssl-target-name-override': 'orderer.example.com'
	}
);





//peer chaincode query -o orderer.example.com:7050  --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C chan -n paapa12 -c '{"Args":["query"]}'


//peer chaincode query -o orderer.example.com:7050  --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C chan -n paapa14 -c '{"Args":["credit","admin","300000"]}'



//***********Admin Functions*********
//below lists some functions that can be called only by organizations admin

//creates a channel between organization mentioned in the channel.tx file, 
//admin of any org participating in the channel can send the request to the orderer
//on receiving the request orderer will prepare the genesis block for this channel


// 
// joinChannel(org2mspid,'org2',org2peersurl,'second')
// joinChannel(org3mspid,'orderer',org3peersurl,'second')
//installchaincode(org1peersurl,'org1',org1mspid,"chaincode",chaincode_name,"v0");
//installchaincode(org2peersurl,'org2',org2mspid,"chaincode",chaincode_name,"v0");
//installchaincode(org3peersurl,'orderer',org3mspid,"chaincode",chaincode_name,"v0");
//instantiateChaincode('first',org1peersurl,'org1',org1mspid,org3peersurl,'orderer',org3mspid,"chaincode",chaincode_name,"v0");
//instantiateChaincode('second',org2peersurl,'org2',org2mspid,org3peersurl,'orderer',org3mspid,"chaincode",chaincode_name,"v0");
//querychaincode('first',org1mspid,'org1',org1peersurl,org3peersurl,'orderer','QUERY_15G',["123-456-789"],chaincode_name)
//querychaincode('first',org1mspid,'org1',org1peersurl,org3peersurl,'orderer',QUERY_BY_YEAR_15G',["123-456-789","2018"],chaincode_name)
//invokechaincode('first',org1mspid,'org1',org1peersurl,org3peersurl,'orderer','UPDATE_15G',["123-456-789","40000","2018"],chaincode_name)
//invokechaincode('second',org2mspid,'org2',org2peersurl,org3peersurl,'orderer','UPDATE_15G',["123-456-789","30000","2018"],chaincode_name)

//invokechaincode('first',org1mspid,'org1',org1peersurl,org3peersurl,'orderer','UPDATE_15G',["123-456-789","40000","2018"],chaincode_name)
function setup_db() {
	create_panstore().then(
		(str)=> {console.log(str);return sleep(5000);})
		.then(()=> {return create_userstore().then()},
		(err)=> {console.log("Error: "+err)}).
		 then(()=> {console.log("Finished setting up userstore and panstore!! ");return sleep(5000)},
		 (err)=> {console.log("Error: "+err);})
}

function setup_db_blockchain() {
	create_panstore().then(
		(str)=> {console.log(str);return sleep(5000);})
		.then(()=> {return create_userstore()},
		(err)=> {console.log("Error: "+err)}).
		 then(()=> {console.log("Finished setting up userstore and panstore!! ");return sleep(5000)},
		 (err)=> {console.log("Error: "+err);})
		 .then(()=> {
			mongoose.connect('mongodb://192.168.99.100:27027/panstore').then(
				() => {
					console.log("Success Connecting to panstore")
					var query = panModel.find({}, function (err, user) {
						if (err) return handleError(err);
					})
						
					query.exec(function (err, result) {

						if (err) return handleError(err);
						//console.log('%s', res);
						
						//res.toString().replace("_","")
						var operations = [];
						console.log(result)
						for(let i = 0; i < result.length; i++) {
							console.log("Entered")
							 operations.push(function (callback) {invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["PENDING",result[i].pan_number.toString(), "0", "0","0","0","0", result[i].gender.toString(), result[i].dob.toString()], chaincode_name)
									.then((str) => {
										console.log("String is:" + str);
										return sleep(5000)
										,(err)=> {
											console.log(err)
										}
									}).then(()=>{console.log("Moved "+(i+1)+" data in 1 channel");
										callback(),(err)=>{
											console.log(err)
										}
									});})
							operations.push(function (callback) {invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["PENDING",result[i].pan_number.toString(), "0", "0","0","0","0", result[i].gender.toString(), result[i].dob.toString()], chaincode_name)
							.then((str) => {
								console.log("String is:" + str);
								return sleep(5000)
								,(err)=> {
									console.log(err)
								}
							}).then(()=>{console.log("Moved "+(i+1)+" data in 2 channel");
								callback(),(err)=>{
									console.log(err)
								}
							});})		
								
						}
						async.series(operations, function (err, results) {
							// results[1]
							// results[2]
							//console.log("Results",results)
						});
					
						
						
						console.log("panstore DB Queried")

					});
					//mongoose.connection.close();//mongoose.disconnect(); also work and prefered

					
				},

				err => { console.log("Error Connecting to userstore") }

			)
		 },
		(err)=> {
			console.log("Error is: ",err)
		})
	
}
function create_userstore() {
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://192.168.99.100:27017/userstore').then(

			() => {
				console.log("Success Connecting to userstore")
				var user1 = new userModel({ userName: 'org1', password: 'org1' })
				var user2 = new userModel({ userName: 'org2', password: 'org2' })
				var user3 = new userModel({ userName: 'org3', password: 'org3' })
				user1.save(function (err, user1) {
					if (err) return console.error(err);
				});
				user2.save(function (err, user2) {
					if (err) return console.error(err);
				});
				user3.save(function (err, user3) {
					if (err) return console.error(err);
				});
				resolve("Initial userDB created")
				return 

			},
			(err) => {
				reject("Error Connecting to userstore" + err)
			}
		)
	})

}

function create_docstore() {
	var a=[]

	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://192.168.99.100:27027/panstore').then(
					() => {
						console.log("Success Connecting to panstore")
						var query = panModel.find({}, function (err, user) {
							if (err) return handleError(err);
						})
							
						query.exec(function (err, result) {
							if (err) return handleError(err);
							console.log(result)
							for (var i = 0; i < result.length; i++) {
								console.log("i",i)
								a.push(result[i].pan_number);
							}
							console.log("A",a)
						});
						return sleep(5000)
					},
				(err) => {
					reject("Error Connecting to docstore" + err)
				}
			).then(()=> {
				return mongoose.connect('mongodb://192.168.99.100:27017/docstore').then(		 
				
							// mongoose.connection.close();
							()=> {
								console.log("Entered in aaa",a)
								for(let i = 0; i < a.length; i++) {
									var fs = require('fs');
									console.log("pan",a[i])
									fs.readFile('./PDFStore/'+a[i]+".pdf", 'base64', function(err, str) { 
									// console.log("Str",str)
									console.log("Error",err)
									const crypto = require('crypto');
									const hash = crypto.createHash('sha512');
									hash.update(str);
									let finalHashValue=hash.digest("hex");

									var document = new docModel({ pan_number: a[i],path:'./PDFStore/'+a[i]+".pdf", hash: finalHashValue })
									document.save(function (err, document) {
										if (err) return console.error(err);
									});
									console.log("Pan_number",a[i],"Hash",finalHashValue)
									resolve("Initial docStore created")
									//var temp1=req.body.pan;
									//var User = mongoose.model("User", nameSchema);
								});
									
					
								}
								console.log("End")

							})
			}).then(()=>{
				console.log("Setup Complete")
			}
		)
				
	})
}


function create_panstore() {
	return new Promise((resolve, reject) => {

		mongoose.connect('mongodb://192.168.99.100:27027/panstore').then(
			() => {
				var pan_user = []
				pan_user.push(new panModel({ pan_number: "BGCPM0352C", name: "SHUBH", gender: "M", dob: "01/02/1900" }))
				pan_user.push(new panModel({ pan_number: "BGCPM0352D", name: "AAMIR", gender: "F", dob: "01/02/2000" }))
				pan_user.push(new panModel({ pan_number: "BGCPM0355P", name: "ABHAY", gender: "M", dob: "01/02/1960" }))				
				//console.log("pan user is:",pan_user)
				// for (let i = 0; i < pan_user.length; i++) {
				// pan_user[i].save(function (err, pan_user[i]) {
				// if (err) return console.error(err);
				// });
				// }
				pan_user.forEach(function (item) {
					item.save(function (err) {
					});
				});
				resolve("Initial panDB created")
			
			},
			(err) => {
				console.log(err)
				reject("Error connecting to panstore" + err)
			}
		)
	})
}
function validate_credentials(u, p) {
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://192.168.99.100:27017/userstore').then(
			() => {
				console.log("Success Connecting to userstore")
				console.log("Entered Username: " + u + " Entered Password: " + p)
				var query = userModel.find({}, function (err, user) {
					if (err) return handleError(err);
				}).where('userName').equals(u)
					.where('password').equals(p)
					.sort('userName')
					.count();
				query.exec(function (err, res) {
					if (err) return handleError(err);
					//console.log('%s', res);
					if (res == 0) {
						resolve("Insuccessful Login");

					} else {
						resolve("Successful Login");
					}
				});
				console.log("userstore DB Queried")
			},

			err => { console.log("Error Connecting to userstore") }

		)
	})
}
function network_setup15GH() {
	return new Promise((resolve, reject) => {
		console.log("*****************************---------------------------- Starting network setup *****************************----------------------------")

		createChannel('first', org1mspid, 'org1').then(() => {
			console.log("First channel created!!");
			return sleep(5000);

		}, (err) => {
			console.log("Error creating first channel!!")

		}).then(() => {
			return joinChannel(org1mspid, 'org1', org1peersurl, 'first').then(() => {
				return sleep(5000);
			}, (err) => {
				console.log("Error joining Org1 to first channel!!" + err)
			})
		}).then(() => {
			return joinChannel(org3mspid, 'orderer', org3peersurl, 'first').then(() => {
				return sleep(5000);
			}, (err) => {
				console.log("Error joining orderer to first channel" + err)
			});
		}, (err) => {
			console.log("Error joining Org1 to first channel!!" + err)

		})
			.then(() => {
				return createChannel('second', org2mspid, 'org2').then(() => {
					return sleep(5000);
				}, (err) => {
					console.log("Error creating second channel!!" + err)
				})
			}).then(() => {
				return joinChannel(org2mspid, 'org2', org2peersurl, 'second').then(() => {
					return sleep(5000);
				}, (err) => {
					console.log("Error joining Org2 to second channel!!" + err)
				})
			}).then(() => {
				return joinChannel(org3mspid, 'orderer', org3peersurl, 'second').then(() => {
					console.log("*****************************---------------------------- Done *****************************----------------------------\n\n\n\n")
					return sleep(5000);
				}, (err) => {
					console.log("Error joining Orderer to second channel!!" + err)
				})
			})
	})
}
function setup_chaincode() {
	return new Promise((resolve, reject) => {
		console.log("*****************************---------------------------- Starting Chaincode setup *****************************----------------------------")

		installchaincode(org1peersurl, 'org1', org1mspid, "chaincode", chaincode_name, "v0").then(() => {
			console.log("Chaincode installed on org1!!");
			return sleep(5000);

		}, (err) => {
			console.log("Error installing chaincode on org1!!")

		}).then(() => {
			console.log("Installing Chaincode on org2!!");
			return installchaincode(org2peersurl, 'org2', org2mspid, "chaincode", chaincode_name, "v0").then(() => {
				console.log("Chaincode installed on org2!!");
				return sleep(5000);
			}, (err) => {
				console.log("Error installing chaincode on org2!!" + err)
			})
		}).then(() => {
			console.log("Installing Chaincode on orderer!!");
			return installchaincode(org3peersurl, 'orderer', org3mspid, "chaincode", chaincode_name, "v0").then(() => {
				console.log("Chaincode installed on orderer!!");
				return sleep(5000);
			}, (err) => {
				console.log("Error installing chaincode on orderer" + err)
			});
		}, (err) => {
			console.log("Error installing chaincode on orderer!!" + err)

		})
			.then(() => {
				return instantiateChaincode('first', org1peersurl, 'org1', org1mspid, org3peersurl, 'orderer', org3mspid, "chaincode", chaincode_name, "v0").then(() => {
					console.log("Chaincode instantiated on org1!!");
					return sleep(5000);
				}, (err) => {
					console.log("Error instantiating chaincode on org1!!" + err)
				})
			}).then(() => {
				return instantiateChaincode('second', org2peersurl, 'org2', org2mspid, org3peersurl, 'orderer', org3mspid, "chaincode", chaincode_name, "v0").then(() => {
					console.log("Chaincode instantiated on org2!!");
					return sleep(5000);
				}, (err) => {
					console.log("Error instantiating chaincode on org2!!" + err)
				})
			})

	})
}
// network_setup().then(()=>{return sleep(5000)}).then(()=>{return setup_chaincode().then(()=>{console.log("Successful setup")})})
// setup_chaincode().then(()=>{console.log("cc done")})
//  create_panstore().then((str)=> {console.log(str);return sleep(5000);}).then(()=> {return create_userstore().then()},(err)=> {console.log("Error: "+err)}).
//  then(()=> {console.log("Finished setting up userstore and panstore!! ")},(err)=> {console.log("Error: "+err);})
// create_docstore().then(
// 	()=> {
// 		console.log("Created Docstore successfully");
// 	}
// )
// setup_db_blockchain()

//sends a request to peers to join the specified channel
//each orgs admin has to initiate this request on their respective peers
//joinChannel(org1mspid,'org1',org1peersurl)
//joinChannel(org2mspid,'org2',org2peersurl)
//enroll_admin(fabric_client,fabric_ca_client,admin_user,member_user,store_path,'ca-org1')
//register_user(fabric_client,fabric_ca_client,admin_user,member_user,store_path,'ca-org1')
//revoke_user(fabric_client,fabric_ca_client,admin_user,member_user,store_path,'ca-org1')
//install the chaincode on the specified peer node
//The SDK will read the GOPATH environment from the host machine
//The full path from where the SDK will read the chaincode will be $GOPATH + src + specified path(e.g chaincode)
//install will just install the source code and dependencies on the peers
//Not necessary that install has to be called after create and join channel request, admin can install chaincode independent of any operation.
//installchaincode(org1peersurl,'org1',org1mspid,"chaincode",chaincode_name,"v0");
//installchaincode(org2peersurl,'org2',org2mspid,"chaincode",chaincode_name,"v0");

//invokechaincode('first',org1mspid,'org1',org1peersurl,org2peersurl,chaincode_name,"admin","400000")

//After the chaincode is been installed on the peer, Admin can instantiate the chaincode 
//On receiving this request peer builds and starts a container for chaincode, on success users can invoke or query the chaincode
//Admin of one org can now also send the request to the peers of other org in the channel
//Reason: peer has the genesis block for the channel which contains enough information to validate admin that are authorize to perform operations for the channel
//instantiateChaincode(channel_name,org1peersurl,org2peersurl,'org1',org1mspid,"chaincode",chaincode_name,"v0");

//***********End User Functions(Commonly Used)*********

//invokes a function specified in the instantiated chaincodes
//invokechaincode(channel_name,org1mspid,'org1',org1peersurl,org2peersurl,chaincode_name,"admin","400000")



//makes a query call to a function specified in the instantiated chaincode
//querychaincode(channel_name,org1mspid,'org1',org1peersurl,org2peersurl,chaincode_name)


//some extra function to get the channel information

//gets the channel information
//getChannelInfo();

//gets the genesis block for the channel
//getGenesisBlock(org1,'org1')

//Request the orderer for the current (latest) configuration block for the channel. 
//Similar to getGenesisBlock(), except that instead of getting block number 0 it gets the latest block that contains the channel configuration.
//getChannelConfig()

//list all the channel that the peer is part of
//getallChannels(org1peersurl,org1mspid,'org1')

//lists all the instantiated chaincodes on the peer(s)
//getInstantiatedChaincodes(org1peersurl,org1mspid,'org1')



//Start Services
start_service()
// setup_db()
// create_docstore()
function start_service() {
	// ========== index.js ==========
	app.options('*', cors());
	app.use(cors());

	//support parsing of application/json type post data
	app.use(bodyParser.json());

	//support parsing of application/x-www-form-urlencoded post data
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

		next();
	});

	const router = express.Router();

	app.listen(8000, function () {
		console.log('listening ...');
	});

	// ========== routes.js ==========
	router.get('/', function (req, res) {
		res.send('Welcome!!!');
	});

	router.post('/login', (req, res) => {
		// Mock user
		const user = {
			userName: req.body.userName,
			password: req.body.password
		}
		validate_credentials(user.userName, user.password).then(
			(str) => {
				if (str == "Successful Login") {
					jwt.sign({ user }, 'secretkey', (err, token) => {
						res.json({
							"Message": str,
							"Token": token
						});
					});
				} else if (str == "Insuccessful Login") {
					res.json({
						"Message": str,
					});
				} else {
					res.json(
						{
							"Message": "Unknown Error"
						}
					)
				}
			},
			(err) => {
				console.log("Some error occured : " + err)
			}
		)
	});

	// FORMAT OF TOKEN
	// Authorization: Bearer <access_token>

	// Verify Token
	function verifyToken(req, res, next) {
		console.log("asassas");
		console.log(req.headers['authorization'])
		const bearerHeader = req.headers['authorization'];
		console.log("asasas")
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			console.log("first: " + bearer[0] + " second: " + bearer[1])
			req.token = bearerToken;
			next();
		} else {
			// Forbidden
			res.sendStatus(403);
		}

	}

	router.get('/query/org1/all', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			console.log("Error" + err + ". Token: " + req.token)
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_ALL_15G', [""], chaincode_name).then((str) => {
					console.log("String is:" + str);
					res.send({
						Org: orgData,
						Query: str
					});
				});
			}
		});
		// res.send('im the about page!');
	});

	router.get('/query/org2/all', verifyToken, function (req, res) {
		// res.send('im the about page!'); 
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_ALL_15G', [""], chaincode_name).then((str) => {
					console.log("String is:" + str);
					res.send({
						Org: orgData,
						Query: str
					});
				});
			}
		});
	});

	router.get('/query/org1/:id', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_15G', [req.params.id], chaincode_name).then((str) => {
					console.log("String is:" + str);
					res.send({
						Org: orgData,
						Query: str
					});
				});
			}
		});
		// res.send('im the about page!');
	});

	router.get('/query/org2/:id', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_15G', [req.params.id], chaincode_name).then((str) => {
					console.log("String is:" + str);
					res.send({
						Org: orgData,
						Query: str
					});
				});
			}
		});
		// res.send('im the about page!');
	});

	router.get('/query/org3/:id', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				var result
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_15G', [req.params.id], chaincode_name).then((str) => {
					result = str
					return querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_15G', [req.params.id], chaincode_name)
				}).then((str) => {
					var obj1 = JSON.parse(result)
					var obj2 = JSON.parse(str)

					res.send({
						Org: orgData,
						Id: req.params.id,
						Org1: obj1,
						Org2: obj2
					});

				})
			}
		});
		// res.send('im the about page!');
	});
	router.get('/query/rules', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_RULES_15G', [], chaincode_name).then((str) => {
					ans = str
					console.log("ans is :" + ans)
					res.send(
						{ "Rules": ans }
					)
				})
			}
		});
		// res.send('im the about page!');
	});

	router.get('/cumulative/:id/:year', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				var result
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id, req.params.year], chaincode_name).then((str) => {
					result = str
					return querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id, req.params.year], chaincode_name)
				}).then((str) => {
					var obj1 = JSON.parse(str)
					var obj2 = JSON.parse(result)

					obj1 = JSON.parse(str)
					obj2 = JSON.parse(result)

					console.log("obj1: " + str + " obj2: " + result)
					var net_amount1
					var net_amount2
					var interest_amount1
					var interest_amount2
					var other_amount1
					var other_amount2
					var deduction_amount1
					var deduction_amount2
					if (str.indexOf("No value found") != -1) {
						net_amount1 = 0
						interest_amount1 = 0
						other_amount1 = 0
						deduction_amount1 = 0
						console.log("1")
					} else {
						net_amount1 = obj1.TOTAL_AMOUNT
						interest_amount1 = obj1.INTEREST_AMOUNT
						other_amount1 = obj1.OTHER_AMOUNT
						deduction_amount1 = obj1.DEDUCTION_AMOUNT

					}
					if (result.indexOf("No value found") != -1) {
						net_amount2 = 0
						interest_amount2 = 0
						other_amount2 = 0
						deduction_amount2 = 0
						console.log("2")
					} else {
						net_amount2 = obj2.TOTAL_AMOUNT
						interest_amount2 = obj2.INTEREST_AMOUNT
						other_amount2 = obj2.OTHER_AMOUNT
						deduction_amount2 = obj2.DEDUCTION_AMOUNT
					}
					console.log("str: " + str.indexOf("No value found") + "result: " + result.indexOf("No value found"))

					console.log("Total_Amount1: " + net_amount1 + "Total_Amount2: " + net_amount2)
					console.log("Interest_Amount1: " + interest_amount1 + "Interest_Amount2: " + interest_amount2)
					console.log("Other_Amount1: " + other_amount1 + "Other_Amount2: " + other_amount2)
					console.log("Deduction_Amount1: " + deduction_amount1 + "Deduction_Amount2: " + deduction_amount2)

					res.send({
						Org: orgData,
						Id: req.params.id,
						Cumulative_net: parseFloat(net_amount1) + parseFloat(net_amount2),
						Cumulative_interest: parseFloat(interest_amount1) + parseFloat(interest_amount2),
						Cumulative_other: parseFloat(other_amount1) + parseFloat(other_amount2),
						Cumulative_deduction: parseFloat(deduction_amount1) + parseFloat(deduction_amount2)
					});
				})
				// res.send('im the about page!');
			}
		});
	});

	function calcAge(dateString) {
		var birthday = new Date(dateString);
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getFullYear() - 1970);
	}

	router.get('/history/:id/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				var r1;
				var r2;
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'GET_HISTORY_PAN_15G', [req.params.id], chaincode_name)
												.then((str) => {
													console.log("String is:" + str);
													r1 = str
													return sleep(100)
												}).then(()=> {
													return querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'GET_HISTORY_PAN_15G', [req.params.id], chaincode_name)
													.then((str) => {
														console.log("String is:" + str);
														r2 = str
														res.send({"Org1":r1,"Org2":r2})
													})
													
												})
			}
		})
	})


	router.get('/history/org1/:id/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'GET_HISTORY_PAN_15G', [req.params.id], chaincode_name)
												.then((str) => {
													console.log("String is:" + str);
													res.send({"Org1":str})
												})
			}
		})
	})


	router.get('/history/org2/:id/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'GET_HISTORY_PAN_15G', [req.params.id], chaincode_name)
												.then((str) => {
													console.log("String is:" + str);
													res.send({"Org2":str})
												})
			}
		})
	})
	
		

	router.get('/pan/pull/:id/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log("Id: ",req.params.id)
				mongoose.connect('mongodb://192.168.99.100:27027/panstore').then(
					() => {
						console.log("Success Connecting to panstore")
						var query = panModel.find({}, function (err, user) {
							if (err) return handleError(err);
						})
						query.exec(function (err, result) {

							if (err) return handleError(err);
							//console.log('%s', res);
							
							//res.toString().replace("_","")
							var lt = []
							for(let i = 0; i < result.length; i++) {
								console.log("val1 ",result[i].pan_number.toString(),"val2",req.params.id.toString())
								if (result[i].pan_number.toString() == req.params.id.toString()) {
									console.log("Entered")
									lt.push({"pan_number":result[i].pan_number.toString(),"name":result[i].name.toString(),"gender":result[i].gender.toString(),"dob":result[i].dob.toString()})
									console.log("Lt:",lt);
									break;
								}
							}
							// if (JSON.parse(res[0]).pan_number == req.params.id) {
							// 	lt.push(res);
							// }
							console.log("Lt is : ",lt)
							if (lt.length == 0) {
								res.send({ "Details": null })
							} else {
								res.send({ "Details": lt[0] })
							}
							console.log("panstore DB Queried")

						});
						
					},

					err => { console.log("Error Connecting to userstore") }

				)
			}
		})
	})


	router.post('/update/org1/:id', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				//let total_amount = (parseFloat(req.body.interest_amount)+parseFloat(req.body.other_amount)-parseFloat(req.body.deduction_amount)).toString()
				querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id,req.body.fy_year], chaincode_name).then((str) => {
						console.log(str)
						var x = str;
						return 	querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_RULES_15G', [], chaincode_name).then((str) => {
								console.log("Rules",str)
								var interest_rule;
								var net_rule;
								var deduction_rule;
								var arr=[];
								var diction = JSON.parse(str)
								

								// alert(this.Rule_type)
								for (let i = 0; i < Object.keys(diction).length; i++) {
									//console.log(diction[Object.keys(diction)[i]])
									let dict = diction[Object.keys(diction)[i]];
									for (let j = 0; j < Object.keys(dict).length; j++) {
										arr.push(JSON.parse(dict[Object.keys(dict)[j]]))
									}
								}
								//console.log("Arr",arr)
								
								interest_rule = arr.filter(function (element) {
									console.log("rt",element.RULE_TYPE,"ri",element.RULE_INCOME,"gndr",element.GENDER,"ruleyear",element.RULE_YEAR)

									return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "INTEREST" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
								})

								net_rule = arr.filter(function (element) {
									return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "NET" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
								})

								deduction_rule = arr.filter(function (element) {
									return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "DEDUCTION" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
								})

								console.log("i",interest_rule,"n",net_rule,"d",deduction_rule)

								var cumulative_interest_amount;
								var cumulative_net_amount;
								var cumulative_other_amount;
								var cumulative_deduction_amount;
								var details;

								let options = { url: 'http://127.0.0.1:8000/cumulative/' + req.params.id + "/" + req.body.fy_year, method: 'GET', headers: { "authorization": "Bearer " + req.token } } // url, method, data, timeout,data, etc can be passed as options 
								console.log("URL: " + 'http://127.0.0.1:8000/cumulative/' + req.params.id + "/" + req.body.fy_year);						
							
								curl.request(options, (err, response) => {
										// err is the error returned  from the api
										// response contains the data returned from the api
									
										curl.request({ url: 'http://127.0.0.1:8000/pan/pull/' + req.params.id, method: 'GET', headers: { "authorization": "Bearer " + req.token } }, (err, resp) => {
											console.log("resp is"+resp)
											details = resp;
										
											console.log("Details are"+details)
											var obj = JSON.parse(x)
											console.log("obj",obj)								
											console.log("response is " + response)
											cumulative = JSON.parse(response).Cumulative
											console.log("obj is", obj)
											var t_amount
											var i_amount
											var o_amount 
											var d_amount 
											if (x.indexOf("No value found") != -1) {
												t_amount = 0
												i_amount = 0
												o_amount = 0
												d_amount = 0
											} else {
												t_amount = obj.TOTAL_AMOUNT
												i_amount = obj.INTEREST_AMOUNT
												o_amount = obj.OTHER_AMOUNT
												d_amount = obj.DEDUCTION_AMOUNT
											}
											
											console.log("response is " + response)
											cumulative_net_amount = JSON.parse(response).Cumulative_net-t_amount
											cumulative_interest_amount = JSON.parse(response).Cumulative_interest-i_amount
											cumulative_other_amount = JSON.parse(response).Cumulative_other-o_amount
											cumulative_deduction_amount = JSON.parse(response).Cumulative_deduction-d_amount

											console.log("cumulative_net_amount: ",cumulative_net_amount," cumulative_interest_amount",cumulative_interest_amount," cumulative_other_amount",cumulative_other_amount," cumulative_deduction_amount",cumulative_deduction_amount)
											//res.send({"cumulative_net_amount":cumulative_net_amount,"cumulative_interest_amount":cumulative_interest_amount,"cumulative_other_amount":cumulative_other_amount,"cumulative_deduction_amount":cumulative_deduction_amount})
											 var age = calcAge(JSON.parse(details)["Details"].dob)
											 console.log("Age"+age)
											 var limit_interest_amount = Infinity
											 var limit_net_amount = Infinity
											 var limit_deduction_amount = Infinity
											 var entered_interest_amount = req.body.interest_amount;
											 var entered_net_amount = 0;
											 var entered_deduction_amount = req.body.deduction_amount;
											 var entered_other_amount = req.body.other_amount;
											 var deduction_amount = 0;
											 var flg1 = 0;
											 var flg2 = 0;
											 var flg3 = 0;
											 
											 
											 if(interest_rule.length != 0) {
												if (parseInt(age) < parseInt(interest_rule[0].AGE_SENIOR)) {
													limit_interest_amount = interest_rule[0].AMOUNT_GENERAL
												} else if (parseInt(age) >= parseInt(interest_rule[0].AGE_SENIOR) && parseInt(age) < parseInt(interest_rule[0].AGE_SUPER_SENIOR)) {
													limit_interest_amount = interest_rule[0].AMOUNT_SENIOR
												} else {
													limit_interest_amount = interest_rule[0].AMOUNT_SUPER_SENIOR
												}
											 }
											 if ((parseFloat(cumulative_interest_amount) + parseFloat(entered_interest_amount)) <= limit_interest_amount) {
												//console.log("1: "+req.params.id+"2: "+req.body.amount+"3: "+req.body.fy_year+)
												flg1 = 1;

											} else {
												flg1 = 2;
												console.log("cumulative_interest_amount",cumulative_interest_amount,"entered_interest_amount",entered_interest_amount,"limit_interest_amount",limit_interest_amount)
											}

											 if(net_rule.length != 0) {
												if (parseInt(age) < parseInt(net_rule[0].AGE_SENIOR)) {
													limit_net_amount = net_rule[0].AMOUNT_GENERAL
												} else if (parseInt(age) >= parseInt(net_rule[0].AGE_SENIOR && age < net_rule[0].AGE_SUPER_SENIOR)) {
													limit_net_amount = net_rule[0].AMOUNT_SENIOR 
												} else {
													limit_net_amount =net_rule[0].AMOUNT_SUPER_SENIOR 
												}
											 }
											 

											 if(deduction_rule.length != 0) {
												if (parseInt(age) < parseInt(deduction_rule[0].AGE_SENIOR)) {
													limit_deduction_amount = deduction_rule[0].AMOUNT_GENERAL
												} else if (parseInt(age) >= parseInt(deduction_rule[0].AGE_SENIOR && age < deduction_rule[0].AGE_SUPER_SENIOR)) {
													limit_deduction_amount = deduction_rule[0].AMOUNT_SENIOR
												} else {
													limit_deduction_amount = deduction_rule[0].AMOUNT_SUPER_SENIOR
												}
											 }

											 if ((parseFloat(cumulative_deduction_amount) + parseFloat(entered_deduction_amount)) <= limit_deduction_amount) {
												//console.log("1: "+req.params.id+"2: "+req.body.amount+"3: "+req.body.fy_year+)
												deduction_amount = (parseFloat(cumulative_deduction_amount) + parseFloat(entered_deduction_amount))
												console.log("deduction_amount",deduction_amount)
												flg2 = 1;
											} else {
												deduction_amount = limit_deduction_amount
												flg2 = 2;
											}

											entered_net_amount = parseFloat(entered_interest_amount)+parseFloat(entered_other_amount)-parseFloat(deduction_amount)
											console.log("entered_net_amount",entered_net_amount)

											if(parseFloat(entered_net_amount) <= 0 || parseFloat(cumulative_net_amount) < 0) {
												console.log("Entered and negetive")
												flg3 = 3;
											} else if (parseFloat(cumulative_net_amount)+entered_net_amount <= limit_net_amount) {
												flg3 = 1;
											} else {
												flg3 = 2;
											}
											if (flg3 == 3){
												res.send({
													Org: orgData,
													Result: "Check the entered values..Taxable income cannot be negative!!"
												});											

											} else {
												return querychaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id, req.body.fy_year.toString()], chaincode_name)
													.then((str) => {
														var object = JSON.parse(str)
													
														if (flg1 == 2) {
															return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
															.then((str) => {
																return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																	res.send({
																		Org: orgData,
																		Result: "Interest income limit reached!!Your transaction will be noted down for scrutiny!"
																	});
																})
																
															})


														} else if (flg2 == 2) {
															
															return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
															.then((str) => {
																return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																	res.send({
																		Org: orgData,
																		Result: "Deduction limit reached!!Max Limit will be used!"
																	});
																})
																
															})

														} else if (flg3 == 2) {
															return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
															.then((str) => {
																return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																	res.send({
																		Org: orgData,
																		Result: "Taxation income limit reached!!Your transaction will be noted down for scrutiny!"
																	});
																})
																
															})
														} else {
															return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["APPROVED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
															.then((str) => {
																res.send({
																	Org: orgData,
																	Result: "Successful transaction!"
																});
															})
														}
													})
											}


											console.log("limit_interest_amount",limit_interest_amount,"limit_net_amount",limit_net_amount,"limit_deduction_amount",limit_deduction_amount,"cumulative_interest_amount",cumulative_interest_amount,"cumulative_net_amount",cumulative_net_amount,"cumulative_other_amount",cumulative_other_amount,"cumulative_deduction_amount",cumulative_deduction_amount,"entered_interest_amount",entered_interest_amount,"entered_other_amount",entered_other_amount,"entered_deduction_amount",entered_deduction_amount)


											
											
											// console.log("limit interest amount is : " + )
											// console.log("interest cumulative is : " + cumulative_interest_amount)
											// console.log("Entered interest amount is: " + req.body.amount)
													
								})
							});									
					}
				).then(
					console.log("End...")
				)
		 
	 		 })
		}
	})
})
	

router.post('/update/org2/:id', verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', (err, orgData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			//let total_amount = (parseFloat(req.body.interest_amount)+parseFloat(req.body.other_amount)-parseFloat(req.body.deduction_amount)).toString()
			querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id,req.body.fy_year], chaincode_name).then((str) => {
					console.log(str)
					var x = str;
					return 	querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_RULES_15G', [], chaincode_name).then((str) => {
							console.log("Rules",str)
							var interest_rule;
							var net_rule;
							var deduction_rule;
							var arr=[];
							var diction = JSON.parse(str)
							

							// alert(this.Rule_type)
							for (let i = 0; i < Object.keys(diction).length; i++) {
								//console.log(diction[Object.keys(diction)[i]])
								let dict = diction[Object.keys(diction)[i]];
								for (let j = 0; j < Object.keys(dict).length; j++) {
									arr.push(JSON.parse(dict[Object.keys(dict)[j]]))
								}
							}
							//console.log("Arr",arr)
							
							interest_rule = arr.filter(function (element) {
								console.log("rt",element.RULE_TYPE,"ri",element.RULE_INCOME,"gndr",element.GENDER,"ruleyear",element.RULE_YEAR)

								return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "INTEREST" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
							})

							net_rule = arr.filter(function (element) {
								return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "NET" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
							})

							deduction_rule = arr.filter(function (element) {
								return (element.RULE_TYPE === "15G/H" && element.RULE_INCOME === "DEDUCTION" && element.GENDER === req.body.gender.toString() && element.RULE_YEAR.toString() === req.body.fy_year.toString());
							})

							console.log("i",interest_rule,"n",net_rule,"d",deduction_rule)

							var cumulative_interest_amount;
							var cumulative_net_amount;
							var cumulative_other_amount;
							var cumulative_deduction_amount;
							var details;

							let options = { url: 'http://127.0.0.1:8000/cumulative/' + req.params.id + "/" + req.body.fy_year, method: 'GET', headers: { "authorization": "Bearer " + req.token } } // url, method, data, timeout,data, etc can be passed as options 
							console.log("URL: " + 'http://127.0.0.1:8000/cumulative/' + req.params.id + "/" + req.body.fy_year);						
						
							curl.request(options, (err, response) => {
									// err is the error returned  from the api
									// response contains the data returned from the api
								
									curl.request({ url: 'http://127.0.0.1:8000/pan/pull/' + req.params.id, method: 'GET', headers: { "authorization": "Bearer " + req.token } }, (err, resp) => {
										console.log("resp is"+resp)
										details = resp;
									
										console.log("Details are"+details)
										var obj = JSON.parse(x)
										console.log("obj",obj)								
										console.log("response is " + response)
										cumulative = JSON.parse(response).Cumulative
										console.log("obj is", obj)
										var t_amount
										var i_amount
										var o_amount 
										var d_amount 
										if (x.indexOf("No value found") != -1) {
											t_amount = 0
											i_amount = 0
											o_amount = 0
											d_amount = 0
										} else {
											t_amount = obj.TOTAL_AMOUNT
											i_amount = obj.INTEREST_AMOUNT
											o_amount = obj.OTHER_AMOUNT
											d_amount = obj.DEDUCTION_AMOUNT
										}
										
										console.log("response is " + response)
										cumulative_net_amount = JSON.parse(response).Cumulative_net-t_amount
										cumulative_interest_amount = JSON.parse(response).Cumulative_interest-i_amount
										cumulative_other_amount = JSON.parse(response).Cumulative_other-o_amount
										cumulative_deduction_amount = JSON.parse(response).Cumulative_deduction-d_amount

										console.log("cumulative_net_amount: ",cumulative_net_amount," cumulative_interest_amount",cumulative_interest_amount," cumulative_other_amount",cumulative_other_amount," cumulative_deduction_amount",cumulative_deduction_amount)
										//res.send({"cumulative_net_amount":cumulative_net_amount,"cumulative_interest_amount":cumulative_interest_amount,"cumulative_other_amount":cumulative_other_amount,"cumulative_deduction_amount":cumulative_deduction_amount})
										 var age = calcAge(JSON.parse(details)["Details"].dob)
										 console.log("Age"+age)
										 var limit_interest_amount = Infinity
										 var limit_net_amount = Infinity
										 var limit_deduction_amount = Infinity
										 var entered_interest_amount = req.body.interest_amount;
										 var entered_net_amount = 0;
										 var entered_deduction_amount = req.body.deduction_amount;
										 var entered_other_amount = req.body.other_amount;
										 var deduction_amount = 0;
										 var flg1 = 0;
										 var flg2 = 0;
										 var flg3 = 0;
										 
										 
										 if(interest_rule.length != 0) {
											if (parseInt(age) < parseInt(interest_rule[0].AGE_SENIOR)) {
												limit_interest_amount = interest_rule[0].AMOUNT_GENERAL
											} else if (parseInt(age) >= parseInt(interest_rule[0].AGE_SENIOR) && parseInt(age) < parseInt(interest_rule[0].AGE_SUPER_SENIOR)) {
												limit_interest_amount = interest_rule[0].AMOUNT_SENIOR
											} else {
												limit_interest_amount = interest_rule[0].AMOUNT_SUPER_SENIOR
											}
										 }
										 if ((parseFloat(cumulative_interest_amount) + parseFloat(entered_interest_amount)) <= limit_interest_amount) {
											//console.log("1: "+req.params.id+"2: "+req.body.amount+"3: "+req.body.fy_year+)
											flg1 = 1;

										} else {
											flg1 = 2;
										}

										 if(net_rule.length != 0) {
											if (parseInt(age) < parseInt(net_rule[0].AGE_SENIOR)) {
												limit_net_amount = net_rule[0].AMOUNT_GENERAL
											} else if (parseInt(age) >= parseInt(net_rule[0].AGE_SENIOR && age < net_rule[0].AGE_SUPER_SENIOR)) {
												limit_net_amount = net_rule[0].AMOUNT_SENIOR 
											} else {
												limit_net_amount =net_rule[0].AMOUNT_SUPER_SENIOR 
											}
										 }
										 

										 if(deduction_rule.length != 0) {
											if (parseInt(age) < parseInt(deduction_rule[0].AGE_SENIOR)) {
												limit_deduction_amount = deduction_rule[0].AMOUNT_GENERAL
											} else if (parseInt(age) >= parseInt(deduction_rule[0].AGE_SENIOR && age < deduction_rule[0].AGE_SUPER_SENIOR)) {
												limit_deduction_amount = deduction_rule[0].AMOUNT_SENIOR
											} else {
												limit_deduction_amount = deduction_rule[0].AMOUNT_SUPER_SENIOR
											}
										 }

										 if ((parseFloat(cumulative_deduction_amount) + parseFloat(entered_deduction_amount)) <= limit_deduction_amount) {
											//console.log("1: "+req.params.id+"2: "+req.body.amount+"3: "+req.body.fy_year+)
											deduction_amount = (parseFloat(cumulative_deduction_amount) + parseFloat(entered_deduction_amount))
											console.log("deduction_amount",deduction_amount)
											flg2 = 1;
										} else {
											deduction_amount = limit_deduction_amount
											flg2 = 2;
										}

										entered_net_amount = parseFloat(entered_interest_amount)+parseFloat(entered_other_amount)-parseFloat(deduction_amount)
										console.log("entered_net_amount",entered_net_amount)
										if(parseFloat(entered_net_amount) <= 0 || parseFloat(cumulative_net_amount) <= 0) {
											console.log("Entered and negetive")
											flg3 = 3;
										}else if (parseFloat(cumulative_net_amount)+entered_net_amount <= limit_net_amount) {
											flg3 = 1;
										} else {
											flg3 = 2;
										}
										if (flg3 == 3){
											res.send({
												Org: orgData,
												Result: "Check the entered values..Taxable income cannot be negative!!"
											});											

										} else {
											return querychaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'QUERY_BY_YEAR_15G', [req.params.id, req.body.fy_year.toString()], chaincode_name)
												.then((str) => {
													var object = JSON.parse(str)
												
													if (flg1 == 2) {
														return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
														.then((str) => {
															return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																res.send({
																	Org: orgData,
																	Result: "Interest income limit reached!!Your transaction will be noted down for scrutiny!"
																});
															})
															
														})


													} else if (flg2 == 2) {
														
														return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
														.then((str) => {
															return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																res.send({
																	Org: orgData,
																	Result: "Deduction limit reached!!Max Limit will be used!"
																});
															})
															
														})

													} else if (flg3 == 2) {
														return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
														.then((str) => {
															return invokechaincode('second', org2mspid, 'org2', org2peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["REJECTED",object.PAN_NUMBER, object.TOTAL_AMOUNT.toString(), object.INTEREST_AMOUNT.toString(), object.OTHER_AMOUNT.toString(), object.DEDUCTION_AMOUNT.toString(),object.YEAR.toString(),object.GENDER.toString(),object.DOB], chaincode_name).then((str)=>{
																res.send({
																	Org: orgData,
																	Result: "Taxation income limit reached!!Your transaction will be noted down for scrutiny!"
																});
															})
															
														})
													} else {
														return invokechaincode('first', org1mspid, 'org1', org1peersurl, org3peersurl, 'orderer', 'UPDATE_15G', ["APPROVED",req.params.id, entered_net_amount.toString(), entered_interest_amount.toString(), entered_other_amount.toString(), deduction_amount.toString(),req.body.fy_year.toString(),JSON.parse(details)["Details"].gender,JSON.parse(details)["Details"].dob], chaincode_name)
														.then((str) => {
															res.send({
																Org: orgData,
																Result: "Successful transaction!"
															});
														})
													}
												})
										}


										console.log("limit_interest_amount",limit_interest_amount,"limit_net_amount",limit_net_amount,"limit_deduction_amount",limit_deduction_amount,"cumulative_interest_amount",cumulative_interest_amount,"cumulative_net_amount",cumulative_net_amount,"cumulative_other_amount",cumulative_other_amount,"cumulative_deduction_amount",cumulative_deduction_amount,"entered_interest_amount",entered_interest_amount,"entered_other_amount",entered_other_amount,"entered_deduction_amount",entered_deduction_amount)


										
										
										// console.log("limit interest amount is : " + )
										// console.log("interest cumulative is : " + cumulative_interest_amount)
										// console.log("Entered interest amount is: " + req.body.amount)
												
							})
						});									
				}
			).then(
				console.log("End...")
			)
	 
		  })
	}
})
})

	router.post('/update/org3/rules/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log(req.token + "token")
				console.log(req.body, "kjhvjuvuovovuovv");
				// console.log("gender: "+req.body.gender+" Amount general:  "+req.body.amountg+" Amount Senior: "+req.body.amounts+req.body.ages)
				var age = req.body.age;
				
				invokechaincode('first', org3mspid, 'orderer', org3peersurl, org1peersurl, 'org1', 'UPDATE_RULES_15G', [req.body.rule_type,req.body.rule_income,req.body.rule_year,req.body.gender, req.body.amount_general, req.body.amount_senior,req.body.amount_super_senior, req.body.age_senior.toString(),req.body.age_super_senior.toString()], chaincode_name)
					.then((str) => {
						console.log("String is:" + str);
						return invokechaincode('second', org3mspid, 'orderer', org3peersurl, org2peersurl, 'org2', 'UPDATE_RULES_15G', [req.body.rule_type,req.body.rule_income,req.body.rule_year,req.body.gender, req.body.amount_general, req.body.amount_senior,req.body.amount_super_senior, req.body.age_senior.toString(),req.body.age_super_senior.toString()], chaincode_name)

					}).then((str) => {
						res.send({
							Org: orgData,
							Result: str
						});
					})
			}
		});
		// res.send('im the about page!');
	});



	router.get('/store/org3/:id/:hash', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				apps.invokechaincode('all', org1mspid, 'org1', org1peersurl, org2mspid, 'org2', org2peersurl, org3mspid, 'orderer', org3peersurl, 'STORE_26AS', [req.params.id,req.params.hash], apps.chaincode_name).then((str)=>{
					if (str == "Successfully stored hash") {
						res.send({
							MssgCode:"1",
							MssgStr:str
						});
					} else if (str == "Some Error") {
						res.send({
							MssgCode:"0",
							MssgStr:str
						})
					} else {
						res.send({
							MssgCode:"-1",
							MssgStr:"Unknown Status"
						})
					}
					
				})
			}
		});
		// res.send('im the about page!');
	});

	router.get('/gethash/org3/:id/', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				apps.querychaincode('all', org1mspid, 'org1', org1peersurl, org2mspid, 'org2', org2peersurl, org3mspid, 'orderer', org3peersurl, 'QUERY_26AS', [req.params.id], apps.chaincode_name).then((str)=>{
					if (str != "") {
						res.send({
							MssgCode:"1",
							MssgStr:str
						});
					} else if (str == "") {
						res.send({
							MssgCode:"0",
							MssgStr:"PAN not found"
						})
					} else {
						res.send({
							MssgCode:"-1",
							MssgStr:"Unknown Status"
						})
					}
				})
			}
		});
		// res.send('im the about page!');
	});
	
	
	router.get('/match/:id/:hash', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log("orgData",orgData)
				console.log("orgData.user",orgData.user.userName)
				if (orgData.user.userName == "org1") {
					apps.invokechaincode('all', org1mspid, 'org1', org1peersurl, org2mspid, 'org2', org2peersurl, org3mspid, 'orderer', org3peersurl, 'MATCH_26AS', [req.params.id,req.params.hash], apps.chaincode_name).then((str)=>{
						console.log("match",str.toString())
						if(str.trim() == "Success") {
							res.send({
								MssgCode:"1",
								MssgStr:"Matched!"
							});
						} else if (str.trim() == "Failure"){
							res.send({
								MssgCode:"0",
								MssgStr: "Not Matched!"
							});
						} else {
							res.send({
								MssgCode:"-1",
								MssgStr: str
							});
						}	
					})
				} else if (orgData.user.userName == "org2") {
					apps.invokechaincode('all', org2mspid, 'org2', org2peersurl,org1mspid, 'org1', org1peersurl, org3mspid, 'orderer', org3peersurl, 'MATCH_26AS', [req.params.id,req.params.hash], apps.chaincode_name).then((str)=>{
						console.log("match",str.toString())
						if(str.trim() == "Success") {
							res.send({
								MssgCode:"1",
								MssgStr:"Matched!"
							});
						} else if (str.trim() == "Failure"){
							res.send({
								MssgCode:"0",
								MssgStr: "Not Matched!"
							});
						} else {
							res.send({
								MssgCode:"-1",
								MssgStr: str
							});
						}	
					})
				}
				
			}
		});
		// res.send('im the about page!');
	});



	router.post('/storehash/org3/:id', verifyToken, function (req, res) {
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			console.log("TOKKEN",req.token)
			console.log("Err",err);
			if (err) {
				res.sendStatus(403);
			} else {
				var finalHashValue
				mongoose.connect('mongodb://192.168.99.100:27017/docstore').then(()=>{
					var query = docModel.find({}, function (err, user) {
						if (err) return handleError(err);
					})
					query.exec(function (err, result) {
						if (err) return handleError(err);
						console.log(result)
						var ct = 0
						for (let i = 0; i < result.length; i++) {
							if (req.params.id == result[i].pan_number) {								
								var fs = require('fs');
								console.log("pathsdfs",result[i].path.slice(1,result[i].path.length))
								fs.readFile(result[i].path.slice(0,result[i].path.length), 'base64', function(err, str) { 
										// console.log(str); 
										console.log("Path",result[i].path,"Error",err)
										const crypto = require('crypto');
										const hash = crypto.createHash('sha512');
										hash.update(str);
										finalHashValue=hash.digest("hex");
										console.log("Hash",finalHashValue);
										curl.request({ url: 'http://127.0.0.1:8000/store/org3/' + req.params.id+"/"+finalHashValue, method: 'GET', headers: { "authorization": "Bearer " + req.token } }, (err, resp) => {
												res.sendFile(__dirname+result[i].path.slice(1,result[i].path.length))											
										});
								});
								ct = ct +1
								break;
							} 
						}
						if (ct == 0) {
							res.send({
								MssgCode:"0",
								MssgStr:"Pan Not found"
							})
						}
						
					});
					
				})

			}
		});
		// res.send('im the about page!');
	});


	router.post('/upload/:path', verifyToken, function (req, res) {
		//jwt.verify(req.token, 'secretkey', (err, orgData) => {
			console.log("dbhsvfkggvjhbknk-------------")
			var fs = require('fs');
			console.log(req.body.pan)
			fs.readFile('PDFStore/'+req.params.path, 'base64', function(err, str) { 
					// console.log(str); 
					const crypto = require('crypto');
					const hash = crypto.createHash('sha512');
					hash.update(str);
					var finalHashValue=hash.digest("hex");
					var temp1=req.body.pan;	
					console.log("Computed hash",finalHashValue)
					curl.request({ url: 'http://127.0.0.1:8000/match/' + temp1+"/"+finalHashValue, method: 'GET', headers: { "authorization": "Bearer " + req.token } }, (err, resp) => {
						if (JSON.parse(resp).MssgStr == "Matched!") {
							//
							apps.invokechaincode('all', org1mspid, 'org1', org1peersurl, org2mspid, 'org2', org2peersurl, org3mspid, 'orderer', org3peersurl, 'STORE_26AS', [req.params.id,req.params.hash], apps.chaincode_name).then((str)=>{
								
							})
								res.send({
								MssgCode:"1",
								MssgStr: "Your 26AS form is valid!"
							})
						} else if (JSON.parse(resp).MssgStr == "Not Matched!") {
							res.send({
								MssgCode:"0",
								MssgStr: "Your 26AS form is invalid!"
							})
						} else {
							res.send({
								MssgCode:"-1",
								MssgStr: str
							})
						}
					})
			});
		//});
		// res.send('im the about page!');
	});


	router.get('/history26AS/:id', verifyToken, function (req, res) {
		
		jwt.verify(req.token, 'secretkey', (err, orgData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				// console.log("==========================="+req.paraid)
				apps.querychaincode('all', org1mspid, 'org1', org1peersurl, org2mspid, 'org2', org2peersurl, org3mspid, 'orderer', org3peersurl, 'GET_HISTORY_PAN_26AS', [req.params.id], apps.chaincode_name)
												.then((str) => {
													if (str == "") {
														console.log("String is:" + str);
														res.send({"MssgCode":0,"MssgStr":"No such PAN"})
													} else {
														console.log("String is:" + str);
														res.send({"MssgCode":1,"MssgStr":str})
													}
													
												},(err)=> {
													// console.log("String is:" + str);
													res.send({"MssgCode":-1,"MssgStr":err.message})
												})
			}
		})
	})


	// apply the routes to our application
	app.use('/', router);
	module.exports = router;

	// ========== lib/404.js ==========
	module.exports = function () {
		return function (req, res, next) {
			res.status(404).send('uh oh');
		};
	};

	// ========== lib/error.js ==========
	module.exports = function () {
		return function (err, req, res, next) {
			res.status(500).send('unknown error');
		};
	};
}

//capitalize function
String.prototype.capitalize = function () {
	return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};


//Enroll Admin
function enroll_admin(fabric_client, fabric_ca_client, admin_user, member_user, store_path, orgca) {
	Fabric_Client.newDefaultKeyValueStore({
		path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		var tlsOptions = {
			trustedRoots: [],
			verify: false
		};
		// be sure to change the http to https when the CA is running TLS enabledf
		fabric_ca_client = new Fabric_CA_Client('https://192.168.99.100:7054', tlsOptions, orgca, crypto_suite);
		// first check to see if the admin is already enrolled
		return fabric_client.getUserContext('admin', true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded admin from persistence');
			admin_user = user_from_store;
			return null;
		} else {
			// need to enroll it with CA server
			return fabric_ca_client.enroll({
				enrollmentID: 'admin',
				enrollmentSecret: 'adminpw'
			}).then((enrollment) => {
				console.log('Successfully enrolled admin user "admin"');
				return fabric_client.createUser(
					{
						username: 'admin',
						mspid: 'Org1MSP',
						cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
					});
			}).then((user) => {
				admin_user = user;
				return fabric_client.setUserContext(admin_user);
			}).catch((err) => {
				console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
				throw new Error('Failed to enroll admin');
			});
		}
	}).then(() => {
		console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
	}).catch((err) => {
		console.error('Failed to enroll admin: ' + err);
	});
}




//Register User

function register_user(fabric_client, fabric_ca_client, admin_user, member_user, store_path, orgca) {
	Fabric_Client.newDefaultKeyValueStore({
		path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		var tlsOptions = {
			trustedRoots: [],
			verify: false
		};
		// be sure to change the http to https when the CA is running TLS enabled
		fabric_ca_client = new Fabric_CA_Client('https://192.168.99.100:7054', null, '', crypto_suite);
		// first check to see if the admin is already enrolled
		return fabric_client.getUserContext('admin', true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded admin from persistence');
			admin_user = user_from_store;
		} else {
			throw new Error('Failed to get admin.... run enrollAdmin.js');
		}
		// at this point we should have the admin user
		// first need to register the user with the CA server
		return fabric_ca_client.register({ enrollmentID: 'user1', affiliation: 'org1.department1', role: 'client' }, admin_user);
	}).then((secret) => {
		// next we need to enroll the user with CA server
		console.log('Successfully registered user1 - secret:' + secret);
		return fabric_ca_client.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
	}).then((enrollment) => {
		console.log('Successfully enrolled member user "user1" ');
		return fabric_client.createUser(
			{
				username: 'user1',
				mspid: 'Org1MSP',
				cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
			});
	}).then((user) => {
		member_user = user;
		return fabric_client.setUserContext(member_user);
	}).then(() => {
		console.log('User1 was successfully registered and enrolled and is ready to intreact with the fabric network');
	}).catch((err) => {
		console.error('Failed to register: ' + err);
		if (err.toString().indexOf('Authorization') > -1) {
			console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
				'Try again after deleting the contents of the store directory ' + store_path);
		}
	});
}

//Revoke user

function revoke_user(fabric_client, fabric_ca_client, admin_user, member_user, store_path, orgca) {
	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	Fabric_Client.newDefaultKeyValueStore({
		path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		var tlsOptions = {
			trustedRoots: [],
			verify: false
		};
		// be sure to change the http to https when the CA is running TLS enabled
		fabric_ca_client = new Fabric_CA_Client('https://192.168.99.100:7054', null, '', crypto_suite);

		// first check to see if the admin is already enrolled
		return fabric_client.getUserContext('admin', true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded admin from persistence');
			admin_user = user_from_store;
		} else {
			throw new Error('Failed to get admin.... run enrollAdmin.js');
		}

		// at this point we should have the admin user
		// first need to register the user with the CA server
		return fabric_ca_client.revoke({ enrollmentID: 'user1' }, admin_user);
	}).then((secret) => {
		// next we need to enroll the user with CA server
		console.log('Successfully revoked user1 - secret:' + secret);


	}).catch((err) => {
		console.error('Failed to revoke: ' + err);
		if (err.toString().indexOf('Authorization') > -1) {
			console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
				'Try again after deleting the contents of the store directory ' + store_path);
		}
	});

}

//Sleep Function
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
//Gets event
//events(chaincode_name,channel_name,org1mspid,'org1',org1peersurl,org2peersurl,"chaincode")

// 
function events(chaincode_name, channel_name, orgName, orgPath, apeers, zpeers, chaincodepath) {
	var client = new Client()
	var targets = []
	var channel = client.newChannel(channel_name);
	var certdata

	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + orgName
	}).then((store) => {

		client.setStateStore(store);
		return getAdmin(client, orgPath, orgName);
	}).then((admin) => {
		//Create eventhub
		//Connect to EventHub
		var eh = client.newEventHub();
		process.env['GOPATH'] = __dirname;
		var ccPath = process.env['GOPATH'] + "/src/" + chaincodepath

		certdata = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer0" + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
		eh.setPeerAddr(
			apeers[0].eventurl,
			{
				pem: Buffer.from(certdata).toString(),
				'ssl-target-name-override': 'peer0' + "." + orgPath + ".example.com"
			}
		);
		//console.log("Enter")
		eh.connect()
		var regid = eh.registerChaincodeEvent(chaincode_name, "evtsender", function (event) {
			//console.log(util.format("Custom event received, payload: %j\n", event));
			console.log("Inside Custom Event")
			console.log(util.format("Custom event received, payload: %j\n", event.payload.toString()));
			eh.unregisterChaincodeEvent(regid);
			eh.disconnect();
		});
		process.on('exit', function () {
			eh.disconnect()
		});
	}, (err) => {
		console.log('Failed to get event due to error: ', err);
	});
}

function querychaincode(channel_name, orgName, orgPath, apeers, zpeers, zorgPath, funct, argument, chaincodeID) {

	return new Promise(function (resolve, reject) {
		var targets = [];
		var str;
		var client = new Client();
		var channel = client.newChannel(channel_name);
		channel.addOrderer(orderer)
		for (var i = 0; i < apeers.length; i++) {
			let peer = apeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
				}
			);
			targets.push(peer_obj)
			channel.addPeer(peer_obj);
		}
		for (var i = 0; i < zpeers.length; i++) {
			let peer = zpeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + zorgPath + ".example.com/peers/peer" + i + "." + zorgPath + ".example.com/msp/tlscacerts/tlsca." + zorgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + zorgPath + ".example.com"
				}
			);
			targets.push(peer_obj)
			channel.addPeer(peer_obj);
		}
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + orgName
		}).then((store) => {

			client.setStateStore(store);
			return getAdmin(client, orgPath, orgName);
		}).then((admin) => {
			return channel.initialize();
		}, (err) => {
			console.log('Failed to enroll user admin ', err);
		}).then(() => {
			tx_id = client.newTransactionID();

			// build query request
			var request = {
				chaincodeId: chaincodeID,
				txId: tx_id,
				fcn: funct,
				args: argument
			};
			//send query request to peers
			return channel.queryByChaincode(request, targets);
		}, (err) => {

			console.log('Failed to initialize the channel: ', err);

		}).then((response_payloads) => {
			//gets response from each peer and check for status
			if (response_payloads) {
				console.log("Resp Payload: " + response_payloads[0].toString('utf8'));
				str = response_payloads[0].toString('utf8');
				resolve(str)
			} else {
				console.log('response_payloads is null');
				str = null;
				resolve(str)
			}
		}, (err) => {
			console.log('Failed to send query due to error: ', err);
			reject(err)
		});

	});
}

function invokechaincode(channel_name, orgName, orgPath, apeers, zpeers, zorgPath, funct, argument, chaincodeId) {

	return new Promise((resolve, reject) => {
		var client = new Client();
		var channel = client.newChannel(channel_name);
		channel.addOrderer(orderer)
		for (var i = 0; i < apeers.length; i++) {
			let peer = apeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
				}
			);
			channel.addPeer(peer_obj);
		}
		for (var i = 0; i < zpeers.length; i++) {
			let peer = zpeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + zorgPath + ".example.com/peers/peer" + i + "." + zorgPath + ".example.com/msp/tlscacerts/tlsca." + zorgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + zorgPath + ".example.com"
				}
			);
			channel.addPeer(peer_obj);
		}
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + orgName
		}).then((store) => {
			client.setStateStore(store);
			return getAdmin(client, orgPath, orgName);
		}).then((admin) => {
			return channel.initialize();
		}, (err) => {
			console.log('Failed to enroll user admin ', err);
		}).then(() => {
			tx_id = client.newTransactionID();
			//build invoke request
			var request = {
				chaincodeId: chaincodeId,
				fcn: funct,
				args: argument,
				txId: tx_id,
			};
			// send proposal to endorser
			return channel.sendTransactionProposal(request);
		}, (err) => {
			console.log('Failed to initialize the channel: ', err);
		}).then((results) => {
			//get the endorsement response from the peers and check for response status
			pass_results = results;
			console.log("Results: ", results)
			var proposalResponses = pass_results[0];

			var proposal = pass_results[1];
			var all_good = true;
			for (var i in proposalResponses) {
				let one_good = false;
				let proposal_response = proposalResponses[i];
				if (proposal_response.response && proposal_response.response.status === 200) {
					console.log('transaction proposal has response status of good');
					one_good = channel.verifyProposalResponse(proposal_response);
					if (one_good) {
						console.log(' transaction proposal signature and endorser are valid');
					}
				} else {
					console.log('transaction proposal was bad');
				}
				all_good = all_good & one_good;
			}
			if (all_good) {
				//checks if the proposal has same read/write sets.
				//This will validate that the endorsing peers all agree on the result of the chaincode execution.
				all_good = channel.compareProposalResponseResults(proposalResponses);
				if (all_good) {
					console.log(' All proposals have a matching read/writes sets');
				}
				else {
					console.log(' All proposals do not have matching read/write sets');
				}
			}
			if (all_good) {
				// check to see if all the results match
				console.log('Successfully sent Proposal and received ProposalResponse');
				console.log('Successfully sent Proposal and received ProposalResponse: ', proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature);

				var request = {
					proposalResponses: proposalResponses,
					proposal: proposal
				};
				var invokeId = tx_id.getTransactionID();
				eh = client.newEventHub();
				let data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer0." + orgPath + ".example.com/tls/ca.crt");
				eh.setPeerAddr(apeers[0].eventurl, {
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': 'peer0.' + orgPath + '.example.com'
				});
				eh.connect();
				let txPromise = new Promise((resolve, reject) => {
					let handle = setTimeout(() => {
						eh.disconnect();
						reject();
					}, 3000);

					eh.registerTxEvent(invokeId, (tx, code) => {
						console.log('The chaincode invoke transaction has been committed on peer ', eh._ep._endpoint.addr);
						clearTimeout(handle);
						eh.unregisterTxEvent(invokeId);
						eh.disconnect();
						if (code !== 'VALID') {
							console.log('The chaincode invoke transaction was invalid, code = ', code);
							reject();
						} else {
							console.log('The chaincode invoke transaction was valid.');
							resolve();
						}
					});
				});
				//sends the endorsement response to the orderer for ordering
				var sendPromise = channel.sendTransaction(request);
				return Promise.all([sendPromise].concat([txPromise])).then((results) => {
					console.log('Event promise all complete and testing complete');
					return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
				}).catch((err) => {
					console.log('Failed to send instantiate transaction and get notifications within the timeout period:P ', err)
					return 'Failed to send instantiate transaction and get notifications within the timeout period.';
				});
			}
		}).then((response) => {

			//gets the final response from the orderer and check the response status
			if (response.status === 'SUCCESS') {
				console.log('Successfully sent transaction to the orderer.');
				resolve("Successful")
			} else {
				console.log('Failed to order the transaction. Error code: ', err);
				reject("Failed")
			}
		}, (err) => {

			console.log('Failed to send transaction due to error: ', err);
			reject("Failed")
		});
	})
}

function getallChannels(peers, orgmspid, orgPath) {

	targets = [];
	for (var i = 0; i < peers.length; i++) {
		let peer = peers[i];
		data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
		let peer_obj = client.newPeer(
			peer.url,
			{
				pem: Buffer.from(data).toString(),
				'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
			}
		);
		targets.push(peer_obj);
	}
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + orgmspid
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		return getAdmin(client, orgPath, orgmspid)
	}).then((admin) => {
		console.log('\nSuccessfully enrolled org1 \'admin\'');
		console.log('\nGetting the channel list from peer');
		return client.queryChannels(targets[0])
	}).then((ChannelQueryResponse) => {
		console.log('\nChannel info: ', ChannelQueryResponse);
	});
}

function getInstantiatedChaincodes(peers, orgName, orgPath) {

	Client.setConfigSetting('request-timeout', 100000);
	var client = new Client();
	var targets = [];
	var channel = client.newChannel(channel_name);
	channel.addOrderer(orderer)
	for (var i = 0; i < peers.length; i++) {
		let peer = peers[i];
		data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
		let peer_obj = client.newPeer(
			peer.url,
			{
				pem: Buffer.from(data).toString(),
				'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
			}
		);
		targets.push(peer_obj);
	}
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + orgName
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		return getAdmin(client, orgPath, orgName)
	}).then((admin) => {
		console.log('\nSuccessfully enrolled org1 \'admin\'');
		console.log('\Getting the channel info block from orderer');
		return channel.queryInstantiatedChaincodes(targets[0])
	}).then((ChaincodeQueryResponse) => {
		console.log('\Chaincodes: ', ChaincodeQueryResponse);
	});
}

function instantiateChaincode(channel_name, peers, orgPath, orgName, second_peers, second_orgPath, second_orgName, chaincodePath, chaincodeID, chaincodeVersion) {

	//sets the timeout for the request, make sure you set enough time out because on the request peer build a container for chaincode 
	//and it make take some more time to send the response
	return new Promise(function (resolve, reject) {

		Client.setConfigSetting('request-timeout', 1000000);
		var type = 'instantiate';
		var targets = [];
		var channel = client.newChannel(channel_name);
		channel.addOrderer(orderer)
		//return peers object of org1 
		for (var i = 0; i < peers.length; i++) {
			let peer = peers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
			console.log("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem")
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
				}
			);
			targets.push(peer_obj);
			channel.addPeer(peer_obj);
		}
		//return peers object of org1 
		for (var i = 0; i < second_peers.length; i++) {
			let peer = second_peers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + second_orgPath + ".example.com/peers/peer" + i + "." + second_orgPath + ".example.com/msp/tlscacerts/tlsca." + second_orgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + second_orgPath + ".example.com"
				}
			);
			targets.push(peer_obj);
			channel.addPeer(peer_obj);
		}
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + orgName
		}).then((store) => {
			console.log("\nRegistering " + orgPath + " admin")
			client.setStateStore(store);
			return getAdmin(client, orgPath, orgName);
		}).then((admin) => {
			console.log('\nSuccessfully enrolled ' + orgPath + ' \'admin\'');
			//Retrieves the configuration for the channel from the orderer
			return channel.initialize();
		}, (err) => {

			console.log('Failed to enroll user admin ', err);

		}).then(() => {
			console.log('\nBuilding instantiate proposal');
			//build request for instantiation
			let request = buildChaincodeProposal(client, chaincodePath, orgName, second_orgName, chaincodeVersion, chaincodeID);
			tx_id = request.txId;
			console.log('\nSending instantiate request to peers');
			//send transaction to the peers for endorsement
			return channel.sendInstantiateProposal(request);
		}, (err) => {

			console.log('Failed to initialize the channel: ', err);
		}).then((results) => {
			//gets the endorsement response from the peer and check if enough peers have endorsed the transaction
			var proposalResponses = results[0];
			var proposal = results[1];
			var all_good = true;
			for (var i in proposalResponses) {
				let one_good = false;
				if (proposalResponses && proposalResponses[0].response &&
					proposalResponses[0].response.status === 200) {
					one_good = true;
					console.log('instantiate proposal was good');
				} else {
					console.log('instantiate proposal was bad');
				}
				all_good = all_good & one_good;
			}
			if (all_good) {
				console.log('Successfully sent Proposal and received ProposalResponse:',
					proposalResponses[0].response.status, proposalResponses[0].response.message,
					proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature);
				//building the request to send the obtained proposal from peers to the orderer
				var request = {
					proposalResponses: proposalResponses,
					proposal: proposal
				};
				var deployId = tx_id.getTransactionID();
				//registers for the event to the peer0 for confirming whether the transaction is successfully committed or not
				eh = client.newEventHub();
				let data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer0." + orgPath + ".example.com/tls/ca.crt");
				eh.setPeerAddr(peers[0].eventurl, {
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': 'peer0.' + orgPath + '.example.com'
				});
				eh.connect();
				let txPromise = new Promise((resolve, reject) => {
					let handle = setTimeout(() => {
						eh.disconnect();
						reject();
					}, 30000);

					eh.registerTxEvent(deployId, (tx, code) => {
						console.log('The chaincode instantiate transaction has been committed on peer ', eh._ep._endpoint.addr);
						clearTimeout(handle);
						eh.unregisterTxEvent(deployId);
						eh.disconnect();
						if (code !== 'VALID') {
							console.log('The chaincode instantiate transaction was invalid, code = ', code);
							reject();
						} else {
							console.log('The chaincode instantiate transaction was valid.');
							resolve();
						}
					});
				});
				//sends the obtained respose from peers to orderer for ordering
				var sendPromise = channel.sendTransaction(request);
				return Promise.all([sendPromise].concat([txPromise])).then((results) => {
					console.log('Event promise all complete and testing complete');
					return results[0];
				}).catch((err) => {
					console.log('Failed to send instantiate transaction and get notifications within the timeout period: ', err);
					return 'Failed to send instantiate transaction and get notifications within the timeout period.';
				});
			} else {
				console.log('Failed to send instantiate Proposal or receive valid response. Response null or status is not 200. exiting...');
			}
		}, (err) => {
			console.log('Failed to send instantiate proposal due to error: ', err);
		}).then((response) => {
			//gets the response from the orderer and verifies the response status
			if (response.status === 'SUCCESS') {
				console.log('Successfully sent transaction to the orderer.');
				resolve("Successful")
			} else {
				console.log('Failed to order the transaction. Error code: ', response);
				reject("Unsuccessful")
			}
		}, (err) => {
			console.log('Failed to send instantiate due to error: ', err);
			reject("Unsuccessful")
		});
	})
}


function installchaincode(peers, orgPath, orgmspid, chaincodepath, chaincodeid, chaincodeversion) {
	return new Promise(function (resolve, reject) {

		var targets = [];
		for (var i = 0; i < peers.length; i++) {
			let peer = peers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
				}
			);
			targets.push(peer_obj);
		}
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + orgmspid
		}).then((store) => {
			console.log("\nRegistering " + orgPath + " admin")
			client.setStateStore(store);
			return getAdmin(client, orgPath, orgmspid)
		}).then((admin) => {
			console.log('\nSuccessfully enrolled ' + orgPath + ' \'admin\'');
			// send proposal to endorser
			console.log("\nBuilding the request object")
			//building the request for installing chaincode on the peers
			//specify chaincode path, chaincode id, chaincode version and peers you want to install chaincode
			var request = {
				targets: targets,
				chaincodePath: chaincodepath,
				chaincodeId: chaincodeid,
				chaincodeVersion: chaincodeversion
			};
			console.log("\nSending the install chaincode request to peers\n")
			//sends the request to the peers
			return client.installChaincode(request);
		}, (err) => {
			console.log('Failed to enroll user \'admin\'. ' + err);
		}).then((results) => {
			//gets response of peers and check the response status
			var proposalResponses = results[0];
			var proposal = results[1];
			var all_good = true;
			var errors = [];
			for (var i in proposalResponses) {
				let one_good = false;
				if (proposalResponses && proposalResponses[i].response && proposalResponses[i].response.status === 200) {
					one_good = true;
				} else {
					one_good = false;
				}
				all_good = all_good & one_good;
			}
			if (all_good) {
				console.log('\nSuccessfully sent install Proposal and received ProposalResponse: Status 200');
				resolve("Successfull installation of chaincode")
			}
		},
			(err) => {
				console.log('Failed to send install proposal due to error: ', err)
				reject("Unsuccessfull installation of chaincode")
			});
	})
}


function getChannelConfig() {

	var signatures = [];
	var channel = client.newChannel(channel_name);
	channel.addOrderer(orderer)
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + 'orderer'
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		//return getSubmitter(client, true, 'org1',org1);
		return getOrdererAdmin(client);
	}).then((admin) => {
		console.log('\nSuccessfully enrolled orderer');
		tx_id = client.newTransactionID();
		let request = {
			txId: tx_id
		};
		return channel.getChannelConfig();
	}).then((envelope) => {
		console.log("\n", envelope)
	});
	//var config  = envelope.getConfig().toBuffer()
	/*let envelope_bytes = fs.readFileSync('/network-setup/channel-artifacts/newgenesis.block');
	config = client.extractChannelConfig(envelope_bytes);
	console.log("\n",config)
	//config = client.extractChannelConfig(env);
	//console.log("\n",envelope.config.channel_group.groups.map.Consortiums.value.groups)
	var signature = client.signChannelConfig(config);
	var string_signature = signature.toBuffer().toString('hex');
	signatures.push(string_signature);
	signatures.push(string_signature);
	let tx_id = client.newTransactionID();
	var request = {
	config: config,
	signatures : signatures,
	name : "testchainid",
	orderer : orderer,
	txId  : tx_id
	};
	// send create request to orderer
	return client.updateChannel(request);
	}).then((result) => {
	console.log('\ncompleted the update channel request');
	console.log('\nresponse: ',result);
	console.log('\nSuccessfully updated the channel.');
	if(result.status && result.status === 'SUCCESS') {
	console.log('\nSuccessfully updated the channel...SUCCESS 200');
	} else {
	console.log('\nFailed to updated the channel. ');
	}
	}, (err) => {
	console.log('\nFailed to updated the channel: ' , err);
	}).then((nothing) => {
	console.log('\nSuccessfully waited to make sure new channel was updated.');
	}, (err) => {
	console.log('\nFailed to sleep due to error: ', err);
	});*/

}


function addOrganizationtoChannel(orgPath, orgName) {

	var signatures = [];
	var channel = client.newChannel(channel_name);
	channel.addOrderer(orderer)
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + 'orderer'
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		//return getSubmitter(client, true, orgPath,orgName);
		return getOrdererAdmin(client);
	}).then((admin) => {
		let config = fs.readFileSync('../channel-artifacts/config_update.pb');
		//config = client.extractChannelConfig(envelope_bytes);
		var signature = client.signChannelConfig(config);
		var string_signature = signature.toBuffer().toString('hex');
		signatures.push(string_signature);
		signatures.push(string_signature);
		let tx_id = client.newTransactionID();
		var request = {
			config: config,
			signatures: signatures,
			name: "testchainid",
			orderer: orderer,
			txId: tx_id
		};
		// send create request to orderer
		return client.updateChannel(request);
	}).then((result) => {
		console.log('\ncompleted the update channel request');
		console.log('\nresponse: ', result);
		console.log('\nSuccessfully updated the channel.');
		if (result.status && result.status === 'SUCCESS') {
			console.log('\nSuccessfully updated the channel...SUCCESS 200');
		} else {
			console.log('\nFailed to updated the channel. ');
		}
	}, (err) => {
		console.log('\nFailed to updated the channel: ', err);
	}).then((nothing) => {
		console.log('\nSuccessfully waited to make sure new channel was updated.');
	}, (err) => {
		console.log('\nFailed to sleep due to error: ', err);
	});
}

function getGenesisBlock(orgName, orgPath) {

	var channel = client.newChannel(channel_name);
	channel.addOrderer(orderer)
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + orgName
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		return getSubmitter(client, true, orgPath, orgName);
	}).then((admin) => {
		console.log('\nSuccessfully enrolled ' + orgPath + ' \'admin\'');
		tx_id = client.newTransactionID();
		let request = {
			txId: tx_id
		};
		console.log('\Getting the genesis block from orderer');
		return channel.getGenesisBlock(request);
	}).then((block) => {
		console.log("\n", block)
		buf = new Buffer(block)
		console.log("\n", buf)

	})
}

function getChannelInfo() {

	data = fs.readFileSync("../crypto-config/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/msp/tlscacerts/tlsca.org2.example.com-cert.pem");
	var channel = client.newChannel(channel_name);
	var peer = client.newPeer(
		"grpcs://192.168.99.100:10051",
		{
			pem: Buffer.from(data).toString(),
			'ssl-target-name-override': "peer1.org2.example.com"
		}
	);
	Client.newDefaultKeyValueStore({
		path: "./hfc-test-kvs/" + org2
	}).then((store) => {
		console.log("\nRegistering orderer admin")
		client.setStateStore(store);
		return getSubmitter(client, true, "org2", org2)
	}).then((admin) => {
		console.log('\nSuccessfully enrolled org1 \'admin\'');
		console.log('\Getting the channel info block from orderer');
		return channel.queryInfo(peer)
	}).then((info) => {
		console.log('\Channel info: ', info);
	});
}

function createChannel(channel_name, mspid, dir) {
	return new Promise(function (resolve, reject) {

		//return instance of the KeyValueStore which is used to store to save sensitive information such as authenticated user's private keys, certificates, etc.
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + mspid
		}).then((store) => {
			console.log("\nCreate a storage for " + dir + "certs");
			//sets a state store to persist application states so that heavy-weight objects such as the certificate and private keys do not have to be passed in repeatedly
			client.setStateStore(store);
			console.log("\nEnrolling Admin for " + dir);
			//returns a user object with signing identities based on the private key and the corresponding x509 certificate.
			return getAdmin(client, dir, mspid);
		}).then((admin) => {
			console.log('\nSuccessfully enrolled admin for ' + dir.capitalize());
			console.log('\nread the ' + dir.capitalize() + 'Orderer.tx file for signing');
			//read the channel.tx file
			let envelope_bytes = fs.readFileSync('../channel-artifacts/' + dir.capitalize() + 'Orderer.tx');

			//the channel.tx file is of type ConfigEnvelope which contains two fields(i.e config and last envelope)
			//extracts the config field from ConfigEnvelope
			config = client.extractChannelConfig(envelope_bytes);
			console.log('\nSigning the channel config');
			//signs the config object
			var signature = client.signChannelConfig(config);
			//encodes the signature in buffer to hex 
			var string_signature = signature.toBuffer().toString('hex');
			//adds to the signature array defined above
			signatures.push(string_signature);
			signatures.push(string_signature);
			//generates transaction id
			let tx_id = client.newTransactionID();
			// builds the create channel request
			var request = {
				config: config,
				signatures: signatures,
				name: channel_name,
				orderer: orderer,
				txId: tx_id
			};
			// send create request to orderer
			return client.createChannel(request);
		}).then((result) => {
			//gets the response from the orderer and check for the status
			console.log('\ncompleted the create channel request');
			console.log('\nresponse: ', result);
			console.log('\nSuccessfully created the channel.');
			if (result.status && result.status === 'SUCCESS') {
				console.log('\nSuccessfully created the channel...SUCCESS 200');
				resolve("\nSuccessfully created the channel...SUCCESS 200")
			} else {
				console.log('\nFailed to create the channel. ');
				reject("\nFailed to create the channel. ")
			}
		}, (err) => {
			console.log('\nFailed to create the channel: ', err);
			reject("\nFailed to create the channel. " + err)
		}).then((nothing) => {
			console.log('\nSuccessfully waited to make sure new channel was created.');
		}, (err) => {
			console.log('\nFailed to sleep due to error: ', err);
		}).catch(() => { console.log("Error channel create") })
	})

}



function joinChannel(mspID, orgPath, peers, channel_name) {
	return new Promise(function (resolve, reject) {
		//gets the channel object from the client object that we created globally
		var channel = null
		var client = null
		client = new Client();
		channel = client.newChannel(channel_name);
		//sets the orderer to the channel
		channel.addOrderer(orderer)
		var targets = [];
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + mspID
		}).then((store) => {
			console.log("\nRegistering " + orgPath + " admin")
			client.setStateStore(store);
			return getAdmin(client, orgPath, mspID);
		}).then((admin) => {
			console.log('\nSuccessfully enrolled ' + orgPath + ' \'admin\'');
			tx_id = client.newTransactionID();
			//build a request object for getting the genesis block for the channel from ordering service
			let request = {
				txId: tx_id
			};
			console.log('\nGetting the genesis block from orderer');
			//request genesis block from ordering service
			return channel.getGenesisBlock(request);
		}).then((block) => {
			//gets the geneis block
			console.log('\nSuccessfully got the genesis block');
			genesis_block = block;
			console.log('\nEnrolling ' + orgPath + 'admin');
			return getAdmin(client, orgPath, mspID);
		}).then((admin) => {
			console.log('\nSuccessfully enrolled org:' + mspID + ' \'admin\'');
			//client.newPeer returns a peer object initialized with URL and its tls certificates and stores in a array named target
			//admin of org can choose which peers to join the channel
			for (var i = 0; i < peers.length; i++) {

				let peer = peers[i];
				data = fs.readFileSync("../crypto-config/peerOrganizations/" + orgPath + ".example.com/peers/peer" + i + "." + orgPath + ".example.com/msp/tlscacerts/tlsca." + orgPath + ".example.com-cert.pem");
				targets.push(client.newPeer(
					peer.url,
					{
						pem: Buffer.from(data).toString(),
						'ssl-target-name-override': "peer" + i + "." + orgPath + ".example.com"
					}
				)
				);
			}
			tx_id = client.newTransactionID();
			//builds the join channel request with genesis block and peers(targets)
			let request = {
				targets: targets,
				block: genesis_block,
				txId: tx_id
			};
			//request specified peers to join the channel
			return channel.joinChannel(request);
		}, (err) => {
			console.log('Failed to enroll user admin due to error: ' + err);
			reject('Failed to enroll user admin due to error: ' + err)
		}).then((results) => {
			//gets the response from the peers and check response status
			console.log('\nResponse of one peer: ', results[0]);
			if (results[0] && results[0].response && results[0].response.status == 200) {
				console.log('\nPeers successfully joined the channel');
				resolve("\nPeers successfully joined the channel");
			} else {
				console.log(' Failed to join channel');
				reject(' Failed to join channel')
			}
		}).catch(
			(err) => { console.log("Error channel join" + err); reject(' Failed to join channel due to error') },
		)
	}
	)
}



function getAdmin(client, userOrg, mspID) {

	var keyPath = '../crypto-config/peerOrganizations/' + userOrg + '.example.com/users/Admin@' + userOrg + '.example.com/msp/keystore';
	var keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
	var certPath = '../crypto-config/peerOrganizations/' + userOrg + '.example.com/users/Admin@' + userOrg + '.example.com/msp/signcerts';
	var certPEM = readAllFiles(certPath)[0];
	return Promise.resolve(client.createUser({
		username: 'peer' + userOrg + 'Admin',
		mspid: mspID,
		cryptoContent: {
			privateKeyPEM: keyPEM.toString(),
			signedCertPEM: certPEM.toString()
		}
	}));

}

function readAllFiles(dir) {
	var files = fs.readdirSync(dir);
	var certs = [];
	files.forEach((file_name) => {
		let file_path = path.join(dir, file_name);
		let data = fs.readFileSync(file_path);
		certs.push(data);
	});
	return certs;
}
function buildChaincodeProposal(client, chaincode_path, first_mspid, second_mspid, version, chaincodeID) {
	var tx_id = client.newTransactionID();

	// build instantiate proposal to send for endorsement
	//specify the function name , arguments , endorsement-policy etc
	var request = {
		chaincodePath: chaincode_path,
		chaincodeId: chaincodeID,
		chaincodeVersion: version,
		fcn: '',
		args: [],
		txId: tx_id,
		// use this to demonstrate the following policy:
		// 'if signed by org1 admin, then that's the only signature required,
		// but if that signature is missing, then the policy can also be fulfilled
		// when members (non-admin) from both orgs signed'
		'endorsement-policy': {
			identities: [
				{ role: { name: 'member', mspId: first_mspid } },
				{ role: { name: 'member', mspId: second_mspid } },
				{ role: { name: 'admin', mspId: first_mspid } },
				{ role: { name: 'admin', mspId: second_mspid } }
			],
			policy: {
				'1-of': [
					// { 'signed-by': 2 },
					{ '2-of': [{ 'signed-by': 0 }, { 'signed-by': 1 }] },
					{ '2-of': [{ 'signed-by': 2 }, { 'signed-by': 3 }] }
				]
			}
		}
	};

	return request;

}