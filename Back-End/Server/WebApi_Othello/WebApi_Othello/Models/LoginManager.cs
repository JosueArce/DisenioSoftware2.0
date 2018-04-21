using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Mvc;
using System.Data;

namespace WebApi_Othello.Models
{
    public class LoginManager
    {
        //permite conectar a la base de datos
        private static string cadenaConexion =
            @"Data Source=.\SQLEXPRESS;Initial Catalog=Othello_DB;Integrated Security=True;User Id=sa;Password=Josue54321;MultipleActiveResultSets=True";
        SqlConnection connection = new SqlConnection(cadenaConexion);//permite establecer la conexion con la Base de Datos
        string sqlQuery;//almacena la consulta SQL, se utiliza en la mayoria de los metodos
        SqlCommand command;//permite realizar la consulta mediante la cadena conexion y la consulta

       /// <summary>
       /// Verifica si el usuario tiene un espacio guardado en la bd, sino llama a la funcion para generar un nuevo espacio en la BD
       /// </summary>
       /// <param name="ID_Persona"></param>
       /// <returns></returns>
       public Boolean check_existence(string ID_Facebook,string nombre_jugador)
        {
            try
            {
                connection.Open();
                sqlQuery = "select COUNT(*) from dbo.[Jugadores] where ID_Facebook = @ID_Facebook";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();

                if (resp == -1 || resp == 0)
                {
                    create_new_user(ID_Facebook, nombre_jugador);
                    create_new_user_stats(ID_Facebook);
                    return true;
                }
                else
                {
                    logIn(ID_Facebook);
                    return true;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }

        public void create_new_user(string ID_Facebook,string nombre)
        {
            try
            {
                connection.Open();
                sqlQuery = "insert into dbo.[Jugadores] values(@ID_Facebook,@Nombre_Jugador,1)";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);
                command.Parameters.AddWithValue("@Nombre_Jugador", nombre);

                int resp = command.ExecuteNonQuery();

                connection.Close();       
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }

        public void create_new_user_stats(string ID_Facebook)
        {
            try
            {
                connection.Open();
                sqlQuery = "insert into dbo.[Estadisticas Persona] values(@ID_Facebook,0,0,0)";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }

        public void logIn(string ID_Facebook)
        {
            try
            {
                connection.Open();
                sqlQuery = "update dbo.[Jugadores] set Activo = 1 where ID_Facebook = @ID_Facebook";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }

        public bool logOut(string ID_Facebook)
        {
            try
            {
                connection.Open();
                sqlQuery = "update dbo.[Jugadores] set Activo = 0 where ID_Facebook = @ID_Facebook";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }
    }
}