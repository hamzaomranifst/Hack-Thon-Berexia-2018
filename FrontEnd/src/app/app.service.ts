import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModel } from './table.model';

@Injectable()
export class NodeService {
  constructor(private http: HttpClient) { }
  baseUrl: string = 'http://192.168.1.100:8080/api';

  
  // This Method is user when we want to send multiple type of data in Post request
  // This Method shwos us that it can send a file and a Student Object
  SendFile(file : string) {
    let serviceName : string;
    if (file.indexOf('csv') >= 0) {
      serviceName = 'getHeaderCSV';
    }
    else {
      serviceName = 'getHeaderExcel';
    }
    let formData = new FormData();
    formData.append('file', file );
    return this.http.post<String[]>(this.baseUrl + '/' + serviceName, formData);
  }

  uploadFile(file : string) {
    let formData = new FormData();
    formData.append('file', file );
    return this.http.post<String[]>(this.baseUrl + '/' + 'uploadCSVSpark', formData);
  }

  selectOperation(dataset : string) {
    let formData = new FormData();
    formData.append('dataset', dataset );
    formData.append('columns', 'Life_ID, Policy_ID, Gender, Risk_Amount_Insurer' );
    formData.append('criteria', "Distribution_channel_detail = '3'" );
    return this.http.post<String[]>(this.baseUrl + '/' + 'selectOperation', formData);
  }

  groupOperation(dataset : string) {
    let formData = new FormData();
    formData.append('dataset', dataset );
    formData.append('groupcolumns', 'Life_ID, Policy_ID' );
    formData.append('agregations', 'Life_ID, Policy_ID, max(Risk_Amount_Insurer)' );
    return this.http.post<String[]>(this.baseUrl + '/' + 'groupOperation', formData);
  }

  combineOperation(dataset1 : string, dataset2: string) {
    let formData = new FormData();
    formData.append('dataset1', dataset1 );
    formData.append('dataset2', dataset2 );
    formData.append('clos1', 'Life_ID, Policy_ID, Gender, Risk_Amount_Insurer' );
    formData.append('clos2', 'Life_ID, Policy_ID' );
    return this.http.post<String[]>(this.baseUrl + '/' + 'combineOperation', formData);
  }

  selectOperationFinal(dataset : string) {
    let formData = new FormData();
    formData.append('dataset', dataset );
    formData.append('columns', '*' );
    formData.append('criteria', '' );
    return this.http.post<String[]>(this.baseUrl + '/' + 'selectOperationFinal', formData);
  }

  getFinalResultFromSpark() {
    return this.http.get<TableModel[]>(this.baseUrl + '/' + 'getResult');
  }

}
