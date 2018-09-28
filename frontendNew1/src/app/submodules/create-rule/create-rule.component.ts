import { Component, OnInit } from '@angular/core';
import { ItdService } from '../../itd/itd.service';

@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.css'],
  providers: [ItdService]
})
export class CreateRuleComponent implements OnInit {
  Rule_type :string = "";

  Tax_type:string;
  Gender_type:string;
  Year_type:string;
  Amount_general:string;
  Amount_senior:string;
  Age_senior:string;
  Amount_supersenior:string;
  Age_supersenior:string;
  constructor(private itdservice:ItdService) { }

  ngOnInit() {
    this.Rule_type = "15G/H";
  }

  updateRules() {
    this.itdservice.updateRules(this.Rule_type,this.Tax_type,this.Year_type,this.Gender_type,this.Amount_general,this.Amount_senior,this.Amount_supersenior,this.Age_senior,this.Age_supersenior).subscribe(
      res=> {
        console.log("Resp",res)
        alert("Updation "+res.Result)
      },
      err => {
        console.log("Error updating rules")
      }
    )
   }
}
