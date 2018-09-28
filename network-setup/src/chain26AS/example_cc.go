package main

import (
"bytes"
b64 "encoding/base64"
"encoding/json"
"fmt"
"strconv"
"strings"
"time"

"github.com/hyperledger/fabric/core/chaincode/lib/cid"
"github.com/hyperledger/fabric/core/chaincode/shim"
pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("example_cc0")

// SimpleChaincode example simple Chaincode implementation

type SimpleChaincode struct {
}

type PAN_DET struct {
STATUS string
TXID   string
PAN    string
HASH   string
DATE   string
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

logger.Info("########### example_cc0 Init ###########")

return shim.Success(nil)

}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {

logger.Info("########### example_cc0 Invoke ###########")

function, args := stub.GetFunctionAndParameters()

if function == "init" {
//Calls Init function
return t.Init(stub)
}

if function == "STORE_26AS" {

// Calls UPDATE_15G function
return t.STORE_26AS(stub, args)
}

if function == "MATCH_26AS" {
// Calls GET_TOTAL_AMOUNT function
return t.MATCH_26AS(stub, args)

}

if function == "QUERY_26AS" {
// Calls GET_TOTAL_AMOUNT function
return t.QUERY_26AS(stub, args)

}
if function == "GET_HISTORY_PAN_26AS" {
// Calls GET_TOTAL_AMOUNT function
return t.GET_HISTORY_PAN_26AS(stub, args)
}

logger.Errorf("Unknown action, check the first argument, must be one of 'STORE_26AS','MATCH_26AS', 'QUERY_26AS' . But got: %v", args[0])

return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'STORE_26AS','MATCH_26AS', 'QUERY_26AS' . But got: %v", args[0]))

}

func (t *SimpleChaincode) STORE_26AS(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var err error
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)
if owner != "Admin@orderer.example.com" {
shim.Error("The particular Org doesnt have access to the function")
}
var PN string
var HSH string
PN = args[0]
HSH = args[1]
QUERIED_HASH, err := stub.GetState(PN)
var pndt []PAN_DET
timestamp, err := stub.GetTxTimestamp()
TID := stub.GetTxID()
timeUnix := time.Unix(int64(timestamp.Seconds), int64(timestamp.Nanos)).Format("02-01-2006")
fmt.Println("timeUnix", timeUnix)
obj := PAN_DET{STATUS: "Successfuly Stored Hash in Chaincode", TXID: TID, PAN: PN, HASH: HSH, DATE: timeUnix}
pndt = append(pndt, obj)

// pndt = append(pndt, obj)
// m_obj, _ := json.Marshal()

if err != nil {
fmt.Println("Error getting state.")
}
fmt.Println("ENTERED PAN: " + PN + "QUERIED HASH: " + string(QUERIED_HASH) + "ENTERED HASH: " + HSH)

if QUERIED_HASH == nil {
json_pndt, _ := json.Marshal(pndt)

err = stub.PutState(PN, []byte(json_pndt))
if err == nil {
return shim.Success([]byte("Successfully stored hash"))
} else {
return shim.Success([]byte("Some Error"))
}

} else {
var pndt []PAN_DET
err := json.Unmarshal(QUERIED_HASH, &pndt)

if err != nil {
fmt.Println("Error Unmarshalling:", err)
}

var count int = 0
for i := 0; i < len(pndt); i++ {
	if pndt[i].DATE == obj.DATE {
	pndt[i].TXID = obj.TXID
	pndt[i].HASH = obj.HASH
	pndt[i].DATE = obj.DATE
	count += 1
	}
}

if count == 0 {
	pndt = append(pndt, obj)
}

n_obj, _ := json.Marshal(pndt)

err = stub.PutState(PN, []byte(n_obj))

if err == nil {
return shim.Success([]byte("Successfully stored hash"))
} else {
return shim.Success([]byte("Some Error"))
}
}

return shim.Success(nil)
}

func (t *SimpleChaincode) QUERY_26AS(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var err error
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)
if owner != "Admin@orderer.example.com" {
shim.Error("The particular Org doesnt have access to the function")
}
var PAN string
PAN = args[0]
QUERIED_HASH, err := stub.GetState(PAN)
if err != nil {
fmt.Println("Error getting state.")
}

return shim.Success([]byte(QUERIED_HASH))
}

//get the user id from the certificate

func getCommonName(stub shim.ChaincodeStubInterface) (string, error) {

id, err := cid.GetID(stub)

if err != nil {

return "", err

}

sDec, err := b64.StdEncoding.DecodeString(id)

if err != nil {

return "", err

}

temp := strings.Split(string(sDec), "::")

subject := strings.Split(temp[1], ",")

cn := strings.TrimSpace(strings.Replace(subject[0], "CN=", "", -1))

return cn, nil

}

func (t *SimpleChaincode) GET_HISTORY_PAN_26AS(stub shim.ChaincodeStubInterface, args []string) pb.Response {

if len(args) < 1 {
return shim.Error("Incorrect number of arguments. Expecting 1")
}

pan := args[0]

fmt.Printf("- start getHistoryForPan: %s\n", pan)

resultsIterator, err := stub.GetHistoryForKey(pan)
if err != nil {
return shim.Error(err.Error())
}
defer resultsIterator.Close()

// buffer is a JSON array containing historic values for the marble
var buffer bytes.Buffer
buffer.WriteString("[")

bArrayMemberAlreadyWritten := false
for resultsIterator.HasNext() {
response, err := resultsIterator.Next()
if err != nil {
return shim.Error(err.Error())
}
// Add a comma before array members, suppress it for the first array member
if bArrayMemberAlreadyWritten == true {
buffer.WriteString(",")
}
buffer.WriteString("{\"TxId\":")
buffer.WriteString("\"")
buffer.WriteString(response.TxId)
buffer.WriteString("\"")

buffer.WriteString(", \"Value\":")
// if it was a delete operation on given key, then we need to set the
//corresponding value null. Else, we will write the response.Value
//as-is (as the Value itself a JSON marble)
if response.IsDelete {
buffer.WriteString("null")
} else {
buffer.WriteString(string(response.Value))
}

buffer.WriteString(", \"Timestamp\":")
buffer.WriteString("\"")
buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
buffer.WriteString("\"")

buffer.WriteString(", \"IsDelete\":")
buffer.WriteString("\"")
buffer.WriteString(strconv.FormatBool(response.IsDelete))
buffer.WriteString("\"")

buffer.WriteString("}")
bArrayMemberAlreadyWritten = true
}
buffer.WriteString("]")

fmt.Printf("- getHistoryForPAN returning:\n%s\n", buffer.String())

return shim.Success(buffer.Bytes())
}

func (t *SimpleChaincode) MATCH_26AS(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var PN string
var HSH string
PN = args[0]
HSH = args[1]
var err error
QUERIED_HASH, err := stub.GetState(PN)
var pndt []PAN_DET
err = json.Unmarshal(QUERIED_HASH, &pndt)
if err != nil {
fmt.Println("Error Unmarshalling:", err)
}

fmt.Println("ENTERED PAN: " + PN + "QUERIED HASH: " + string(QUERIED_HASH) + "ENTERED HASH: " + HSH)
if err != nil {
fmt.Println("Error getting state.")
}

if pndt[len(pndt)-1].PAN == PN && pndt[len(pndt)-1].HASH == HSH {
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)
pndt[len(pndt)-1].STATUS = "Succesfully Matched Document By " + owner
jsonStr, _ := json.Marshal(pndt)
err = stub.PutState(PN, []byte(jsonStr))
if err == nil {
return shim.Success([]byte("Successful"))
} else {
return shim.Success([]byte("Some Error"))
}
} else {
return shim.Success([]byte("Failure"))
}

}

func main() {
err := shim.Start(new(SimpleChaincode))

if err != nil {
logger.Errorf("Error starting Simple chaincode: %s", err)
}

}
