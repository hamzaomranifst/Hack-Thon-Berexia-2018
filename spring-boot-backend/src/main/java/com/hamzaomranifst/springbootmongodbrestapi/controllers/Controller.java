package com.hamzaomranifst.springbootmongodbrestapi.controllers;

import javax.servlet.http.HttpServletRequest;

import com.hamzaomranifst.springbootmongodbrestapi.SpringBootAngularMongoDbRestApiApplication;

import com.hamzaomranifst.springbootmongodbrestapi.models.ModelShow;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class Controller {

    private final String SPARK_STORE = "/home/hamza/spark_storage/";
    private final String DIR_FILES = "/home/hamza/Desktop/berexia_data/";

    @PostMapping(value = "/uploadCSVSpark", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean uploadCSVSpark(@RequestParam(value = "file") String file, HttpServletRequest request) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark.
                read()
                .option("header", "true")
                .csv(DIR_FILES + file);


        String path = SPARK_STORE + file;
        df.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);

        return true;

    }

    @PostMapping(value = "/uploadExcelSpark", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean uploadExcelSpark(@RequestParam(value = "file") String file, HttpServletRequest request) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark
            .read()
            .format("com.crealytics.spark.excel")
            .option("location", DIR_FILES + file)
            .option("useHeader", "true")
            .option("treatEmptyValuesAsNulls", "true")
            .option("inferSchema", "true")
            .option("addColorColumns", "False")
            .load();

        String path = SPARK_STORE + file;
        df.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);
        return true;

    }

    @PostMapping(value = "/selectOperation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean selectOperation(@RequestParam(value = "dataset") String dataset,
                                @RequestParam(value = "columns") String cols,
                                @RequestParam(value = "criteria") String criteria,
                                HttpServletRequest request) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark.
                read().
                option("header", "true")
                .csv(SPARK_STORE + dataset);


        df.createOrReplaceTempView("temp_tab");

        String query = "select " + cols + " from temp_tab ";
        if(criteria != null && !criteria.isEmpty())
            query += "where " + criteria;

        Dataset<Row> resultDF = SpringBootAngularMongoDbRestApiApplication.spark
                .sql(query);

        String path = SPARK_STORE + dataset + "/resultselect";
        resultDF.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);

        return true;

    }

    @PostMapping(value = "/groupOperation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean groupOperation(@RequestParam(value = "dataset") String dataset,
                                @RequestParam(value = "groupcolumns") String groupCols,
                                @RequestParam(value = "agregations") String agregation,
                                HttpServletRequest request) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark
                .read()
                .option("header", "true")
                .csv(SPARK_STORE + dataset);


        df.createOrReplaceTempView("temp_tab");

        String query = "select " + agregation + " from temp_tab group by " + groupCols;

        Dataset<Row> resultDF = SpringBootAngularMongoDbRestApiApplication.spark
                .sql(query);


        String path = SPARK_STORE + dataset + "/resultgroup";
        resultDF.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);
        return true;

    }


    @PostMapping(value = "/combineOperation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean combineOperation(@RequestParam(value = "dataset1") String dataset1,
                                 @RequestParam(value = "dataset2") String dataset2,
                                 @RequestParam(value = "clos1") String cols1,
                                 @RequestParam(value = "clos2") String cols2,
                                 HttpServletRequest request) {

        Dataset<Row> df1 = SpringBootAngularMongoDbRestApiApplication.spark
                .read()
                .option("header", "true")
                .csv(SPARK_STORE + dataset1 + "/resultselect");

        df1.createOrReplaceTempView("temp_tab1");

        Dataset<Row> df2 = SpringBootAngularMongoDbRestApiApplication.spark
                .read()
                .option("header", "true")
                .csv(SPARK_STORE + dataset2 + "/resultgroup");

        df2.createOrReplaceTempView("temp_tab2");

        String[] columns1 = cols1.split(",");
        String[] columns2 = cols2.split(",");

        String tabCols = "";
        for(int i = 0; i < columns1.length - 1; i++) {
            tabCols += "tab1." + columns1[i].trim() + " , ";
        }
        tabCols += "tab1." + columns1[columns1.length - 1].trim();

        String query = "select " + tabCols + " from temp_tab1 tab1"
                + " inner join temp_tab2 tab2"
                + " where ";

        for(int i = 0; i < columns2.length - 1; i++) {
                query += "tab1." + columns1[i].trim() + " = " + "tab2." + columns2[i].trim() + " and ";
        }
        query += "tab1." + columns1[columns2.length - 1].trim() + " = " + "tab2." + columns2[columns2.length -1].trim();

        Dataset<Row> resultDF = SpringBootAngularMongoDbRestApiApplication.spark
                .sql(query);

        String path = SPARK_STORE + "resultcombine.csv";
        resultDF.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);
        return true;
    }


    @PostMapping(value = "/selectOperationFinal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean electOperationFinal(@RequestParam(value = "dataset") String dataset,
                                @RequestParam(value = "columns") String cols,
                                @RequestParam(value = "criteria") String criteria,
                                HttpServletRequest request) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark.
                read().
                option("header", "true")
                .csv(SPARK_STORE + "/resultcombine.csv");


        df.createOrReplaceTempView("temp_tab");

        String query = "select " + cols + " from temp_tab ";
        if(criteria != null && !criteria.isEmpty())
            query += "where " + criteria;

        Dataset<Row> resultDF = SpringBootAngularMongoDbRestApiApplication.spark
                .sql(query);


        String path = SPARK_STORE +  "/selectFinalResult";
        resultDF.write().mode("overwrite").option("header", "true").format("com.databricks.spark.csv").save(path);
        return true;


    }

    @GetMapping(value = "getResult")
    public List<ModelShow> getResult() {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark.
                read().
                option("header", "false")
                .csv(SPARK_STORE + "/selectFinalResult");

        List<ModelShow> list = df.collectAsList().stream().skip(1).map(mapToStudent).collect(Collectors.toList());

        return list;
    }

    @PostMapping(value = "/getHeaderCSV", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String[] getHeader(@RequestParam(value = "file") String file) {

        Dataset<Row> df = SpringBootAngularMongoDbRestApiApplication.spark
                .read()
                .option("header", "true")
                .csv(DIR_FILES + file);

        return df.columns();
    }

    private Function<Row, ModelShow> mapToStudent = (row) -> {
        String[] colls = row.toString()
                                .split(",");
        ModelShow item = new ModelShow();
        item.setLid(colls[0]);
        item.setSid(colls[1]);
        item.setAmr(colls[2]);
        return item;
    };


}