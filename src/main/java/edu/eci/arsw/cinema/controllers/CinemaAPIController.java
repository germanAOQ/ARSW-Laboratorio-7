/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.controllers;

import edu.eci.arsw.cinema.services.CinemaServices;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.databind.ser.std.CollectionSerializer;
import com.google.gson.*;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.persistence.CinemaException;
import edu.eci.arsw.cinema.persistence.CinemaPersistenceException;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


/**
 *
 * @author cristian
 */
@RestController
@RequestMapping("/cinemas")
public class CinemaAPIController {

@Autowired
CinemaServices cinemaServices;

    
@RequestMapping(method = RequestMethod.GET)
public ResponseEntity<?> manejadorGetRecursoCinema(){
    try {
        //obtener datos que se enviarán a través del API
        String data = new Gson().toJson(cinemaServices.getAllCinemas());
        return new ResponseEntity<>(data,HttpStatus.ACCEPTED);
    } catch (Exception ex) {
        Logger.getLogger(Controller.class.getName()).log(Level.SEVERE, null, ex);
        return new ResponseEntity<>("Recurso no encontrado",HttpStatus.NOT_FOUND);
    }        
}

@GetMapping("/{name}")
public ResponseEntity<?> getFunctions(@PathVariable String name) throws CinemaException{
    try {
    	String data = new GsonBuilder().setPrettyPrinting().create().toJson((ArrayList<CinemaFunction>) cinemaServices.getCinemaByName(name).getFunctions());
        return new ResponseEntity<>(data,HttpStatus.ACCEPTED);
    } catch (CinemaPersistenceException ex) {
        Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }
}

@GetMapping("/{cinema}/{date}")
public ResponseEntity<?> getFunctionsbyCinemaAndDate(@PathVariable String cinema,@PathVariable String date) {
    try{
        ArrayList<CinemaFunction> temp = (ArrayList<CinemaFunction>) cinemaServices.getFunctionsbyCinemaAndDate(cinema, date);
        System.out.println(temp);
        String data = new Gson().toJson(temp);
        return new ResponseEntity<>(data,HttpStatus.ACCEPTED);

    } catch (CinemaPersistenceException ex) {
        Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

}

@GetMapping("/{cinema}/{date}/{moviename}")
public ResponseEntity<?> getFunctionsbyCinemaDateandMoviename(@PathVariable String cinema,@PathVariable String date,@PathVariable String moviename){
	try {
		CinemaFunction cf = cinemaServices.getFunctionByCinemaDateMovieName(cinema, date, moviename);
		String data = new Gson().toJson(cf);
        return new ResponseEntity<>(data,HttpStatus.ACCEPTED);
	} catch (CinemaPersistenceException ex) {
		Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	
}

@RequestMapping(value="/{name}", method = RequestMethod.POST)	
public ResponseEntity<?> addCinemaFunction(@PathVariable String name, @RequestBody CinemaFunction cf){
        try {
			cinemaServices.addCinemaFunction(name, cf.getMovie().getName(), cf.getMovie().getGenre(), cf.getDate());
		} catch (CinemaPersistenceException e) {
			Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, e);
	        return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN); 
		}
		return new ResponseEntity<>(HttpStatus.CREATED);


}

@RequestMapping(value="/{name}", method = RequestMethod.PUT)	
public ResponseEntity<?> updateCinemaByName(@PathVariable String name, @RequestBody Cinema cinema){
	try {
		cinemaServices.updateCinemaByName(name, cinema);
	} catch (CinemaPersistenceException e) {
		Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, e);
        return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN); 
	}
	return new ResponseEntity<>(HttpStatus.CREATED);
}


@RequestMapping(value="/{nameC}/{movie}", method = RequestMethod.PUT)	
public ResponseEntity<?> updateDateCinemaFunction(@PathVariable String nameC,@PathVariable String movie, @RequestBody CinemaFunction cf){
	try {
		cinemaServices.updateDateCinemaFunction(nameC, cf);
	} catch (CinemaPersistenceException e) {
		Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, e);
        return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN); 
	}
	return new ResponseEntity<>(HttpStatus.CREATED);
}

@RequestMapping(value="/{name}", method = RequestMethod.DELETE)	
public ResponseEntity<?> updateDateCinemaFunction(@PathVariable String name, @RequestBody CinemaFunction cf){
	try {
		cinemaServices.deleteCinemaFunction(name, cf);
	} catch (CinemaPersistenceException e) {
		Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, e);
        return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN); 
	}
	return new ResponseEntity<>(HttpStatus.CREATED);
}


}

