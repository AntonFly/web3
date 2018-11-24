
/*--------sql---------*/


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/*-------ssh connection----*/
/*-------Config parse------*/

public class DBConnection
{

    public static Connection connection;
    static Statement statement;

    public DBConnection() {
        getConnection();
    }


    public static void getConnection()
    {
        try
        {
//            doSshTunnel();
            Class.forName("org.postgresql.Driver"); //Подгрузка системным класслоадером класс драйвер, который укзаан в classpath

            connection = DriverManager.getConnection("jdbc:postgresql://fly.sytes.net:5432/multhub", "anton_fly", "qwe123!@#"); //Драйвер менеджер находит первый подключенный драйвер и создает соединение
           statement= connection.createStatement();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }


    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~методы освобождение и создания ресурсов~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    public static void setStatement()
    {
        try {

           statement= connection.createStatement();
        }catch (SQLException ex){}
    }
    public static void closeStatement()
    {
        try
        {
            //connection.close();
            statement.close();
        }
        catch(SQLException ex)
        {
            //ex.printStackTrace();
        }
    }


}
