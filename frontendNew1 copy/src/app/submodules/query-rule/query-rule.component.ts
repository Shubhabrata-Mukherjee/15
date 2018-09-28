import { Component, OnInit } from '@angular/core';
import { ItdService } from '../../itd/itd.service';

@Component({
  selector: 'app-query-rule',
  templateUrl: './query-rule.component.html',
  styleUrls: ['./query-rule.component.css'],
  providers: [ItdService]
})
export class QueryRuleComponent implements OnInit {

  constructor(private itdservice: ItdService) { }
  arr = []
  Tax_type_query: string;
  Gender_type_query: string;
  Year_type_query: string;
  Rule_type :string = "";
  ngOnInit() {
    this.Rule_type = "15G/H";
  }
  getRules() {
    this.arr = []
    // Rule_type :string = "";

    // Tax_type:string;
    // Gender_type:string;
    // Age_type:string;
    this.itdservice.getRules().subscribe(
      res => {
        //console.log("Resp",JSON.parse(res.Rules))
        var diction = JSON.parse(res.Rules)
        // alert(this.Rule_type)
        for (let i = 0; i < Object.keys(diction).length; i++) {
          //console.log(diction[Object.keys(diction)[i]])
          let dict = diction[Object.keys(diction)[i]];
          for (let j = 0; j < Object.keys(dict).length; j++) {
            this.arr.push(JSON.parse(dict[Object.keys(dict)[j]]))
          }
        }
        console.log("Arr is", this.arr)

        if (!(this.Rule_type === undefined)) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            //console.log("Element is",element)

            //console.log("this.Rule_type",that.Rule_type)
            return (element.RULE_TYPE === that.Rule_type);
          })
        }

        if (!(this.Tax_type_query === undefined || this.Tax_type_query == "")) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            return (element.RULE_INCOME === that.Tax_type_query);
          })
        }

        if (!(this.Gender_type_query === undefined || this.Gender_type_query == "")) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            return (element.GENDER === that.Gender_type_query);
          })
        }


        if (!(this.Year_type_query === undefined || this.Year_type_query == "")) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            return (element.RULE_YEAR === that.Year_type_query);
          })
        }

        this.arr = this.arr.filter(function (element) {
          return (element.RULE_YEAR !== "0");
        })

        console.log("Array length is: ", this.arr)
      },
      err => {
        console.log("Error getting rules")
      }
    )



  }
}
