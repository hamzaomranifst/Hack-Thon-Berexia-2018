import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as go from 'gojs';
import { NodeService } from './app.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { TableModel } from './table.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First GoJS App in Angular';
  form: FormGroup;
  
  showTable :boolean = false;

  columns : String[] = ['c1','c2','c3'];

  tabmodel : TableModel[];
  
  model = new go.GraphLinksModel(
    /* [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" },
      { key: 3, text: "Gamma", color: "lightgreen" },
      { key: 4, text: "Delta", color: "pink" }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 1 }
    ] */);

  @ViewChild('text')
  private textField: ElementRef;
  keyInto: go.Key;
  data: any;
  node: go.Node;
  nodeInto: go.Node;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private formBuilder: FormBuilder
    ){

      this.form = this.formBuilder.group({
        cols: new FormArray([])
      });
  }

  showDetails(node: go.Node | null) {
    this.node = node;
    if (node) {
      // copy the editable properties into a separate Object
      this.data = {
        text: node.data.text,
        color: node.data.color
      };
    } else {
      this.data = null;
    }
  }

  onCommitDetails() {
    if (this.node) {
      const model = this.node.diagram.model;
      // copy the edited properties back into the node's model data,
      // all within a transaction
      model.startTransaction();
      model.commitTransaction("modified properties");
      
    }
  }

  onCancelChanges() {
    // wipe out anything the user may have entered
    this.showDetails(this.node);
    
  }

  onModelChanged(c: go.ChangedEvent) {
    // who knows what might have changed in the selected node and data?
    this.showDetails(this.node);
    
    //this.node.doubleClick();

    
  }

  isSelectTransformation(){
    if(this.node.data.type == 'transformation' && this.node.data.text == 'Select'){
      return true;
    }
    else{
      return false;
    }
  }

  isCombineTransformation(){
    if(this.node.data.type == 'transformation' && this.node.data.text == 'Combine'){
      return true;
    }
    else{
      return false;
    }
  }

  isGroupByTransformation(){

    if(this.node.data.type == 'transformation' && this.node.data.text == 'GroupBy'){
      return true;
    }
    else{
      return false;
    }
  }

  isDataset(){

    if(this.node.data.type == 'datasets'){       
      return true;
    }
    else{
      return false;
    }
  }

  extractHeader(){
      let file = this.node.diagram.findNodeForKey(this.node.findNodesInto().first().key).data.text;
      
        this.nodeService.SendFile(file).subscribe( data => {
          this.columns = data;
      });
  }

  runUploadPreapare(){
     this.nodeService.uploadFile('PolicyFile.csv').subscribe(data => { 
      this.nodeService.selectOperation('PolicyFile.csv').subscribe(data => { 
        this.nodeService.uploadFile('PolicyFilee.csv').subscribe(data => { 
          this.nodeService.groupOperation('PolicyFilee.csv').subscribe(data => {
            this.nodeService.combineOperation('PolicyFile.csv', 'PolicyFilee.csv').subscribe(data => {
              this.nodeService.selectOperationFinal('').subscribe(data => { 
                this.showTable = true;
                this.nodeService.getFinalResultFromSpark().subscribe(data => { 
                    this.tabmodel = data;                  
                 });
               });
            });
          });
        });
       });
      });


  }


}
