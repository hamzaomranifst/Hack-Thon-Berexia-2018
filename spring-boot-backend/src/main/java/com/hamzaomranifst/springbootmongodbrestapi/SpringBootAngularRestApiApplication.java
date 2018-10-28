package com.hamzaomranifst.springbootmongodbrestapi;

import org.apache.spark.SparkConf;
import org.apache.spark.sql.SparkSession;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringBootAngularRestApiApplication {

	public static SparkSession spark;

	public static void main(String[] args) {

		SparkConf configuration = new SparkConf()
			.setAppName("Hackthon Berexia 2018")
			.setMaster("local");

		spark = SparkSession
			.builder()
			.config(configuration)
			.getOrCreate();

		SpringApplication.run(SpringBootAngularMongoDbRestApiApplication.class, args);
	}
}
