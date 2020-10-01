package edu.eci.arsw.cinema.model;

public class Fecha {
	private String año;
	private String mes;
	private String dia;
	private String hora;
	private String minuto;
	
	public Fecha(String año, String mes, String dia, String hora, String minuto) {
		this.año = año;
		this.mes = mes;
		this.dia = dia;
		this.hora = hora;
		this.minuto = minuto;
	}
	
	public Fecha(String año, String mes, String dia) {
		this.año = año;
		this.mes = mes;
		this.dia = dia;
	}

	public String getAño() {
		return año;
	}

	public void setAño(String año) {
		this.año = año;
	}

	public String getMes() {
		return mes;
	}

	public void setMes(String mes) {
		this.mes = mes;
	}

	public String getDia() {
		return dia;
	}

	public void setDia(String dia) {
		this.dia = dia;
	}

	public String getHora() {
		return hora;
	}

	public void setHora(String hora) {
		this.hora = hora;
	}

	public String getMinuto() {
		return minuto;
	}

	public void setMinuto(String minuto) {
		this.minuto = minuto;
	}
	
	public String getFecha() {
		return año+"-"+mes+"-"+dia;
	}
	
	public String getFechaAndHora() {
		return año+"-"+mes+"-"+dia+" "+hora+":"+minuto;
	}
	
	
	
	

}
