package main

import (
"bytes"
b64 "encoding/base64"
"encoding/json"
"fmt"
"reflect"
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
STATUS             string `json:"STATUS"`
TXID               string `json:"TXID"`
CERT_ID            string `json:"CERT_ID"`
PAN                string `json:"PAN"`
AMOUNT             string `json:"AMOUNT"`
PERCENT            string `json:"PERCENT"`
TAN                string `json:"TAN"`
SECTION            string `json:"SECTION"`
YEAR               string `json:"YEAR"`
MODIFIED_BY        string `json:MODIFIED_BY`
MODIFIED_ON        string `json:MODIFIED_ON`
CHILD_CERTIFICATES map[string]PAN_DET_CHILD
}

type PAN_DET_CHILD struct {
CERT_ID     string `json:"CERT_ID"`
STATUS      string `json:"STATUS"`
AMOUNT      string `json:"AMOUNT"`
PERCENT     string `json:"PERCENT"`
TAN         string `json:"TAN"`
SECTION     string `json:"SECTION"`
YEAR        string `json:"YEAR"`
MODIFIED_BY string `json:"MODIFIED_BY"`
MODIFIED_ON string `json:"MODIFIED_ON"`
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

if function == "STORE_PARENT_197" {

// Calls UPDATE_15G function
return t.STORE_PARENT_197(stub, args)
}
if function == "STORE_CHILD_197" {

// Calls UPDATE_15G function
return t.STORE_CHILD_197(stub, args)
}

if function == "QUERY_197" {
// Calls GET_TOTAL_AMOUNT function
return t.QUERY_197(stub, args)

}
if function == "GET_HISTORY_PAN_197" {
// Calls GET_TOTAL_AMOUNT function
return t.GET_HISTORY_PAN_197(stub, args)
}

logger.Errorf("Unknown action, check the first argument, must be one of 'STORE_197','MATCH_197', 'QUERY_197' . But got: %v", args[0])

return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'STORE_197','MATCH_197', 'QUERY_197' . But got: %v", args[0]))

}

func (t *SimpleChaincode) STORE_PARENT_197(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var err error
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)
if owner != "Admin@orderer.example.com" {
shim.Error("The particular Org doesnt have access to the function")
}

var PN string
var AMNT string
var PRCNT string
var TN string
var SCTN string
var CRT_ID string
var CHILD_CERT map[string]PAN_DET_CHILD

CRT_ID = args[0]
STUS := args[1]
PN = args[2]
AMNT = args[3]
PRCNT = args[4]
TN = args[5]
SCTN = args[6]
M_BY := args[7]
M_ON := args[8]

timestamp, err := stub.GetTxTimestamp()
TID := stub.GetTxID()
timeUnix := time.Unix(int64(timestamp.Seconds), int64(timestamp.Nanos)).Format("2006")
fmt.Println("timeUnix", timeUnix)
obj := PAN_DET{STATUS: STUS, CERT_ID: CRT_ID, TXID: TID, PAN: PN, AMOUNT: AMNT, PERCENT: PRCNT, TAN: TN, SECTION: SCTN, YEAR: timeUnix, MODIFIED_BY: M_BY, MODIFIED_ON: M_ON, CHILD_CERTIFICATES: CHILD_CERT}
json_obj, _ := json.Marshal(obj)
err = stub.PutState(obj.PAN+"-"+obj.TAN+"-"+obj.YEAR+"-"+obj.SECTION, []byte(json_obj))
err = stub.PutState("MAIN-"+obj.CERT_ID, []byte(json_obj))
if err == nil {
return shim.Success([]byte("Successfully stored Document Details"))
} else {
return shim.Success([]byte("Some Error"))
}

return shim.Success(nil)
}

func (t *SimpleChaincode) STORE_CHILD_197(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var err error
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)

var MAIN_CERT PAN_DET
PN := args[0]
TN := args[1]
STS := args[2]
SCTN := args[3]
M_BY := args[4]
M_ON := args[5]
CHLD_CRT := args[6] //contains the json of child

timestamp, err := stub.GetTxTimestamp()
timeUnix := time.Unix(int64(timestamp.Seconds), int64(timestamp.Nanos)).Format("2006")
fmt.Println("timeUnix", timeUnix)
QUERY, _ := stub.GetState(PN + "-" + TN + "-" + timeUnix + "-" + SCTN)
err = json.Unmarshal([]byte(QUERY), &MAIN_CERT)
var CHILD_MAP map[string]*json.RawMessage
CHILD_CERT := make(map[string]PAN_DET_CHILD)
err := json.Unmarshal([]byte(jsonStr), &CHILD_MAP)
if err != nil {
fmt.Println("err", err)
}
for k, v := range CHILD_MAP {
//fmt.Printf("key[%s] value[%s]\n", k, v)
var CHILD_OBJ PAN_DET_CHILD
err = json.Unmarshal(*v, &CHILD_OBJ)
CHILD_CERT[k] = CHILD_OBJ
}
fmt.Println("CHILD_CERT", CHILD_CERT)
//UPDATE MAIN CERTIFICATE
keys := reflect.ValueOf(CHILD_MAP).MapKeys()
if val, ok := MAIN_CERT.CHILD_CERTIFICATES[keys[0]]; ok {
//do something here
MAIN_CERT.CHILD_CERTIFICATES[keys[0]] = CHILD_CERT
} else {
MAIN_CERT.CHILD_CERTIFICATES[keys[0]] = CHILD_CERT
}

MAIN_CERT.STATUS = STS
MAIN_CERT.MODIFIED_BY = M_BY
MAIN_CERT.MODIFIED_ON = M_ON

json_obj, _ := json.Marshal(MAIN_CERT)
fmt.Println("MAIN_CERT", MAIN_CERT)
fmt.Println("CHLD_CRT", CHLD_CRT)
fmt.Println("CHILD_CERT", CHILD_CERT)
fmt.Println("json_obj", json_obj)
if QUERY == nil {
return shim.Success([]byte("No Main Certificate Attached!"))
} else {
var pan_det_query PAN_DET
json.Unmarshal(QUERY, &pan_det_query)
pan_det_query.CHILD_CERTIFICATES = append(pan_det_query.CHILD_CERTIFICATES, CHILD_CERT...)
json_obj, _ = json.Marshal(pan_det_query)
err = stub.PutState(MAIN_CERT.PAN+"-"+MAIN_CERT.TAN+"-"+MAIN_CERT.YEAR+"-"+MAIN_CERT.SECTION, []byte(json_obj))
err = stub.PutState("CHILD-"+CHILD_CERT.CERT_ID, []byte(json_obj))
}

if err == nil {
return shim.Success([]byte("Successfully stored Document Details"))
} else {
return shim.Success([]byte("Some Error"))
}

return shim.Success(nil)
}

func (t *SimpleChaincode) QUERY_197(stub shim.ChaincodeStubInterface, args []string) pb.Response {
var err error
var owner string

owner, err = getCommonName(stub)
fmt.Printf("\nOwner: " + owner)
if owner != "Admin@orderer.example.com" {
shim.Error("The particular Org doesnt have access to the function")
}

resultsIterator, err := stub.GetStateByRange("", "")
if err != nil {
return shim.Error(err.Error())
}
defer resultsIterator.Close()

// buffer is a JSON array containing QueryResults
var buffer bytes.Buffer
buffer.WriteString("[")

bArrayMemberAlreadyWritten := false
for resultsIterator.HasNext() {
queryResponse, err := resultsIterator.Next()
if err != nil {
return shim.Error(err.Error())
}
// Add a comma before array members, suppress it for the first array member
if bArrayMemberAlreadyWritten == true {
buffer.WriteString(",")
}
buffer.WriteString("{\"Key\":")
buffer.WriteString("\"")
buffer.WriteString(queryResponse.Key)
buffer.WriteString("\"")

buffer.WriteString(", \"Record\":")
// Record is a JSON object, so we write as-is
buffer.WriteString(string(queryResponse.Value))
buffer.WriteString("}")
bArrayMemberAlreadyWritten = true
}
buffer.WriteString("]")

fmt.Printf("- getDetailsByRange queryResult:\n%s\n", buffer.String())

return shim.Success(buffer.Bytes())
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

func (t *SimpleChaincode) GET_HISTORY_PAN_197(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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

func main() {
err := shim.Start(new(SimpleChaincode))

if err != nil {
logger.Errorf("Error starting Simple chaincode: %s", err)
}

}