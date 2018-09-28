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

type AmountByYear struct {
VALID            string
PAN_NUMBER       string
YEAR             int
TOTAL_AMOUNT     float64
INTEREST_AMOUNT  float64
OTHER_AMOUNT     float64
DEDUCTION_AMOUNT float64
GENDER           string
DOB              string
TIMESTAMP        string
}

type Rule struct {
RULE_TYPE           string
RULE_INCOME         string
RULE_YEAR           string
GENDER              string
AMOUNT_GENERAL      string
AMOUNT_SENIOR       string
AMOUNT_SUPER_SENIOR string
AGE_SENIOR          string
AGE_SUPER_SENIOR    string
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

if function == "UPDATE_15G" {

// Calls UPDATE_15G function

return t.UPDATE_15G(stub, args)

}

if function == "UPDATE_RULES_15G" {

// Calls UPDATE_15G function

return t.UPDATE_RULES_15G(stub, args)

}

if function == "QUERY_15G" {

// Calls GET_TOTAL_AMOUNT function

return t.QUERY_15G(stub, args)

}

if function == "QUERY_BY_YEAR_15G" {

// Calls GET_TOTAL_AMOUNT function

return t.QUERY_BY_YEAR_15G(stub, args)

}

if function == "QUERY_ALL_15G" {

// Calls GET_TOTAL_AMOUNT function

return t.QUERY_ALL_15G(stub, args)

}

if function == "QUERY_RULES_15G" {

return t.QUERY_RULES_15G(stub, args)

}

if function == "GET_HISTORY_PAN_15G" {
return t.GET_HISTORY_PAN_15G(stub, args)
}

logger.Errorf("Unknown action, check the first argument, must be one of 'UPDATE_15G',UPDATE_RULES_15G, 'QUERY_15' , 'QUERY_ALL_15G','QUERY_WITHIN_YEAR_15G' or 'QUERY_BY_YEAR_15G'. But got: %v", args[0])

return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'UPDATE_15G',UPDATE_RULES_15G, 'QUERY_15' , 'QUERY_ALL_15G', 'QUERY_WITHIN_YEAR_15G' or 'QUERY_BY_YEAR_15G'. But got: %v", args[0]))

}

func (t *SimpleChaincode) UPDATE_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

// must be an invoke

var PAN string  // Entities
var VALD string // Entities

// var AMOUNT int

var err error

// var START_YEAR int // Entities

// Initialize the chaincode

if len(args) != 9 {

return shim.Error("Incorrect number of arguments. Expecting 9,VALID, PAN,TOTAL_AMOUNT ,INTEREST_AMOUNT,NET_AMOUNT,DEDUCTION_AMOUNT, START_YEAR ,GENDER ,DOB")

}

VALD = args[0]

PAN = args[1]

AMOUNT, err := strconv.ParseFloat(args[2], 64)

INTRST_AMOUNT, err := strconv.ParseFloat(args[3], 64)

OTHR_AMOUNT, err := strconv.ParseFloat(args[4], 64)

DDN_AMOUNT, err := strconv.ParseFloat(args[5], 64)

START_YEAR, err := strconv.Atoi(args[6])

GNDR := args[7]

DB := args[8]

TOTAL_AMOUNT_OBJ, err := stub.GetState(PAN)

if err != nil {

return shim.Error("Failed to get state")

}

var amt []AmountByYear
timestamp, err := stub.GetTxTimestamp()
timestampFormat := time.Unix(int64(timestamp.Seconds), int64(timestamp.Nanos))

obj := AmountByYear{VALID: VALD, PAN_NUMBER: PAN, YEAR: START_YEAR, TOTAL_AMOUNT: AMOUNT, INTEREST_AMOUNT: INTRST_AMOUNT, OTHER_AMOUNT: OTHR_AMOUNT, DEDUCTION_AMOUNT: DDN_AMOUNT, GENDER: GNDR, DOB: DB, TIMESTAMP: timestampFormat.String()}

amt = append(amt, obj)

m_obj, _ := json.Marshal(amt)

if TOTAL_AMOUNT_OBJ == nil {

err = stub.PutState(PAN, []byte(m_obj))

if err != nil {

return shim.Error(err.Error())

}

} else {

var amt []AmountByYear

err := json.Unmarshal(TOTAL_AMOUNT_OBJ, &amt)

if err != nil {

fmt.Println("Error Unmarshalling:", err)

}

var count int = 0

for i := 0; i < len(amt); i++ {
timestamp, err = stub.GetTxTimestamp()
timestampFormat = time.Unix(int64(timestamp.Seconds), int64(timestamp.Nanos))
if amt[i].YEAR == START_YEAR {
amt[i].VALID = VALD
amt[i].TOTAL_AMOUNT = AMOUNT
amt[i].INTEREST_AMOUNT = INTRST_AMOUNT
amt[i].OTHER_AMOUNT = OTHR_AMOUNT
amt[i].DEDUCTION_AMOUNT = DDN_AMOUNT
amt[i].TIMESTAMP = timestampFormat.String()
count += 1

}

}

if count == 0 {

amt = append(amt, obj)

}

n_obj, _ := json.Marshal(amt)

err = stub.PutState(PAN, []byte(n_obj))

if err != nil {

return shim.Error(err.Error())

}

}

fmt.Println("Timestamp" + timestamp.String())

return shim.Success(nil)

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

func (t *SimpleChaincode) QUERY_RULES_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

var x []byte
jsonResp, err := stub.GetState("rules")

if jsonResp == nil {

mp := make(map[string]map[string]string)
var RT []string
var RI []string
var GND []string
var ct int = 0
RT = append(RT, "15G/H", "TDS-Statements", "Challans", "197-Certificate")
RI = append(RI, "INTEREST", "NET", "DEDUCTION")
GND = append(GND, "M", "F", "T")

for i := 0; i < len(RT); i++ {
for j := 0; j < len(RI); j++ {
for k := 0; k < len(GND); k++ {
x, _ := json.Marshal(Rule{RT[i], RI[j], "0", GND[k], "0", "0", "0", "0", "0"})
ct = ct + 1
ct_str := strconv.Itoa(ct)
mp[ct_str] = map[string]string{}
mp[ct_str][RT[i]+"_"+RI[j]+"_0_"+GND[k]] = string(x)

fmt.Println(ct_str)

}
}
}
x, _ = json.Marshal(mp)

} else {

x = jsonResp

}

fmt.Println("Query: " + string(x))

if err != nil {

shim.Error("Error in putting value to ledger")

}

return shim.Success(x)

}

func (t *SimpleChaincode) UPDATE_RULES_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

// must be an invoke

// var AMOUNT int

var err error

var owner string

// var START_YEAR int // Entities

var RULE_TYPE string

var RULE_INCOME string

var RULE_YEAR string

var GENDER string

var AMOUNT_GENERAL string

var AMOUNT_SENIOR string
var AMOUNT_SUPER_SENIOR string
var AGE_SENIOR string
var AGE_SUPER_SENIOR string

// Initialize the chaincode

if len(args) != 9 {

return shim.Error("Incorrect number of arguments. Expecting 9, RULE_TYPE,RULE_INCOME,RULE_YEAR,Gender , AMOUNT_GENERAL , AMOUNT_SENIOR,AMOUNT_SUPER_SENIOR AND AGE_SENIOR AND AGE_SUPER_SENIOR")

}

owner, err = getCommonName(stub)

fmt.Printf("\nOwner: " + owner)

if owner != "Admin@orderer.example.com" {

shim.Error("The particular Org doesnt have access to the function")

}

RULE_TYPE = args[0]
RULE_INCOME = args[1]
RULE_YEAR = args[2]
GENDER = args[3]

AMOUNT_GENERAL = args[4]

AMOUNT_SENIOR = args[5]
AMOUNT_SUPER_SENIOR = args[6]

AGE_SENIOR = args[7]
AGE_SUPER_SENIOR = args[8]
fmt.Println("RULE_TYPE IS: " + RULE_TYPE + "RULE_INCOME" + RULE_INCOME + "RULE_YEAR" + RULE_YEAR + "GENDER IS : " + GENDER + " AMOUNT_GENERAL IS: " + AMOUNT_GENERAL + " AMOUNT_SENIOR IS: " + AMOUNT_SENIOR + " AMOUNT_SUPER_SENIOR IS: " + AMOUNT_SUPER_SENIOR + " AGE_SENIOR IS: " + AGE_SENIOR + " AGE_SUPER_SENIOR IS: " + AGE_SUPER_SENIOR)

if GENDER != "M" || GENDER != "F" || GENDER != "T" {

shim.Error("Invalid Gender")

}

m, err := stub.GetState("rules")

var p []byte
if string(m) == "" {

mt := make(map[string]map[string]string)
var RT []string
var RI []string
var GND []string
var ct int = 0
RI = append(RI, "INTEREST", "NET", "DEDUCTION")
RT = append(RT, "15G/H", "TDS-Statements", "Challans", "197-Certificate")
GND = append(GND, "M", "F", "T")

for i := 0; i < len(RT); i++ {
for j := 0; j < len(RI); j++ {
for k := 0; k < len(GND); k++ {
x, _ := json.Marshal(Rule{RT[i], RI[j], "0", GND[k], "0", "0", "0", "0", "0"})
ct = ct + 1
ct_str := strconv.Itoa(ct)
mt[ct_str] = map[string]string{}
mt[ct_str][RT[i]+"_"+RI[j]+"_0_"+GND[k]] = string(x)

fmt.Println(ct_str)

}
}
}

p, _ = json.Marshal(mt)

}

lt_mp := make(map[string]map[string]string)
if string(m) == "" {
json.Unmarshal(p, &lt_mp)
} else {
json.Unmarshal(m, &lt_mp)
}
var flg bool = false
var count int = 0
for k, v := range lt_mp {
fmt.Printf("key[%s] \n", k)
for u, w := range v {
t := Rule{}
err := json.Unmarshal([]byte(w), &t)
if err != nil {
fmt.Println("Error: ")
}
fmt.Printf("key[%s] value[%s]\n", u, t.RULE_TYPE)
a, _ := json.Marshal(Rule{RULE_TYPE, RULE_INCOME, RULE_YEAR, GENDER, AMOUNT_GENERAL, AMOUNT_SENIOR, AMOUNT_SUPER_SENIOR, AGE_SENIOR, AGE_SUPER_SENIOR})
if val, ok := lt_mp[k][RULE_TYPE+"_"+RULE_INCOME+"_"+RULE_YEAR+"_"+GENDER]; ok {
//do something here
flg = true
lt_temp := make(map[string]string)
lt_mp[k] = lt_temp
lt_mp[k][RULE_TYPE+"_"+RULE_INCOME+"_"+RULE_YEAR+"_"+GENDER] = string(a)
fmt.Println(val)
fmt.Println(ok)
}

count = count + 1
}

}
if flg == false {
b, _ := json.Marshal(Rule{RULE_TYPE, RULE_INCOME, RULE_YEAR, GENDER, AMOUNT_GENERAL, AMOUNT_SENIOR, AMOUNT_SUPER_SENIOR, AGE_SENIOR, AGE_SUPER_SENIOR})
c := strconv.Itoa(count + 1)
lt_temp := make(map[string]string)
lt_mp[c] = lt_temp
lt_mp[c][RULE_TYPE+"_"+RULE_INCOME+"_"+RULE_YEAR+"_"+GENDER] = string(b)
}
jsonString, _ := json.Marshal(lt_mp)

fmt.Println("jsonString is : " + string(jsonString))
err = stub.PutState("rules", []byte(jsonString))

if err != nil {

shim.Error("Error writing rules: " + err.Error())

}

return shim.Success(jsonString)

}

//Query for all keys

func (t *SimpleChaincode) QUERY_ALL_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

startKey := ""

endKey := ""

keysIter, err := stub.GetStateByRange(startKey, endKey)

if err != nil {

return shim.Error(fmt.Sprintf("keys operation failed. Error accessing state: %s", err))

}

defer keysIter.Close()

var keys []string

var result []string

for keysIter.HasNext() {

response, iterErr := keysIter.Next()

if iterErr != nil {

return shim.Error(fmt.Sprintf("keys operation failed. Error accessing state: %s", err))

}

keys = append(keys, response.Key)

}

m := make(map[string]string)

for k, v := range keys {

if v != "rules" {

fmt.Printf("key %d contains %s\n", k, v)

x, err := stub.GetState(v)

if err != nil {

return shim.Error("Error")

}

m[v] = string(x)

result = append(result, string(x))

}

}

jsonString, err := json.Marshal(m)

fmt.Println(err)

return shim.Success(jsonString)

}

// Query callback representing the query of a chaincode

func (t *SimpleChaincode) QUERY_BY_YEAR_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

var PAN string // Entities

var err error

if len(args) != 2 {

return shim.Error("Incorrect number of arguments. Expecting 2, PAN and YEAR")

}

PAN = args[0]

START_YEAR, err := strconv.Atoi(args[1])

// Get the state from the ledger

TOTAL_AMOUNT_OBJ, err := stub.GetState(PAN)

if err != nil {

jsonResp := "{\"Error\":\"Failed to get state for " + PAN + "\"}"

return shim.Error(jsonResp)

}

if TOTAL_AMOUNT_OBJ == nil {

jsonResp := "{\"Result\":\"No value found for PAN number: " + PAN + "\"}"

return shim.Success([]byte(jsonResp))

}

var amt []AmountByYear

err = json.Unmarshal(TOTAL_AMOUNT_OBJ, &amt)

if err != nil {

fmt.Println("Error Unmarshalling:", err)

}

var index int = -1

for i := 0; i < len(amt); i++ {

if amt[i].YEAR == START_YEAR {

index = i

break

}

}

if index == -1 {

jsonResp := "{\"Error\":\"No value found for Year: " + args[1] + "\"}"

return shim.Success([]byte(jsonResp))

} else {

jsonobj, _ := json.Marshal(amt[index])

jsonResp := string(jsonobj)

logger.Infof("Query Response:%s\n", jsonResp)

return shim.Success(jsonobj)

}

}

// Query callback representing the query of a chaincode

func (t *SimpleChaincode) GET_HISTORY_PAN_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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

// Query callback representing the query of a chaincode

func (t *SimpleChaincode) QUERY_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {

var PAN string // Entities

var err error

if len(args) != 1 {

return shim.Error("Incorrect number of arguments. Expecting 1, PAN")

}

PAN = args[0]

// Get the state from the ledger

TOTAL_AMOUNT_OBJ, err := stub.GetState(PAN)

if err != nil {

jsonResp := "{\"Error\":\"Failed to get state for " + PAN + "\"}"

return shim.Error(jsonResp)

}

if TOTAL_AMOUNT_OBJ == nil {

jsonResp := "{\"Error\":\"No value found for PAN number: " + PAN + "\"}"

return shim.Success([]byte(jsonResp))

}

jsonResp := string(TOTAL_AMOUNT_OBJ)

logger.Infof("Query Response:%s\n", jsonResp)

return shim.Success(TOTAL_AMOUNT_OBJ)

}

func main() {

err := shim.Start(new(SimpleChaincode))

if err != nil {

logger.Errorf("Error starting Simple chaincode: %s", err)

}

}
