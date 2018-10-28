import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Testability } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();
  private palette: go.Palette = new go.Palette();
  private palette2: go.Palette = new go.Palette();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  @ViewChild('paletteDiv2')
  private paletteRef2: ElementRef;

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }

  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

  constructor(private router: Router,private route: ActivatedRoute,) {
    
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
        e => {
          const node = e.diagram.selection.first();
          this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    this.diagram.grid.visible = true;

    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape,
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("figure", "fig"),
          new go.Binding("fill", "color")),
          
        $(go.TextBlock,
          {  margin: 8, editable: true},
          new go.Binding("text").makeTwoWay()),

        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("type").makeTwoWay()),

          
      );

    this.diagram.linkTemplate =
      $(go.Link,
        // allow relinking
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    this.palette = new go.Palette();
    this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;

    // initialize contents of Palette
    this.palette.model.nodeDataArray =
      [
        { key: 1 , text: "Select", color: "grey"  , type:"transformation" , fig: "RoundedRectangle"},
        { key: 2 , text: "Combine", color: "grey" ,  type:"transformation",fig: "RoundedRectangle"},
        { key: 3 , text: "GroupBy", color: "grey" ,  type:"transformation",fig: "RoundedRectangle"},
      ];
    

    this.palette2 = new go.Palette();
    this.palette2.nodeTemplateMap = this.diagram.nodeTemplateMap;

    // initialize contents of Palette
    this.palette2.model.nodeDataArray =
      [
        { key: 4 , type:"datasets" ,text: "PolicyFile.csv", color: "grey",fig: "Ellipse"  },
        { key: 5 , type:"datasets" ,text: "result1351.xlsx", color: "grey",fig: "Ellipse"}
      ];
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.palette.div = this.paletteRef.nativeElement;
    this.palette2.div = this.paletteRef2.nativeElement;
  }

}
