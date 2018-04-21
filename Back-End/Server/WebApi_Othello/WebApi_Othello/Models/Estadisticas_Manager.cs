
﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApi_Othello.Models
{
    public class Estadisticas_Manager
    {
        //permite conectar a la base de datos
        private static string cadenaConexion =
            @"Data Source=.\SQLEXPRESS;Initial Catalog=Othello_DB;Integrated Security=True;User Id=sa;Password=Josue54321;MultipleActiveResultSets=True";
        SqlConnection connection = new SqlConnection(cadenaConexion);//permite establecer la conexion con la Base de Datos
        string sqlQuery;//almacena la consulta SQL, se utiliza en la mayoria de los metodos
        SqlCommand command;//permite realizar la consulta mediante la cadena conexion y la consulta


        public List<Estadisticas_Model> extract_stats(string ID_Facebook)
        {
            Estadisticas_Model objeto;
            List<Estadisticas_Model> list_result = new List<Estadisticas_Model>();
            try
            {
                connection.Open();
                sqlQuery = "select EP.ID_Facebook, EP.Partidas_Ganadas,EP.Partidas_Empatadas,EP.Partidas_Perdidas FROM dbo.[Estadisticas Persona] as EP where ID_Facebook = @ID_Facebook";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);
                SqlDataReader reader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

                while (reader.Read())
                {
                    objeto = new Estadisticas_Model //Obtiene los datos del jugador
                    {
                        ID_Facebook = reader.GetString(0),
                        Partidas_Ganadas = reader.GetInt32(1),
                        Partidas_Empatadas = reader.GetInt32(2),
                        Partidas_Perdidas = reader.GetInt32(3)
                    };
                    list_result.Add(objeto);
                }
                

                connection.Close();

                return list_result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }
        

    }
}