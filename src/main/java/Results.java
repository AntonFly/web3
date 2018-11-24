import com.jcraft.jsch.*;
import com.oracle.webservices.internal.api.message.PropertySet;

import javax.annotation.PreDestroy;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.FileHandler;
import java.util.logging.Logger;

@ManagedBean(name = "results")
@SessionScoped
public class Results {
    private final String sessionID;
    private final Logger logger;
    private final String TABLE_NAME;
    private Connection connection;
     {
        TABLE_NAME = "results";
        FacesContext fCtx = FacesContext.getCurrentInstance();
        HttpSession session = (HttpSession) fCtx.getExternalContext().getSession(false);
        sessionID = session.getId();
        logger = Logger.getLogger("logger");
         try {
             logger.addHandler(new FileHandler("log.txt"));
         } catch (Exception e) {
             logger.info(e.getMessage());
         }
         DBConnection.getConnection();
    }

    @PropertySet.Property("addResult")
    public int addResult() {
        Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        logger.info("Map "+requestParameterMap);
        String xstr = requestParameterMap.get("X");
        String ystr = requestParameterMap.get("xyr_form:y_input");
        String rstr = requestParameterMap.get("R");
        logger.info("X=" + xstr);
        logger.info("Y=" + ystr);
        logger.info("R=" + rstr);
        double x;
        double y;
        double r;
        try {
            x = Double.parseDouble(xstr.replace(',', '.'));
            y = Double.parseDouble(ystr.replace(',', '.'));
            r = Double.parseDouble(rstr.replace(',', '.'));
        } catch (Exception e) {
            return -1;
        }
        if (!MatchingManager.validate(x, y, r))
            return -1;
        boolean check = MatchingManager.isInArea(x, y, r);
        StringBuilder result = new StringBuilder();
        result.append("INSERT INTO ");
        result.append(TABLE_NAME);
        result.append(" (x,y,r,checking,sessionID) VALUES (");
        result.append(x);
        result.append(",");
        result.append(y);
        result.append(",");
        result.append(r);
        result.append(",'");
        result.append(check);
        result.append("','");
        result.append(sessionID);
        result.append("');");
        logger.info("try");
        try {
            DBConnection.setStatement();
            DBConnection.statement.executeUpdate(result.toString());
            DBConnection.closeStatement();
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.info("added");
        return -1;
    }

    public List<ResultRow>  getAllResults() {
        List<ResultRow> resultRows = new ArrayList<ResultRow>();
        try {
            DBConnection.setStatement();
            ResultSet resultSet = DBConnection.statement.executeQuery("SELECT * FROM " + TABLE_NAME +
                    " WHERE sessionID = '" + sessionID + "';");
            while (resultSet.next()) {
                ResultRow resultRow = new ResultRow();
                resultRow.setX(resultSet.getString("x"));
                resultRow.setY(resultSet.getString("y"));
                resultRow.setR(resultSet.getString("r"));
                resultRow.setMatch(resultSet.getString("checking").contains("t"));
                resultRows.add(resultRow);
            }
            resultSet.close();
            DBConnection.closeStatement();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return resultRows;
    }

//    @PreDestroy
//    private void clearResults() {
//        try {
//            DBConnection.setStatement();
//            DBConnection.statement.executeUpdate("DELETE FROM " + TABLE_NAME +
//                    " WHERE sessionID = '" + sessionID + "';");
//            DBConnection.closeStatement();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }


}