/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence.impl;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Movie;
import edu.eci.arsw.cinema.persistence.CinemaException;
import edu.eci.arsw.cinema.persistence.CinemaPersistenceException;
import edu.eci.arsw.cinema.persistence.CinemaPersitence;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import edu.eci.arsw.cinema.model.Fecha;

/**
 *
 * @author cristian
 */
@Service
public class InMemoryCinemaPersistence implements CinemaPersitence {

	//private final Map<String, Cinema> cinemas = new HashMap<>();

	private final ConcurrentHashMap<String, Cinema> cinemas = new ConcurrentHashMap<>();
	
	public InMemoryCinemaPersistence() {
		// load stub data
		// Primer cinema
		String functionDate = "2018-09-03 05:30";
		List<CinemaFunction> functions = new ArrayList<>();
		CinemaFunction funct1 = new CinemaFunction(new Movie("SuperHeroes Movie", "Action"), functionDate);
		CinemaFunction funct2 = new CinemaFunction(new Movie("The Night", "Horror"), functionDate);
		functions.add(funct1);
		functions.add(funct2);
		Cinema c = new Cinema("cinemaX", functions);
		cinemas.put("cinemaX", c);

		// Segundo cinema
		String functionDate2 = "2020-09-03 09:20";
		List<CinemaFunction> functions2 = new ArrayList<>();
		CinemaFunction funct3 = new CinemaFunction(new Movie("Avengers ENDGAME", "Ficcion"), functionDate2);
		CinemaFunction funct4 = new CinemaFunction(new Movie("Saw 15", "Horror"), functionDate2);
		functions2.add(funct3);
		functions2.add(funct4);
		Cinema c2 = new Cinema("cinemaSuba", functions2);

		cinemas.put("cinemaSuba", c2);
	}

	@Override
	public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException {
		if (!cinemas.containsKey(cinema))
			throw new CinemaException("El cinema " + cinema + " no existe");
		Cinema c = cinemas.get(cinema);
		List<CinemaFunction> f = c.getFunctions();
		for (int i = 0; i < f.size(); i++) {
			if (f.get(i).getMovie().getName().equals(movieName)) {
				f.get(i).buyTicket(row, col);
			}
		}

	}

	@Override
	public List<CinemaFunction> getFunctionsbyCinemaAndDate(String cinema, String date) throws CinemaPersistenceException {
		boolean in = false;
		List<CinemaFunction> cfR = new ArrayList<CinemaFunction>();
        Cinema cinemaT = getCinema(cinema);
		for (CinemaFunction cf : cinemaT.getFunctions()) {
			String sinHora = cf.getDate().substring(0,10).trim();
			if (cf.getDate().equals(date) || sinHora.equals(date)) {
				in = true;
				cfR.add(cf);
			}
		}
		if(!in) throw new CinemaPersistenceException("La fecha no concuerda con ninguna función del cinema "+cinema);
		return cfR;
	}

	

	@Override
	public void saveCinema(Cinema c) throws CinemaPersistenceException {
		if (cinemas.containsKey(c.getName())) {
			throw new CinemaPersistenceException("The given cinema already exists: " + c.getName());
		} else {
			cinemas.put(c.getName(), c);
		}
	}

	@Override
	public Cinema getCinema(String name) throws CinemaPersistenceException {
		if (!cinemas.containsKey(name))
			throw new CinemaPersistenceException("El cinema " + name + " no está");
		return cinemas.get(name);
	}

	@Override
	public Set<Cinema> getAllCinemas() {
		Set<Cinema> res = new HashSet<Cinema>();
		for (Cinema c : cinemas.values()) {
			res.add(c);
		}
		return res;
	}

	@Override
	public List<Movie> filterA(String cinema, String date, String gender) throws CinemaPersistenceException {
		throw new UnsupportedOperationException("No se tiene implementado el filtro A.");
	}

	@Override
	public List<Movie> filterB(String cinema, String date, int emptySeats) throws CinemaPersistenceException {
		if (!cinemas.containsKey(cinema))
			throw new CinemaPersistenceException("El cinema " + cinema + " no existe");
		ArrayList<Movie> result = new ArrayList<Movie>();
		Set<Cinema> c = getAllCinemas();
		Cinema ci = getCinema(cinema);
		List<CinemaFunction> fu = ci.getFunctions();
		for (CinemaFunction fun : fu) {
			if (fun.seatsAvailability() > emptySeats && fun.getDate().equals(date)) {
				result.add(fun.getMovie());
			}
		}
		return result;
	}

	@Override
	public void addCinemaFunction(String cinema, String movie, String genero, String date) throws CinemaPersistenceException {
		if (!cinemas.containsKey(cinema)) throw new CinemaPersistenceException("El cinema " + cinema + " no existe");
		Cinema cinemaTemp = cinemas.get(cinema);
		cinemaTemp.addCinemaFunction(new CinemaFunction(new Movie(movie, genero),date));
		
	}

	@Override
	public void updateCinemaByName(String name, Cinema cinema) throws CinemaPersistenceException {
		if (!cinemas.containsKey(name)) throw new CinemaPersistenceException("El cinema " + name + " no existe");
		cinemas.remove(name);
		cinemas.put(cinema.getName(), cinema);
		
		
	}

	@Override
	public void updateCinemaByNameAndDate(String name, String date, Cinema cinema) throws CinemaPersistenceException {
		// TODO Auto-generated method stub
		
	}
	
	@Override	
	public void updateDateCinemaFunction(String name,CinemaFunction cf) throws CinemaPersistenceException{
		List<CinemaFunction> listac=cinemas.get(name).getFunctions();
		for (CinemaFunction cinema : listac) {
			System.out.println(cinema.getMovie().getName());
			if (cinema.getMovie().getName().equals(cf.getMovie().getName())) {
				System.out.println(cf.getDate());
				cinema.setDate(cf.getDate());
			}
		}
	}

	@Override
	public void deleteCinemaFunction(String name, CinemaFunction cf) throws CinemaPersistenceException{
		if(!cinemas.containsKey(name)) {
			throw new CinemaPersistenceException("El cinema no se encuentra");
		}
		
		for (CinemaFunction  cinema : cinemas.get(name).getFunctions()){
			if(cinema.getMovie().getName().equals(cf.getMovie().getName())) {
				cinemas.get(name).deleteCinemaFunction(cinema);
			}
		}
		
	}



}
