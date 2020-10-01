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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 *
 * @author Nicolás
 */

public class AnotherCinemaPersistence implements CinemaPersitence {

	private final Map<String, Cinema> cinemas = new HashMap<>();

	public AnotherCinemaPersistence() {
		// load stub data
		String functionDate = "2018-12-18 15:30";
		List<CinemaFunction> functions = new ArrayList<>();
		CinemaFunction funct1 = new CinemaFunction(new Movie("SuperHeroes Movie", "Action"), functionDate);
		CinemaFunction funct2 = new CinemaFunction(new Movie("The Night", "Horror"), functionDate);
		functions.add(funct1);
		functions.add(funct2);
		Cinema c = new Cinema("cinemaX", functions);
		cinemas.put("cinemaX", c);
	}

	@Override
	public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException {
		if(!cinemas.containsKey(cinema)) throw new CinemaException("El cinema "+cinema+" no existe");
		Cinema c = cinemas.get(cinema);
		List<CinemaFunction> f = c.getFunctions();
		for (int i = 0; i < f.size(); i++) {
			if (f.get(i).getMovie().getName().equals(movieName)) {
				f.get(i).buyTicket(row, col);
			}
		}

	}

	@Override
	public List<CinemaFunction> getFunctionsbyCinemaAndDate(String cinema, String date) {
		List<CinemaFunction> cfR = new ArrayList<CinemaFunction>();
		for (CinemaFunction cf : cinemas.get(cinema).getFunctions()) {
			if (cf.getDate() == date) {
				cfR.add(cf);
			}
		}
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
		if(!cinemas.containsKey(cinema)) throw new CinemaPersistenceException("El cinema "+cinema+" no existe");
		ArrayList<Movie> result = new ArrayList<Movie>();
		Set<Cinema> c = getAllCinemas();
		Cinema ci = getCinema(cinema);
		List<CinemaFunction> fu = ci.getFunctions();
		for (CinemaFunction fun : fu) {
			if (fun.getMovie().getGenre().equals(gender) && fun.getDate().equals(date)) {
				result.add(fun.getMovie());
			}
		}

		return result;
	}

	@Override
	public List<Movie> filterB(String cinema, String date, int emptySeats) throws CinemaPersistenceException {
		throw new UnsupportedOperationException("No se tiene implementado el filtro B.");
	}

	@Override
	public void addCinemaFunction(String cinema, String movie, String genero, String date) throws CinemaPersistenceException {
		if (!cinemas.containsKey(cinema)) throw new CinemaPersistenceException("El cinema " + cinema + " no existe");
		Cinema cinemaTemp = cinemas.get(cinema);
		cinemaTemp.addCinemaFunction(new CinemaFunction(new Movie(movie, genero),date));
		
	}

	@Override
	public void updateCinemaByName(String name, Cinema cinema) throws CinemaPersistenceException{
		if (!cinemas.containsKey(cinema)) throw new CinemaPersistenceException("El cinema " + cinema + " no existe");
		Cinema c = cinemas.get(name);
		c.setName(cinema.getName());
		c.setSchedule(cinema.getFunctions());
		
	}

	@Override
	public void updateCinemaByNameAndDate(String name, String date, Cinema cinema) throws CinemaPersistenceException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateDateCinemaFunction(String name, CinemaFunction cf) throws CinemaPersistenceException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteCinemaFunction(String name, CinemaFunction cf) {
		// TODO Auto-generated method stub
		
	}

}
