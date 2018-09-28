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
  
	  callback(null, './uploads')
  
	},
  
	filename: function(req, file, callback) {
  
	  console.log("File details,",file)
  
	  callback(null,file.originalname)
  
	}
  
  });
  
  var upload = multer({storage: storage})



//globally define channelid and MSP id of each org
var org1mspid = "Org1MSP";
var org2mspid = "Org2MSP";
var org3mspid = "OrdererOrgMSP";
var genesis_block = null;
var config = null;
var signatures = [];
var chaincode_name = "os199";
//peers endpoints of org1 and org2
//event url is used for registering for events on the peer, 
//during the committing phase peer will generate an event informing whether the transaction successfully passed the endorsement policy or not


/*
../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID chan
docker rm -f $(docker ps -aq)
docker network prune
docker-compose -f docker-compose-e2e-template.yaml up -d
// */
// //Mongodb Schemas and Models
// var userSchema = mongoose.Schema({
// 	userName: String,
// 	password: String
// });
// var userModel = mongoose.model('User', userSchema);

// var panSchema = mongoose.Schema({
// 	pan_number: {
//         type:String,
//         required: true,
//         unique: true
//     },
// 	name: String,
// 	gender: {
//         type:String,
//         required: true,
//     },
// 	dob: {
//         type:String,
//         required: true,
//     }
// });
// var panModel = mongoose.model('Pan', panSchema);

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

function network_setup26AS() {
	return new Promise((resolve, reject) => {
		console.log("*****************************---------------------------- Starting network setup *****************************----------------------------")

		createChannel('all', org1mspid, 'org1').then(() => {
			console.log("All channel created!!");
			return sleep(5000);

		}, (err) => {
			console.log("Error creating all channel!!")

		}).then(() => {
			return joinChannel(org1mspid, 'org1', org1peersurl, 'all').then(() => {
				return sleep(5000);
			}, (err) => {
				console.log("Error joining Org1 to all channel!!" + err)
			})
		}).then(() => {
			return joinChannel(org2mspid, 'org2', org2peersurl, 'all').then(() => {
				return sleep(5000);
			}, (err) => {
				console.log("Error joining Org2 to all channel" + err)
			});
		}, (err) => {
			console.log("Error joining Org1 to all channel!!" + err)

		}).then(() => {
			return joinChannel(org3mspid, 'orderer', org3peersurl, 'all').then(() => {
				return sleep(5000);
			}, (err) => {
				console.log("Error joining Orderer to all channel" + err)
			});
		}, (err) => {
			console.log("Error joining Orderer to all channel!!" + err)

		})
			.then(() => {
				console.log("*****************************---------------------------- Done *****************************----------------------------\n\n\n\n")
			})
	})
}
function setup_chaincode() {
	return new Promise((resolve, reject) => {
		console.log("*****************************---------------------------- Starting Chaincode setup *****************************----------------------------")

		installchaincode(org1peersurl, 'org1', org1mspid, "chain", chaincode_name, "v0").then(() => {
			console.log("Chaincode installed on org1!!");
			return sleep(5000);

		}, (err) => {
			console.log("Error installing chaincode on org1!!")

		}).then(() => {
			console.log("Installing Chaincode on org2!!");
			return installchaincode(org2peersurl, 'org2', org2mspid, "chain", chaincode_name, "v0").then(() => {
				console.log("Chaincode installed on org2!!");
				return sleep(5000);
			}, (err) => {
				console.log("Error installing chaincode on org2!!" + err)
			})
		}).then(() => {
			console.log("Installing Chaincode on orderer!!");
			return installchaincode(org3peersurl, 'orderer', org3mspid, "chain", chaincode_name, "v0").then(() => {
				console.log("Chaincode installed on orderer!!");
				return sleep(5000);
			}, (err) => {
				console.log("Error installing chaincode on orderer" + err)
			});
		}, (err) => {
			console.log("Error installing chaincode on orderer!!" + err)

		})
			.then(() => {
				return instantiateChaincode('all', org1peersurl, 'org1', org1mspid, org2peersurl, 'org2', org2mspid, org3peersurl, 'orderer', org3mspid, "chain", chaincode_name, "v0").then(() => {
					console.log("Chaincode instantiated on org1!!");
					return sleep(5000);
				}, (err) => {
					console.log("Error instantiating chaincode on org1!!" + err)
				})
			}).then(() => {
				console.log("Successfully instantiated")
			})

	})
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

// network_setup().then(()=>{
// 	console.log("Network setup done")
// })
//  setup_chaincode().then(()=>{console.log("cc done")})
//  create_panstore().then((str)=> {console.log(str);return sleep(5000);}).then(()=> {return create_userstore().then()},(err)=> {console.log("Error: "+err)}).
//  then(()=> {console.log("Finished setting up userstore and panstore!! ")},(err)=> {console.log("Error: "+err);})

setup_db_blockchain()

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
getInstantiatedChaincodes(org1peersurl,org1mspid,'org1')





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

function querychaincode(channel_name, aorgName, aorgPath, apeers, borgName, borgPath, bpeers, zorgName, zorgPath, zpeers, funct, argument, chaincodeID) {

	return new Promise(function (resolve, reject) {
		var targets = [];
		var str;
		var client = new Client();
		var channel = client.newChannel(channel_name);
		channel.addOrderer(orderer)
		for (var i = 0; i < apeers.length; i++) {
			let peer = apeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + aorgPath + ".example.com/peers/peer" + i + "." + aorgPath + ".example.com/msp/tlscacerts/tlsca." + aorgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + aorgPath + ".example.com"
				}
			);
			targets.push(peer_obj)
			channel.addPeer(peer_obj);
		}
		for (var i = 0; i < bpeers.length; i++) {
			let peer = bpeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + borgPath + ".example.com/peers/peer" + i + "." + borgPath + ".example.com/msp/tlscacerts/tlsca." + borgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + borgPath + ".example.com"
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
			path: "./hfc-test-kvs/" + aorgName
		}).then((store) => {

			client.setStateStore(store);
			return getAdmin(client, aorgPath, aorgName);
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

function invokechaincode(channel_name, aorgName, aorgPath, apeers, borgName, borgPath, bpeers, zorgName, zorgPath, zpeers, funct, argument, chaincodeId) {

	return new Promise((resolve, reject) => {
		var targets = [];
		var client = new Client();
		var channel = client.newChannel(channel_name);
		channel.addOrderer(orderer)
		for (var i = 0; i < apeers.length; i++) {
			let peer = apeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + aorgPath + ".example.com/peers/peer" + i + "." + aorgPath + ".example.com/msp/tlscacerts/tlsca." + aorgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + aorgPath + ".example.com"
				}
			);
			targets.push(peer_obj);
			channel.addPeer(peer_obj);
		}
		for (var i = 0; i < bpeers.length; i++) {
			let peer = bpeers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + borgPath + ".example.com/peers/peer" + i + "." + borgPath + ".example.com/msp/tlscacerts/tlsca." + borgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + borgPath + ".example.com"
				}
			);
			targets.push(peer_obj);
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
			targets.push(peer_obj);
			channel.addPeer(peer_obj);
		}
		Client.newDefaultKeyValueStore({
			path: "./hfc-test-kvs/" + aorgName
		}).then((store) => {
			client.setStateStore(store);
			return getAdmin(client, aorgPath, aorgName);
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
				let data = fs.readFileSync("../crypto-config/peerOrganizations/" + aorgPath + ".example.com/peers/peer0." + aorgPath + ".example.com/tls/ca.crt");
				eh.setPeerAddr(apeers[0].eventurl, {
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': 'peer0.' + aorgPath + '.example.com'
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
			console.log("Response after invoke is",response)
			if (response.status === 'SUCCESS') {
				console.log('Successfully sent transaction to the orderer.');
				//resolve("Successful")
				return new Promise((resolve,reject)=>{
					resolve("Success")
				})
			} else {
				console.log('Failed to order the transaction. Error code: ', err);
				//reject("Failed")
				return new Promise((resolve,reject)=>{
					resolve("Fail")
				})
			}
		}, (err) => {

			console.log('Failed to send transaction due to error: ', err);
			reject("Failed")
		}).then((resp) => {
			//tx_id = client.newTransactionID();

			// build query request
			var request = {
				chaincodeId: chaincodeId,
				txId: tx_id,
				fcn: funct,
				args: argument
			};
			//send query request to peers
			if (resp == "Success"){
				return channel.queryByChaincode(request, targets);
			} else {
				return new Promise((resolve,reject)=>{
					reject("Fail")
				})
			}
		}, (err) => {

			console.log('Failed to initialize the channel: ', err);

		}).then((response_payloads) => {
			//gets response from each peer and check for status
			if(response_payloads == "Fail") {
				reject("Failed Transaction")
			}
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

function instantiateChaincode(channel_name, peers, orgPath, orgName, second_peers, second_orgPath, second_orgName, third_peers, third_orgPath, third_orgName, chaincodePath, chaincodeID, chaincodeVersion) {

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
		//return peers object of org2 
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

		//return peers object of org3 
		for (var i = 0; i < third_peers.length; i++) {
			let peer = third_peers[i];
			data = fs.readFileSync("../crypto-config/peerOrganizations/" + third_orgPath + ".example.com/peers/peer" + i + "." + third_orgPath + ".example.com/msp/tlscacerts/tlsca." + third_orgPath + ".example.com-cert.pem");
			let peer_obj = client.newPeer(
				peer.url,
				{
					pem: Buffer.from(data).toString(),
					'ssl-target-name-override': "peer" + i + "." + third_orgPath + ".example.com"
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
			console.log('\nread the AllOrg.tx file for signing');
			//read the channel.tx file
			let envelope_bytes = fs.readFileSync('../channel-artifacts/AllOrg.tx');

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


module.exports.invokechaincode = invokechaincode;  
module.exports.querychaincode = querychaincode;  
module.exports.chaincode_name = chaincode_name;