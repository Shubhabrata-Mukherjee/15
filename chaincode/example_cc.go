package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	b64 "encoding/base64"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("example_cc0")

// SimpleChaincode example simple Chaincode implementation

type SimpleChaincode struct {
}

type AmountByYear struct {
	PAN_NUMBER   string
	YEAR         int
	TOTAL_AMOUNT int
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	logger.Info("########### example_cc0 Init ###########")
	m := make(map[string]string)
	m["M"] = "250000"
	m["F"] = "300000"
	m["T"] = "500000"
	jsonString, err := json.Marshal(m)
	err = stub.PutState("rules", []byte(jsonString))
	if err != nil {
		shim.Error("Error in putting value to ledger")
	}

	return shim.Success(jsonString)

}

func (t *SimpleChaincode) queryRules(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	jsonResp, err := stub.GetState("rules")
	if err != nil {
		shim.Error("Error in putting value to ledger")
	}

	return shim.Success(jsonResp)
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
	if function == "queryRules" {
		return t.queryRules(stub, args)
	}

	logger.Errorf("Unknown action, check the first argument, must be one of 'UPDATE_15G',UPDATE_RULES_15G, 'QUERY_15' , 'QUERY_ALL_15G' or 'QUERY_BY_YEAR_15G'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'UPDATE_15G',UPDATE_RULES_15G, 'QUERY_15' , 'QUERY_ALL_15G'  or 'QUERY_BY_YEAR_15G'. But got: %v", args[0]))

}

func (t *SimpleChaincode) UPDATE_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var PAN string // Entities
	// var AMOUNT int
	var err error
	// var START_YEAR int // Entities

	// Initialize the chaincode
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3, PAN,AMOUNT AND START_YEAR")
	}

	PAN = args[0]
	AMOUNT, err := strconv.Atoi(args[1])
	START_YEAR, err := strconv.Atoi(args[2])
	TOTAL_AMOUNT_OBJ, err := stub.GetState(PAN)

	if err != nil {
		return shim.Error("Failed to get state")
	}

	var amt []AmountByYear
	obj := AmountByYear{
		PAN_NUMBER:   PAN,
		YEAR:         START_YEAR,
		TOTAL_AMOUNT: AMOUNT,
	}

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
			if amt[i].YEAR == START_YEAR {
				amt[i].TOTAL_AMOUNT = AMOUNT
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

func (t *SimpleChaincode) UPDATE_RULES_15G(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var GENDER string // Entities
	// var AMOUNT int
	var err error
	var owner string
	// var START_YEAR int // Entities
	var AMOUNT string
	// Initialize the chaincode
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2, Gender and Amount")
	}
	owner, err = getCommonName(stub)
	fmt.Printf("\nOwner: " + owner)
	if owner != "Admin@orderer.example.com" {
		shim.Error("The particular Org doesnt have access to the function")
	}

	GENDER = args[0]
	AMOUNT = args[1]
	fmt.Println("GENDER IS : " + GENDER + " AMOUNT IS: " + AMOUNT)

	if GENDER != "M" || GENDER != "F" || GENDER != "T" {
		shim.Error("Invalid Gender")
	}
	m, err := stub.GetState("rules")
	mp := make(map[string]string)
	err = json.Unmarshal(m, &mp)
	if err != nil {
		shim.Error("Error Unmarshalling: " + err.Error())
	}
	mp[GENDER] = AMOUNT
	fmt.Println("Gender: " + GENDER + " AMOUNT: " + AMOUNT)
	jsonString, err := json.Marshal(mp)
	fmt.Println("String is: " + string(jsonString))
	if err != nil {
		shim.Error("Error Marshalling")
	}
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
		if key != "rules" {
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
		jsonResp := "{\"Error\":\"No value found for PAN number: " + PAN + "\"}"
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

	jsonobj, _ := json.Marshal(amt[index])

	if index == -1 {
		jsonResp := "{\"Error\":\"No value found for Year: " + args[1] + "\"}"
		return shim.Success([]byte(jsonResp))
	}

	jsonResp := string(jsonobj)
	logger.Infof("Query Response:%s\n", jsonResp)

	return shim.Success(jsonobj)

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
