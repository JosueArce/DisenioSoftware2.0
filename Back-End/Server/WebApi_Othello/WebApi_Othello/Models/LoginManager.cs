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
       public Boolean check_existence(string ID_Facebook)
        {
            try
            {
                connection.Open();
                sqlQuery = "select COUNT(*) from dbo.[Estadisticas Persona] where ID_Facebook = @ID_Facebook";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();

                if (resp == 0) return false; // no existe, por ende se generó un nuevo espacio
                else return true; //ya existe
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }

        public Boolean create_new_user(string ID_Facebook)
        {
            try
            {
                connection.Open();
                sqlQuery = "insert into dbo.[Estadisticas Persona] values(@ID_Facebook)";
                command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@ID_Facebook", ID_Facebook);

                int resp = command.ExecuteNonQuery();

                connection.Close();

                if (resp == -1) return false;
                else return true;       
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw new InvalidOperationException(e.Message);
            }
        }
    }
}